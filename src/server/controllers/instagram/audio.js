import fs from "fs";
import axios from "axios";
import gbl from "./internal/global.js";
import { userAgent } from "../../constants/app.constants.js";
import refreshCsrfToken from "./internal/refreshCsrfToken.js";
import downloadItems from "../../utils/downloadItems.js";
import remote from "../../utils/remote.js";

export default async function (req, res) {
  const { groupForApi: assetID, dir } = req.body;
  await refreshCsrfToken();

  if (gbl.csrf_token === null)
    return res.status(500).json({ error: "Session ID is not valid." });

  const { data: response } = await axios.request(
    "https://www.instagram.com/api/v1/clips/music/",
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-csrftoken": "FTnW4646jKd1dPAwmUnLbEaHRh5K4eyd",
        "x-ig-app-id": "936619743392459",
        "user-agent": userAgent,
      },
      data: "original_sound_audio_asset_id=" + assetID,
      referrer: "https://www.instagram.com/reels/audio/" + assetID + "/",
    }
  );

  const info =
    response?.metadata?.music_info?.music_asset_info ||
    response?.metadata?.original_sound_info;

  const links = [
    {
      filename: info?.title
        ? info?.title + " by " + info?.display_artist?.replaceAll(",", " &")
        : info?.original_audio_title + " by @" + info?.ig_artist?.username,
      url:
        info?.progressive_download_url ||
        info?.fast_start_progressive_download_url,
    },
  ]?.filter((e) => Boolean(e.url));

  if (!links || !links.length)
    return res.status(404).json({ error: "No audio found for provided url." });

  const downloadedLinks = await downloadItems(links, dir, "mp3");

  if (!downloadedLinks)
    return res
      .status(404)
      .json({ error: "Error occured during downloading files." });

  if (process.env.LOG === "Y") remote(req);

  const final = { type: "audio", items: downloadedLinks };
  fs.writeFileSync(dir + "items.json", JSON.stringify(final));

  if (process.env.LOG_RES === "Y")
    fs.writeFileSync(dir + "response.json", JSON.stringify(response));

  res.status(201).json(final);
}
