import fs from "fs";
import axios from "axios";
import urlsFromItem from "../common/getUrlsfromItem.js";
import downloadItems from "../../utils/downloadItems.js";
import remote from "../../utils/remote.js";

export default async function (req, res) {
  const { groupForApi: url, quality, dir } = req.body;

  const html = await axios.get(url);
  const post_id = html.data.match(/"post_id":"(.*?)"},"entryPoint"/);
  console.log("post_id:", post_id ? post_id[1] : "Not Found");

  if (!post_id)
    return res
      .status(404)
      .json({ error: "No post is available for the provided url." });

  const { data: response } = await axios.request({
    method: "POST",
    url: "https://www.threads.net/api/graphql",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "x-fb-lsd": "1",
      "x-ig-app-id": "238260118697367",
    },
    data:
      "lsd=1&variables=" +
      encodeURIComponent(JSON.stringify({ postID: post_id[1] })) +
      "&doc_id=5587632691339264",
  });

  const links = urlsFromItem(
    response?.data?.data?.containing_thread?.thread_items?.at?.(-1)?.post,
    quality
  )?.filter(Boolean);

  if (!links || !links.length)
    return res.status(404).json({ error: "No media found for provided url." });

  const downloadedLinks = await downloadItems(links, dir);

  if (!downloadedLinks)
    return res
      .status(404)
      .json({ error: "Error occured during downloading files." });

  if (process.env.LOG.charAt(0) === "Y") remote(req);

  const final = { type: "post", items: downloadedLinks };
  fs.writeFileSync(dir + ".items", JSON.stringify(final));
  res.status(201).json(final);
}
