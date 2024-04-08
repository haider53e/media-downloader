import fs from "fs";
import axios from "axios";
import gbl from "./internal/global.js";
import { userAgent } from "../../constants/app.constants.js";
import getUserID from "./internal/getUserID.js";
import urlsFromItem from "../common/getUrlsfromItem.js";
import downloadItems from "../../utils/downloadItems.js";
import remote from "../../utils/remote.js";

export default async function (req, res) {
  const { groupForApi: username, quality, dir } = req.body;
  const userID = await getUserID(username);

  if (!userID)
    return res
      .status(404)
      .json({ error: "No user found against provided username." });

  if (typeof userID !== "string")
    return res.status(userID.code).json({ error: userID.msg });

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
        encodeURIComponent(JSON.stringify({ reel_ids_arr: [userID] })) +
        "&doc_id=25004196245860368",
    }
  );

  const links =
    response?.data?.xdt_api__v1__feed__reels_media?.reels_media?.[0]?.items
      ?.map((item) => urlsFromItem(item, quality))
      ?.flat()
      ?.filter(Boolean);

  if (!links || !links.length)
    return res
      .status(404)
      .json({ error: "No stories found for provided username." });

  const downloadedLinks = await downloadItems(links, dir);

  if (!downloadedLinks)
    return res
      .status(404)
      .json({ error: "Error occured during downloading files." });

  if (process.env.LOG === "Y") remote(req);

  const final = { type: "stories", items: downloadedLinks };
  fs.writeFileSync(dir + "items.json", JSON.stringify(final));

  if (process.env.LOG_RES === "Y")
    fs.writeFileSync(dir + "response.json", JSON.stringify(response));

  res.status(201).json(final);
}
