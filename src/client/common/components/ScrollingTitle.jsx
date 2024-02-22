import { useRef } from "react";
import { useSize } from "../hooks/resizeObserver";

export default function ({ title }) {
  const target = useRef(null);
  const size = useSize(target);
  const child = target.current?.children[0];

  const isMarquee = child?.clientWidth > Math.round(size?.width);

  return (
    <div
      ref={target}
      className="marquee"
      style={isMarquee ? {} : { textAlign: "center" }}
    >
      <a
        style={
          isMarquee ? { animationDuration: child?.clientWidth / 40 + "s" } : {}
        }
      >
        <div>{title}</div>
      </a>
    </div>
  );
}
