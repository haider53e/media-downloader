export function makeBackendUrl(url) {
  return (PROXY ? PROXY + "/?url=" : "") + (SERVER ? SERVER : "") + BASE + url;
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
