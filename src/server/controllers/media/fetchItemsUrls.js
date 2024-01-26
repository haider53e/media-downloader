import axios from "axios";
import getPostItems from "./instagram/post.js";
import getStoryItems from "./instagram/story.js";

function finalURL(e, quality) {
  const target =
    !e.video_versions || e.video_versions.length === 0
      ? e.image_versions2.candidates.slice(0, -7)
      : e.video_versions;
  // console.log(target)

  return target.reverse()[Math.round(quality * target.length) - 1].url;
}

function urlsFromItem(item, quality) {
  if (item.carousel_media_count)
    return item.carousel_media.map((e) => finalURL(e, quality));
  else return [finalURL(item, quality)];
}

const instagram = async (url, quality, shortcodeOrUsername, mediatype) => {
  try {
    if (!mediatype) return { code: 400, msg: "Media type is not found." };

    let item = null;
    if (mediatype === "post") {
      item = await getPostItems(shortcodeOrUsername);
    }
    //
    else if (mediatype === "stories") {
      item = await getStoryItems(shortcodeOrUsername);
    }

    if (!item)
      return { code: 404, msg: "No post is available for the provided URL." };
    //
    if (item.code) return item;

    if (Array.isArray(item))
      return item.map((e) => urlsFromItem(e, quality)).flat();

    return urlsFromItem(item, quality);
  } catch (error) {
    console.log(error);
    return { code: 500, msg: "Internal Server Error." };
  }
};

const threads = async (url, quality) => {
  try {
    const html = await axios.get(url);
    const post_id = html.data.match(/"post_id":"(.*?)"},"entryPoint"/);
    console.log("post_id:", post_id ? post_id[1] : "Not Found");
    if (!post_id)
      return { code: 404, msg: "No post is available for the provided URL." };

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

    // fs.writeFileSync("./response.json", JSON.stringify(response));

    const item = response.data.data.containing_thread.thread_items.at(-1).post;
    // console.log(item)

    return urlsFromItem(item, quality);
  } catch (error) {
    console.log(error);
    return { code: 500, msg: "Internal Server Error." };
  }
};

export default { instagram, threads };
