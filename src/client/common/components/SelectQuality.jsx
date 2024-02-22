export default function ({ quality, setQuality, reference }) {
  return (
    <div className="d-grid gap-2 col-md-5 mx-auto mt-4">
      <span className="card-text text-accent text-center">
        Set media quality
      </span>
      <input
        ref={reference}
        type="range"
        min="0"
        max="2"
        value={quality}
        onChange={(e) => setQuality(e.target.value)}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <label onClick={() => setQuality(0)}>Low</label>
        <label onClick={() => setQuality(1)}>Medium</label>
        <label onClick={() => setQuality(2)}>High</label>
      </div>
    </div>
  );
}
