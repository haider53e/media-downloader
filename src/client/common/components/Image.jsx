import { useRef } from "react";

export default function ({ item, extraImageStyles }) {
  const blur = useRef();

  const size = { width: "100%", height: "100%" };
  if (item.height < item.width) delete size.height;
  else if (item.width < item.height) delete size.width;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        overflow: "hidden",
        placeContent: "center",
        ...extraImageStyles,
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
        style={{ ...size, display: "none" }}
        src={item.url}
      ></img>
    </div>
  );
}
