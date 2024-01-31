import HighlightGroupImage from "./HighlightGroupImage";
import ScrollingTitle from "./ScrollingTitle";

export default function ({ items, identifier, setIdentifier }) {
  return (
    <div className="d-grid gap-3 mx-auto mt-4">
      <span className="card-text text-accent text-center">
        Set highlights group
      </span>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {items.map((item) => {
          item.url =
            (PROXY ? PROXY + "/" + item.path + "?url=" : "") +
            SERVER +
            item.path;

          return (
            <div
              style={{
                margin: "10px",
                width: "83px",
                height: "117px",
                display: "flex",
                flexDirection: "column",
              }}
              key={item.thumbnail.path}
              onClick={() => setIdentifier(item.id)}
            >
              <HighlightGroupImage
                item={item.thumbnail}
                identifier={identifier}
                id={item.id}
              />
              <ScrollingTitle title={item.title} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
