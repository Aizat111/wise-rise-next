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

  like: {
    all: ["likes"],
    classrooms: ["likes", "classrooms"],
    classroomsList: (profileId: string | number, pageSize: number) => [
      "likes",
      "classrooms",
      "list",
      String(profileId),
      pageSize,
    ],
    teachers: ["likes", "teachers"],
    teachersList: (profileId: string | number, pageSize: number) => [
      "likes",
      "teachers",
      "list",
      String(profileId),
      pageSize,
    ],
  },

  plan: {
    all: ["plans"],
    byPeriod: (period: string) => ["plans", period],
  },

  order: {
    all: ["orders"],
  },

  account: {
    subscriptionStatus: ["account", "subscription-status"],
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
    byProfile: (profileId: string | number, pageSize: number) => [
      "notes",
      "profile",
      String(profileId),
      pageSize,
    ],
  },

  activities: {
    all: ["activities"],
    watching: (profileId: string | number) => [
      "activities",
      "watching",
      String(profileId),
    ],
    watched: (profileId: string | number) => [
      "activities",
      "watched",
      String(profileId),
    ],
    assigned: (profileId: string | number) => [
      "activities",
      "assigned",
      String(profileId),
    ],
  },

  certificates: {
    all: ["certificates"],
    detail: (userId: string | number, certificateId: string | number) => [
      "certificates",
      "detail",
      String(userId),
      String(certificateId),
    ],
  },

  search: {
    all: ["search"],
    list: (q: string, pageSize: number) => ["search", "list", q, pageSize],
  },
};
