import fs from "fs";
import axios from "axios";
import gbl from "./internal/global.js";
import { userAgent } from "../../constants/app.constants.js";
import refreshFbDtsg from "./internal/refreshFbDtsg.js";
import urlsFromItem from "../common/getUrlsfromItem.js";
import downloadItems from "../../utils/downloadItems.js";

export default async function (req, res) {
  const { groupForApi: highlightID, quality, dir } = req.body;
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
        "x-ig-app-id": "936619743392459",
        "user-agent": userAgent,
      },
      data:
        "fb_dtsg=" +
        encodeURIComponent(gbl.fb_dtsg) +
        "&variables=" +
        encodeURIComponent(
          JSON.stringify({
            first: 1,
            initial_reel_id: "highlight:" + highlightID,
            reel_ids: ["highlight:" + highlightID],
          })
        ) +
        "&doc_id=8043921142289913",
    }
  );

  const links =
    response?.data?.xdt_api__v1__feed__reels_media__connection?.edges?.[0]?.node?.items
      ?.map((item) => urlsFromItem(item, quality))
      ?.flat()
      ?.filter(Boolean);

  if (!links || !links.length)
    return res
      .status(404)
      .json({ error: "No highlights found for provided id." });

  const downloadedLinks = await downloadItems(links, dir);

  if (!downloadedLinks)
    return res
      .status(404)
      .json({ error: "Error occured during downloading files." });

  const final = { type: "highlights", items: downloadedLinks };
  fs.writeFileSync(dir + "items.json", JSON.stringify(final));

  if (process.env.LOG_RES === "Y")
    fs.writeFileSync(dir + "response.json", JSON.stringify(response));

  res.status(201).json(final);
}
