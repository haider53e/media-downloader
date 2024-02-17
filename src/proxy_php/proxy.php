<?php
header("Access-Control-Allow-Origin: *");

function send_error($code, $message)
{
    http_response_code($code);
    header("Content-Type: application/json");
    exit(json_encode(["error" => $message, "error_generated_by" => "proxy"], JSON_UNESCAPED_SLASHES));
}

function origin_from_url($url)
{
    $parsed_url = parse_url($url);
    if ($parsed_url === false) return null;

    $origin = $parsed_url["scheme"] . "://" . $parsed_url["host"];
    if (isset($parsed_url["port"])) $origin .= ":" . $parsed_url["port"];

    return $origin;
}

if (!isset($_REQUEST["url"]))
    send_error(500, "Required perameter 'url' is missing.");

$is_url_valid = !filter_var($_REQUEST["url"], FILTER_VALIDATE_URL)
    || !($origin = origin_from_url($_REQUEST["url"]));

if ($is_url_valid)
    send_error(500, "Provided 'url' is not valid.");

$allowedOrigins = ["http://localhost:3001"];

if (!in_array($origin, $allowedOrigins))
    send_error(500, "Provided 'url' is not allowed.");

$requestUrl = $_REQUEST["url"];
$requestHeaders = getallheaders();
$requestMethod = $_SERVER["REQUEST_METHOD"];


$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $requestUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HEADER, 1);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $requestMethod);

// client {headers} => server
$clientHeaders = [];
foreach ($requestHeaders as $header => $value) {
    // exclude the "host" header
    if (!preg_match("/host/i", $header)) {
        $clientHeaders[] = "$header: $value";
    }
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $clientHeaders);

// client {body} => server
if ($requestMethod === "POST" || $requestMethod === "PUT") {
    $postData = file_get_contents("php://input");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
}

// execute curl and retrieve the response along with additional information
$response = curl_exec($ch);
$responseStatusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$responseContentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$responseHeaderSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

if ($responseStatusCode === 0)
    send_error(500, parse_url($_REQUEST["url"])["host"] . " can't be reached.");

// server {status code} => client
http_response_code($responseStatusCode);

// headers which should be excluded
$excludeHeaders = ["Content-Security-Policy", "Access-Control-Allow-Origin"];
if (isset($_REQUEST["download"]) && $_REQUEST["download"] === "1") {
    $excludeHeaders[] = "Content-Type";
    header("Content-Type: application/octet-stream");
}

// server {headers} => client
$exclusionPattern = "/" . join("|", $excludeHeaders) . "/i";
foreach (explode("\r\n", substr($response, 0, $responseHeaderSize)) as $header) {
    if (!preg_match($exclusionPattern, $header) && !empty($header)) {
        header($header);
    }
}

// server {body} => client
echo substr($response, $responseHeaderSize);
