import fs from "fs";
import asyncHandler from "../utils/asyncHandler.js";
import { fixedQuality, regex } from "../constants/app.constants.js";

export default asyncHandler(async function (req, res, next) {
  const prams = req.originalUrl.split("/");
  const platform = (req.params.platform = prams.at(-2));
  const mediatype = (req.params.mediatype = prams.at(-1));

  console.log({ platform, mediatype });

  if (!["instagram", "threads"].includes(platform))
    return res
      .status(400)
      .json({ error: "Provided platform is not supported." });

  const reqRegex = regex[platform][mediatype];

  if (!reqRegex)
    return res
      .status(400)
      .json({ error: "Provided mediatype is not supported." });

  try {
    req.body = JSON.parse(req.body);
  } catch (e) {
    return res
      .status(400)
      .json({ error: "Request body is not in a valid JSON format." });
  }

  let quality = req.body.quality;
  const identifier = req.body.identifier;

  if (fixedQuality.includes(platform + "/" + mediatype)) quality = 3;

  if (!quality?.toString().match(/^[1-3]$/))
    return res.status(400).json({ error: "Provide quality in range 1 to 3." });

  const matched = identifier?.match(reqRegex.regex);

  if (!matched)
    return res
      .status(400)
      .json({ error: "Provide a valid " + reqRegex.name + "." });

  const groupForDir = matched[reqRegex.groupForDir];
  req.body.groupForApi = matched[reqRegex.groupForApi];

  const dirName = mediatype + "@" + groupForDir + "@" + quality;
  const dir = (req.body.dir = "media/" + platform + "/" + dirName + "/");

  if (fs.existsSync(dir)) {
    if (fs.existsSync(dir + ".items") && fs.existsSync(dir + ".lastaccessed")) {
      fs.writeFileSync(dir + ".lastaccessed", Date.now().toString());
      return res.send(fs.readFileSync(dir + ".items"));
    }
    fs.rmSync(dir, { recursive: true });
  }

  next();
});
