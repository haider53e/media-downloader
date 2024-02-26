export default function ({ quality, setQuality, reference }) {
  const addActiveClass = (e) => e.target.classList.add("active");
  const removeActiveClass = (e) => e.target.classList.remove("active");

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
        onTouchStart={addActiveClass}
        onTouchEnd={removeActiveClass}
        onMouseDown={addActiveClass}
        onMouseUp={removeActiveClass}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span className="input-option" onClick={() => setQuality(0)}>
          Low
        </span>
        <span className="input-option" onClick={() => setQuality(1)}>
          Medium
        </span>
        <span className="input-option" onClick={() => setQuality(2)}>
          High
        </span>
      </div>
    </div>
  );
}
