import axios from "axios";
import gbl from "./global.js";
import { userAgent } from "../../../constants/app.constants.js";
import refreshFbDtsg from "./refreshFbDtsg.js";

export default async function (username) {
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

  return response?.data?.user?.id;
}
