export const QUERY_KEYS = {
  auth: {
    me: ["auth", "me"],
  },

  course: {
    all: ["courses"],
    mostWatched: ["courses", "most-watched"],
    comingSoon: ["courses", "coming-soon"],
    detail: (slug: string) => ["course", slug],
  },

  hero: {
    all: ["heroes"],
    list: (platform: string, mediaType = "image") => [
      "heroes",
      mediaType,
      platform,
    ],
  },

  teacher: {
    all: ["teachers"],
    theBest: ["teachers", "the-best"],
  },

  blog: {
    all: ["blogs"],
  },

  category: {
    all: ["categories"],
  },

  plan: {
    all: ["plans"],
  },

  profile: {
    all: ["profiles"],
  },

  avatar: {
    all: ["avatars"],
  },

  notification: {
    all: ["notifications"],
  },
};
