export default function ({ type, setType, platform }) {
  const instagramOnly = (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="radio"
          id="stories"
          checked={type === "stories"}
          onChange={(e) => setType(e.target.id)}
        />
        <label htmlFor="stories" style={{ paddingLeft: "6px" }}>
          Stories
        </label>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="radio"
          id="highlightsGroups"
          checked={type === "highlightsGroups"}
          onChange={(e) => setType(e.target.id)}
        />
        <label htmlFor="highlightsGroups" style={{ paddingLeft: "6px" }}>
          Highlights
        </label>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="radio"
          id="audio"
          checked={type === "audio"}
          onChange={(e) => setType(e.target.id)}
        />
        <label htmlFor="audio" style={{ paddingLeft: "6px" }}>
          Audio
        </label>
      </div>
    </>
  );

  return (
    <div className="d-grid gap-2 col-md-5 mx-auto mt-4">
      <span className="card-text text-accent text-center">Set media type</span>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent:
            platform === "instagram" ? "space-between" : "space-evenly",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="radio"
            id="post"
            checked={type === "post"}
            onChange={(e) => setType(e.target.id)}
          />
          <label htmlFor="post" style={{ paddingLeft: "6px" }}>
            Post
          </label>
        </div>
        {platform === "instagram" && instagramOnly}
      </div>
    </div>
  );
}
