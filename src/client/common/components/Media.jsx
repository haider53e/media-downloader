import Audio from "./Audio";
import Video from "./Video";
import Image from "./Image";
import makeBackendUrl from "../utils/makeBackendUrl";

export default function ({
  items,
  downloadBtnClass,
  extraImageStyles = {},
  extraVideoStyles = {},
}) {
  return (
    <div
      className="mt-4"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {items.map((item) => {
        let Media = Image;
        if (item.format === "mp4") Media = Video;
        else if (["m4a", "mp3"].includes(item.format)) Media = Audio;

        item.url = makeBackendUrl(item.path);

        return (
          <div
            style={{
              margin: "10px",
              width: "300px",
              display: "flex",
              flexDirection: "column",
            }}
            key={item.path}
          >
            <Media
              item={item}
              extraImageStyles={{
                width: "300px",
                height: "300px",
                borderRadius: "6px",
                ...extraImageStyles,
              }}
              extraVideoStyles={extraVideoStyles}
            />
            <a
              download
              href={item.url + "?download=1"}
              className={"btn " + downloadBtnClass}
              style={{ width: "100%", marginTop: "12px" }}
            >
              Download
            </a>
          </div>
        );
      })}
    </div>
  );
}
