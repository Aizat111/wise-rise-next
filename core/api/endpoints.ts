import { SERVICES } from "./services";

export const ENDPOINTS = {
  auth: {
    login: `${SERVICES.AUTH}`,
    logout: `${SERVICES.AUTH}/logout`,
    register: `${SERVICES.AUTH}/register`,
    me: `/me`,
  },

  register: {
    /** POST /register/1/steps — creates registration draft, returns user id */
    step1: `${SERVICES.REGISTER}/1/steps`,
    /** POST /register/{currentStep}/steps/{id} */
    step: (currentStep: number, id: string) =>
      `${SERVICES.REGISTER}/${currentStep}/steps/${id}`,
  },

  course: {
    list: `${SERVICES.COURSE}`,
    detail: (slug: string) => `${SERVICES.COURSE}/${slug}`,
  },

  blog: {
    list: `${SERVICES.BLOG}`,
    detail: (slug: string) => `${SERVICES.BLOG}/${slug}`,
  },

  category: {
    list: `${SERVICES.CATEGORY}`,
  },

  plan: {
    list: `${SERVICES.PLAN}`,
  },

  payment: {
    checkout: `${SERVICES.PAYMENT}/checkout`,
  },

  profile: {
    list: `${SERVICES.PROFILE}`,
    detail: (id: string | number) => `${SERVICES.PROFILE}/${id}`,
    select: (id: string | number) => `${SERVICES.PROFILE}/${id}/select`,
  },

  avatar: {
    list: `${SERVICES.AVATAR}`,
  },

  notification: {
    list: `${SERVICES.NOTIFICATION}`,
  },
};
