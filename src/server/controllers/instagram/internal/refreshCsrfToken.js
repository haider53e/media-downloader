import axios from "axios";
import gbl from "./global.js";
import { userAgent } from "../../../constants/app.constants.js";

export default async function () {
  if (gbl.csrf_token_last_refresh !== new Date().toDateString()) {
    const { data: html } = await axios.get("https://www.instagram.com/", {
      validateStatus: () => true,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-site": "same-origin",
        cookie: "sessionid=" + process.env.IG_SESSIONID,
        "user-agent": userAgent,
      },
    });

    gbl.csrf_token_last_refresh = new Date().toDateString();
    const csrf_token = html.match(/{"csrf_token":"(.+?)"}/);
    console.log(csrf_token ? { csrf_token: csrf_token[1] } : "Not Found");

    gbl.csrf_token = csrf_token ? csrf_token[1] : null;
  }
}
