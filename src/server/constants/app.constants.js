export const allowedDomains = [
  "http://localhost:3001",
  "http://159.223.36.123:3001",
];

export const platformRegex = {
  instagram:
    /^(?:https?:\/\/(?:www\.)?instagram\.com\/(?:p|reels?|tv)\/([a-zA-Z0-9_-]{11})\/?(?:\?.*)?)|(@[a-z0-9._]{1,30})$/,
  threads:
    /^https?:\/\/(?:www\.)?threads\.net\/(?:t|@?[a-z0-9._]{1,30}\/post)\/([a-zA-Z0-9_-]{11})\/?(?:\?.*)?$/,
};

export const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36";
