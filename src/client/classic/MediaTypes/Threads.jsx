export default function ({ type, setType }) {
  return (
    <>
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
    </>
  );
}
