import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  Teacher,
  TeachersPaginatedResponse,
} from "@/core/types/teacher.types";

type TeachersListResponse = Teacher[] | TeachersPaginatedResponse;

function normalizeTeachers(response: TeachersListResponse): Teacher[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  return [];
}

export type ListBestTeachersParams = {
  page?: number;
  pageSize?: number;
};

export const teacherService = {
  async listTheBest({
    page = 0,
    pageSize = 12,
  }: ListBestTeachersParams = {}): Promise<Teacher[]> {
    const response = await clientRequest<TeachersListResponse>({
      url: ENDPOINTS.teacher.theBest,
      method: "GET",
      params: {
        "page[number]": page,
        "page[size]": pageSize,
      },
    });

    return normalizeTeachers(response);
  },
};
