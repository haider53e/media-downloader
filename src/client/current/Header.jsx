export default function () {
  return (
    <div
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
          <a
            style={{
              fontSize: "13px",
              fontWeight: "400",
              padding: "1px 6px",
              userSelect: "none",
              borderRadius: "5px",
              color: "var(--theme)",
              textDecoration: "none",
              backgroundColor: "white",
              border: "1.1px solid var(--theme)",
            }}
            href={BASE + "experimental/"}
          >
            Try New Modern Look
          </a>
        </div>
      </div>
    </div>
  );
}
