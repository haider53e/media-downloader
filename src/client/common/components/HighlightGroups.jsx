import Image from "./Image";
import ScrollingTitle from "./ScrollingTitle";
import { makeBackendUrl } from "../utils";

export default function ({
  items,
  identifier,
  setIdentifier,
  activeBorderColor,
}) {
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
          item.thumbnail.url = makeBackendUrl(item.thumbnail.path);

          return (
            <div
              style={{
                margin: "10px",
                width: "83px",
                height: "117px",
                display: "flex",
                cursor: "pointer",
                flexDirection: "column",
              }}
              key={item.thumbnail.path}
              onClick={() => setIdentifier(item.id)}
            >
              <div
                style={{
                  width: "83px",
                  padding: "2px",
                  borderWidth: "2px",
                  borderRadius: "50%",
                  borderStyle: "solid",
                  borderColor:
                    identifier === item.id ? activeBorderColor : "transparent",
                  // transition: "border-color 400ms ease",
                }}
              >
                <Image
                  item={item.thumbnail}
                  extraImageStyles={{
                    width: "75px",
                    height: "75px",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <ScrollingTitle title={item.title} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
