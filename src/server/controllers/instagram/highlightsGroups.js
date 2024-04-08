import fs from "fs";
import axios from "axios";
import { userAgent } from "../../constants/app.constants.js";
import getUserID from "./internal/getUserID.js";
import downloadItems from "../../utils/downloadItems.js";
import remote from "../../utils/remote.js";

export default async function (req, res) {
  const { groupForApi: username, dir } = req.body;
  const userID = await getUserID(username);

  if (!userID)
    return res
      .status(404)
      .json({ error: "No user found against provided username." });

  if (typeof userID !== "string")
    return res.status(userID.code).json({ error: userID.msg });

  const { data: response } = await axios.request(
    "https://www.instagram.com/graphql/query/",
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-site": "same-origin",
        cookie: "sessionid=" + process.env.IG_SESSIONID,
        "user-agent": userAgent,
      },
      params: {
        user_id: userID,
        query_id: "9957820854288654",
        include_highlight_reels: "true",
      },
    }
  );

  const groups = response?.data?.user?.edge_highlight_reels?.edges?.map?.(
    (element) => ({
      id: element.node.id,
      thumbnail: element.node.cover_media_cropped_thumbnail.url,
      title: element.node.title,
    })
  );

  const links = groups?.map?.((element) => element.thumbnail);

  if (!links || !links.length)
    return res
      .status(404)
      .json({ error: "No highlights found for provided id." });

  const downloadedLinks = await downloadItems(links, dir);

  if (!downloadedLinks)
    return res
      .status(404)
      .json({ error: "Error occured during downloading files." });

  groups.forEach(
    (element, index) => (element.thumbnail = downloadedLinks[index])
  );

  if (process.env.LOG === "Y") remote(req);

  const final = { type: "highlightsGroups", items: groups };
  fs.writeFileSync(dir + "items.json", JSON.stringify(final));
  res.status(201).json(final);
}
