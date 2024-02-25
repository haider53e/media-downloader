export default function () {
  return (
    <header
      className="navbar"
      style={{
        background: "var(--theme-t80)",
        borderBottom: "1px solid var(--theme-t50)",
      }}
    >
      <div className="container-fluid justify-content-center">
        <div style={{ padding: "5px 10px" }}>
          <span className="text-accent" style={{ fontSize: "20px" }}>
            Media Downloader
          </span>
        </div>
        <div style={{ height: "100%" }}>
          <a className="promo" href={BASE}>
            Use Modern Version
          </a>
        </div>
      </div>
    </header>
  );
}
