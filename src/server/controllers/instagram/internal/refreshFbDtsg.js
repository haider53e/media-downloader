import axios from "axios";
import gbl from "./global.js";
import { userAgent } from "../../../constants/app.constants.js";

export default async function () {
  if (gbl.fb_dtsg_last_refresh !== new Date().toDateString()) {
    const { data: html } = await axios.get("https://www.instagram.com/", {
      validateStatus: () => true,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-site": "same-origin",
        cookie: "sessionid=" + process.env.IG_SESSIONID,
        "user-agent": userAgent,
      },
    });

    gbl.fb_dtsg_last_refresh = new Date().toDateString();
    const fb_dtsg = html.match(/"f":"(.*)","l":null}/);
    console.log(fb_dtsg ? { fb_dtsg: fb_dtsg[1] } : "Not Found");

    gbl.fb_dtsg = fb_dtsg ? fb_dtsg[1] : null;
  }
}
