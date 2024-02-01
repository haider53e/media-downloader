export const allowedDomains = [
  "http://localhost:3001",
  "http://159.223.36.123:3001",
];

export const regex = {
  instagram: {
    post: {
      regex:
        /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reels?|tv)\/([a-zA-Z0-9_-]{11})\/?(?:\?.*)?$/,
      name: "url",
      groupForDir: 1,
      groupForApi: 1,
    },
    stories: {
      regex: /^@?([a-z0-9._]{1,30})$/,
      name: "username",
      groupForDir: 1,
      groupForApi: 1,
    },
    highlights: {
      regex: /^\d{15,20}$/,
      name: "highlights group id",
      groupForDir: 0,
      groupForApi: 0,
    },
    highlightsGroups: {
      regex: /^@?([a-z0-9._]{1,30})$/,
      name: "username",
      groupForDir: 1,
      groupForApi: 1,
    },
    audio: {
      regex:
        /^https?:\/\/(?:www\.)?instagram\.com\/reels\/audio\/(\d{15,20})\/?(?:\?.*)?$/,
      name: "url",
      groupForDir: 1,
      groupForApi: 1,
    },
  },
  threads: {
    post: {
      regex:
        /^https?:\/\/(?:www\.)?threads\.net\/(?:@?[a-z0-9._]{1,30}\/)?post\/([a-zA-Z0-9_-]{11})\/?(?:\?.*)?$/,
      name: "url",
      groupForDir: 1,
      groupForApi: 0,
    },
  },
};

export const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36";

export const fixedQuality = ["instagram/highlightsGroups", "instagram/audio"];
