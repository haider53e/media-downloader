import fs from "fs";
import axios from "axios";
import gbl from "./internal/global.js";
import { userAgent } from "../../constants/app.constants.js";
import refreshFbDtsg from "./internal/refreshFbDtsg.js";
import urlsFromItem from "../common/getUrlsfromItem.js";
import downloadItems from "../../utils/downloadItems.js";
import remote from "../../utils/remote.js";

export default async function (req, res) {
  const { groupForApi: shortcode, quality, dir } = req.body;
  await refreshFbDtsg();

  if (gbl.fb_dtsg === null)
    return res.status(500).json({ error: "Session ID is not valid." });

  const { data: response } = await axios.request(
    "https://www.instagram.com/api/graphql",
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-site": "same-origin",
        cookie: "sessionid=" + process.env.IG_SESSIONID,
        "user-agent": userAgent,
      },
      data:
        "fb_dtsg=" +
        encodeURIComponent(gbl.fb_dtsg) +
        "&variables=" +
        encodeURIComponent(JSON.stringify({ shortcode })) +
        "&doc_id=6984800508210440",
    }
  );

  const links = response?.data?.xdt_api__v1__media__shortcode__web_info?.items
    ?.map((item) => urlsFromItem(item, quality))
    ?.flat()
    ?.filter(Boolean);

  if (!links || !links.length)
    return res.status(404).json({ error: "No media found for provided url." });

  const downloadedLinks = await downloadItems(links, dir);

  if (!downloadedLinks)
    return res
      .status(404)
      .json({ error: "Error occured during downloading files." });

  if (process.env.LOG === "Y") remote(req);

  const final = { type: "post", items: downloadedLinks };
  fs.writeFileSync(dir + "items.json", JSON.stringify(final));

  if (process.env.LOG_RES === "Y")
    fs.writeFileSync(dir + "response.json", JSON.stringify(response));

  res.status(201).json(final);
}
