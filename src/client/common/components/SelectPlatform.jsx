export default function ({ platform, setPlatform }) {
  return (
    <div
      className="mt-3"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <input
        type="radio"
        id="instagram"
        checked={platform === "instagram"}
        onChange={(e) => setPlatform(e.target.id)}
      />
      <label
        htmlFor="instagram"
        style={{
          paddingLeft: "6px",
          marginRight: "16px",
        }}
      >
        Instagram
      </label>
      <input
        type="radio"
        id="threads"
        checked={platform === "threads"}
        onChange={(e) => setPlatform(e.target.id)}
      />
      <label
        htmlFor="threads"
        style={{
          paddingLeft: "6px",
          marginRight: "16px",
        }}
      >
        Threads
      </label>
    </div>
  );
}
