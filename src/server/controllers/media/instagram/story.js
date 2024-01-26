import axios from "axios";
import gbl from "./global.js";
import refreshFbDtsg from "./refreshFbDtsg.js";
import { userAgent } from "./../../../constants/app.constants.js";

export default async function getStoryItems(username) {
  username = username.slice(1);
  await refreshFbDtsg();

  if (gbl.fb_dtsg === null)
    return { code: 500, msg: "Session ID is not valid." };

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
        encodeURIComponent(JSON.stringify({ username })) +
        "&doc_id=6887760227926196",
    }
  );

  const userId = response?.data?.user?.id;

  if (!userId)
    return { code: 404, msg: "No user found against provided username." };

  const { data: response2 } = await axios.request(
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
        encodeURIComponent(JSON.stringify({ reel_ids_arr: [userId] })) +
        "&doc_id=25004196245860368",
    }
  );

  return response2?.data?.xdt_api__v1__feed__reels_media?.reels_media?.[0]?.items
}
