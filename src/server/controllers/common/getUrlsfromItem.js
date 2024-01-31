function finalURL(e, quality) {
  const target =
    !e.video_versions || e.video_versions.length === 0
      ? e.image_versions2?.candidates?.slice(0, -7)
      : e.video_versions;

  return target?.reverse()[Math.floor((quality / 3) * target.length) - 1].url;
}

export default function urlsFromItem(item, quality) {
  if (!item) return undefined;

  if (!item.carousel_media_count) return [finalURL(item, quality)];

  return item.carousel_media.map((e) => finalURL(e, quality));
}
