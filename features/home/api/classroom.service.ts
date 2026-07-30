import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  Classroom,
  ClassroomsPaginatedResponse,
} from "@/core/types/classroom.types";

type ClassroomsListResponse = Classroom[] | ClassroomsPaginatedResponse;

function normalizeClassrooms(response: ClassroomsListResponse): Classroom[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  return [];
}

export const classroomService = {
  async listMostWatched(): Promise<Classroom[]> {
    const response = await clientRequest<ClassroomsListResponse>({
      url: ENDPOINTS.course.mostWatched,
      method: "GET",
    });

    return normalizeClassrooms(response);
  },

  async listComingSoon(): Promise<Classroom[]> {
    const response = await clientRequest<ClassroomsListResponse>({
      url: ENDPOINTS.course.comingSoon,
      method: "GET",
    });

    return normalizeClassrooms(response);
  },
};
