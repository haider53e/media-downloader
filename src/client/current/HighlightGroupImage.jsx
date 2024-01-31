import { useRef } from "react";

export default function ({ item, identifier, id }) {
  const blur = useRef();

  const size = { width: "100%", height: "100%" };
  if (item.height < item.width) delete size.height;
  else if (item.width < item.height) delete size.width;

  return (
    <div
      style={{
        padding: "2px",
        border: "2px solid var(--theme)",
        borderRadius: "50%",
        width: "83px",
        borderColor: identifier === id ? "var(--theme)" : "transparent",
      }}
    >
      <div
        style={{
          width: "75px",
          height: "75px",
          backgroundColor: "black",
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          flexWrap: "wrap",
          placeContent: "center",
        }}
      >
        <img
          ref={blur}
          style={size}
          src={"data:image/" + item.format + ";base64," + item.blur}
        ></img>
        <img
          onLoad={(e) => {
            blur.current.style.display = "none";
            e.target.style.removeProperty("display");
          }}
          style={Object.assign({ display: "none" }, size)}
          src={item.path}
        ></img>
      </div>
    </div>
  );
}
