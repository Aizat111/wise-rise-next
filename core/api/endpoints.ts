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
    mostWatched: `${SERVICES.COURSE}/sorted/most_watched`,
    comingSoon: `${SERVICES.COURSE}/sorted/coming_soon`,
  },

  favorite: {
    list: `${SERVICES.FAVORITE}`,
    create: `${SERVICES.FAVORITE}`,
    remove: (id: string | number) => `${SERVICES.FAVORITE}/${id}`,
  },

  hero: {
    list: `${SERVICES.HERO}`,
  },

  teacher: {
    theBest: `${SERVICES.TEACHER}/sorted/the_best`,
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

  order: {
    list: `${SERVICES.ORDER}`,
  },

  account: {
    /** PUT /disable_account — cancels the authenticated user's membership */
    disable: `/disable_account`,
    subscriptionStatus: `/subscription-status`,
  },

  payment: {
    checkout: `${SERVICES.PAYMENT}/checkout`,
  },

  profile: {
    list: `${SERVICES.PROFILE}`,
    detail: (id: string | number) => `${SERVICES.PROFILE}/${id}`,
    select: (id: string | number) => `${SERVICES.PROFILE}/${id}/select`,
    likeClassroom: (profileId: string | number, classroomId: string | number) =>
      `${SERVICES.PROFILE}/${profileId}/likes/classrooms/${classroomId}`,
    likeTeacher: (profileId: string | number, teacherId: string | number) =>
      `${SERVICES.PROFILE}/${profileId}/likes/teachers/${teacherId}`,
    likedClassrooms: (profileId: string | number) =>
      `${SERVICES.PROFILE}/${profileId}/likes/classrooms`,
    likedTeachers: (profileId: string | number) =>
      `${SERVICES.PROFILE}/${profileId}/likes/teachers`,
    notes: (profileId: string | number) =>
      `${SERVICES.PROFILE}/${profileId}/notes`,
  },

  activities: {
    watching: (profileId: string | number) =>
      `${SERVICES.ACTIVITIES}/watching/${profileId}`,
    watched: (profileId: string | number) =>
      `${SERVICES.ACTIVITIES}/watched/${profileId}`,
  },

  assignedClassroom: {
    list: (profileId: string | number) =>
      `${SERVICES.ASSIGNED_CLASSROOM}/${profileId}`,
  },

  certificates: {
    list: (userId: string | number) =>
      `${SERVICES.USER}/certificates/${userId}`,
    detail: (userId: string | number, certificateId: string | number) =>
      `${SERVICES.USER}/certificates/${userId}/${certificateId}`,
  },

  avatar: {
    list: `${SERVICES.AVATAR}`,
  },

  notification: {
    list: `${SERVICES.NOTIFICATION}`,
  },

  notes: {
    list: `${SERVICES.NOTES}`,
    create: `${SERVICES.NOTES}`,
  },

  search: `${SERVICES.SEARCH}`,
};
