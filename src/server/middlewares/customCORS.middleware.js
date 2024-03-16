import cors from "cors";
import { allowedOrigins } from "../constants/app.constants.js";

function safeURL(url) {
  try {
    return new URL(url);
  } catch (error) {}
}

export default function (req, res, next) {
  cors({
    origin: function (origin, callback) {
      origin = safeURL(origin ?? req.headers.referer)?.origin;

      const isOriginAllowed = allowedOrigins.includes(origin);

      res.setHeader(
        "Cross-Origin-Resource-Policy",
        isOriginAllowed ? "cross-origin" : "same-origin"
      );

      if (!isOriginAllowed) res.setHeader("X-Frame-Options", "DENY");

      callback(null, isOriginAllowed ? origin : false);
    },
  })(req, res, next);
}
