<?php
$allowedOrigins = ["*"];
$allowedDestinations = ["*"];

$excludeHeaders = [
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods",
    "Access-Control-Expose-Headers",
    "Cross-Origin-Resource-Policy",
    "X-Frame-Options"
];

function send_error($code, $message)
{
    http_response_code($code);
    header("Content-Type: application/json");
    exit(json_encode(["error" => $message, "error_generated_by" => "proxy"], JSON_UNESCAPED_SLASHES));
}

function origin_from_url($url)
{
    extract(parse_url($url));
    if (!isset($scheme) || !isset($host)) return null;
    return "$scheme://$host" . (isset($port) ? ":$port" : "");
}

if (isset($_SERVER["HTTP_ORIGIN"])) $origin = origin_from_url($_SERVER["HTTP_ORIGIN"]);
else if (isset($_SERVER["HTTP_REFERER"])) $origin = origin_from_url($_SERVER["HTTP_REFERER"]);

$requestMethod = $_SERVER["REQUEST_METHOD"];

if (
    isset($origin) &&
    // if allowedOrigins includes * or origin
    array_intersect($allowedOrigins, ["*", $origin])
) {
    header("Vary: Origin");
    header("Access-Control-Allow-Origin: $origin");
    if ($requestMethod === "OPTIONS") {
        header("Access-Control-Allow-Headers: *");
        header("Access-Control-Allow-Methods: *");
        http_response_code(204);
        exit(0);
    }
    header("Access-Control-Expose-Headers: *");
    header("Cross-Origin-Resource-Policy: cross-origin");
} else {
    header("X-Frame-Options: DENY");
    header("Cross-Origin-Resource-Policy: same-origin");
}

if (!isset($_REQUEST["url"]))
    send_error(400, "Required perameter url is missing.");

$destinationUrl = $_REQUEST["url"];
$destination = origin_from_url($destinationUrl);
$is_url_valid = filter_var($destinationUrl, FILTER_VALIDATE_URL);

if (!$destination || !$is_url_valid)
    send_error(400, "Provided url is not valid.");

// if allowedDestinations does not includes * or destination
if (!array_intersect($allowedDestinations, ["*", $destination]))
    send_error(400, "Requests to $destination are not allowed.");

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $destinationUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HEADER, 1);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $requestMethod);

// client {headers} => server
$clientHeaders = [];
foreach (getallheaders() as $header => $value) {
    // exclude the "host" header
    if (!preg_match("/host/i", $header)) {
        $clientHeaders[] = "$header: $value";
    }
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $clientHeaders);

// client {body} => server
$body = file_get_contents("php://input");
if ($body) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);

// execute curl and retrieve the response along with additional information
$response = curl_exec($ch);
$responseStatusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$responseContentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$responseHeaderSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

if ($responseStatusCode === 0)
    send_error(500, "$destination can't be reached.");

// server {status code} => client
http_response_code($responseStatusCode);

// server {headers} => client
if (isset($_REQUEST["download"]) && $_REQUEST["download"] === "1") {
    $excludeHeaders[] = "Content-Type";
    header("Content-Type: application/octet-stream");
}

$exclusionPattern = "/" . join("|", $excludeHeaders) . "/i";
$headersFromServer = explode("\r\n", substr($response, 0, $responseHeaderSize));

foreach ($headersFromServer as $header) {
    if (!preg_match($exclusionPattern, $header) && !empty($header)) {
        header($header);
    }
}

// server {body} => client
echo substr($response, $responseHeaderSize);
