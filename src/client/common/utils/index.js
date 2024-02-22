export function makeBackendUrl(url, noProxy) {
  return (PROXY && !noProxy ? PROXY + "/?url=" : "") + SERVER + url;
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
