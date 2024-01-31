export const regex = {
  instagram: {
    post: {
      regex:
        /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reels?|tv)\/[a-zA-Z0-9_-]{11}\/?(?:\?.*)?$/,
      name: "url",
    },
    stories: { regex: /^@?[a-z0-9._]{1,30}$/, name: "username" },
    highlights: { regex: /^.+$/, name: "highlights group id" },
    highlightsGroups: { regex: /^@?[a-z0-9._]{1,30}$/, name: "username" },
  },
  threads: {
    post: {
      regex:
        /^https?:\/\/(?:www\.)?threads\.net\/(?:@?[a-z0-9._]{1,30}\/)?post\/[a-zA-Z0-9_-]{11}\/?(?:\?.*)?$/,
      name: "url",
    },
  },
};
