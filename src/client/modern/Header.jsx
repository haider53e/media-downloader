export default function () {
  return (
    <div className="navbar">
      <div className="container-fluid justify-content-center">
        <div style={{ padding: "5px 10px" }}>
          <span className="text-black" style={{ fontSize: "20px" }}>
            Media Downloader
          </span>
        </div>
        <div style={{ height: "100%" }}>
          <a
            style={{
              color: "black",
              fontSize: "13px",
              fontWeight: "400",
              padding: "1px 6px",
              userSelect: "none",
              borderRadius: "5px",
              textDecoration: "none",
              backgroundColor: "white",
              border: "1.1px solid black",
            }}
            href={BASE + "classic"}
          >
            Use Classic Version
          </a>
        </div>
      </div>
    </div>
  );
}
