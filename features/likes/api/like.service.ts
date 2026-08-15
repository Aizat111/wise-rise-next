import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";

export const likeService = {
  async likeClassroom(
    profileId: string | number,
    classroomId: string | number,
  ): Promise<void> {
    await clientRequest({
      url: ENDPOINTS.profile.likeClassroom(profileId, classroomId),
      method: "POST",
    });
  },

  async unlikeClassroom(
    profileId: string | number,
    classroomId: string | number,
  ): Promise<void> {
    await clientRequest({
      url: ENDPOINTS.profile.likeClassroom(profileId, classroomId),
      method: "DELETE",
    });
  },

  async likeTeacher(
    profileId: string | number,
    teacherId: string | number,
  ): Promise<void> {
    await clientRequest({
      url: ENDPOINTS.profile.likeTeacher(profileId, teacherId),
      method: "POST",
    });
  },

  async unlikeTeacher(
    profileId: string | number,
    teacherId: string | number,
  ): Promise<void> {
    await clientRequest({
      url: ENDPOINTS.profile.likeTeacher(profileId, teacherId),
      method: "DELETE",
    });
  },
};
