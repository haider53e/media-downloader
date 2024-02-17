export function makeBackendUrl(url) {
  return (PROXY ? PROXY + "/?url=" : "") + SERVER + url;
}
