export default function ({ quality, setQuality }) {
  return (
    <div className="d-grid gap-2 col-md-5 mx-auto mt-4">
      <span className="card-text text-accent text-center">
        Set media quality
      </span>
      <input
        type="range"
        min="1"
        max="3"
        value={quality}
        onChange={(e) => setQuality(e.target.value)}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <label onClick={() => setQuality(1)}>Low</label>
        <label onClick={() => setQuality(2)}>Medium</label>
        <label onClick={() => setQuality(3)}>High</label>
      </div>
    </div>
  );
}
