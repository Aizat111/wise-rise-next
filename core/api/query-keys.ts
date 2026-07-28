export const QUERY_KEYS = {
  auth: {
    me: ["auth", "me"],
  },

  course: {
    all: ["courses"],

    detail: (slug: string) => ["course", slug],
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
};
