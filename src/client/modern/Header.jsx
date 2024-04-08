export default function () {
  return (
    <header className="navbar">
      <div className="container-fluid justify-content-center">
        <div style={{ padding: "5px 10px" }}>
          <span className="text-black" style={{ fontSize: "20px" }}>
            Media Downloader
          </span>
        </div>
        <div style={{ height: "100%" }}>
          <a className="promo" href={BASE + "classic/"}>
            Use Classic Version
          </a>
        </div>
      </div>
    </header>
  );
}
