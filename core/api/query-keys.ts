export const QUERY_KEYS = {
  auth: {
    me: ["auth", "me"],
  },

  course: {
    all: ["courses"],
    mostWatched: ["courses", "most-watched"],
    comingSoon: ["courses", "coming-soon"],
    detail: (slug: string) => ["course", slug],
    list: (filters: Record<string, string | number | undefined>) => [
      "courses",
      "list",
      filters,
    ],
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

  favorite: {
    all: ["favorites"],
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

  notes: {
    all: ["notes"],
    byVideo: (videoId: string) => ["notes", "video", videoId],
  },
};
