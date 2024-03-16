export default function (path) {
  return (PROXY ? PROXY + "/?url=" : "") + SERVER + path;
}
