import axios from "axios";
import gbl from "./global.js";
import refreshFbDtsg from "./refreshFbDtsg.js";
import { userAgent } from "./../../../constants/app.constants.js";

export default async function getPostItems(shortcode) {
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
        encodeURIComponent(JSON.stringify({ shortcode })) +
        "&doc_id=6984800508210440",
    }
  );

  return response.data?.xdt_api__v1__media__shortcode__web_info?.items?.[0];
}
