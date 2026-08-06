import { isAxiosError } from "axios";

import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import { serverRequest } from "@/core/api/server";
import type {
  Classroom,
  ClassroomDetailResponse,
} from "@/core/types/classroom.types";

import { unwrapClassroomDetail } from "./course.utils";

type ClassroomDetailApiResponse = Classroom | ClassroomDetailResponse;

export class CourseNotFoundError extends Error {
  constructor(slug: string) {
    super(`Course not found: ${slug}`);
    this.name = "CourseNotFoundError";
  }
}

function isNotFoundError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404;
}

async function fetchClassroomDetail(
  slug: string,
  request: typeof clientRequest | typeof serverRequest,
): Promise<Classroom> {
  try {
    const response = await request<ClassroomDetailApiResponse>({
      url: ENDPOINTS.course.detail(slug),
      method: "GET",
    });

    const classroom = unwrapClassroomDetail(response);
    if (!classroom) {
      throw new CourseNotFoundError(slug);
    }

    return classroom;
  } catch (error) {
    if (error instanceof CourseNotFoundError) throw error;
    if (isNotFoundError(error)) throw new CourseNotFoundError(slug);
    throw error;
  }
}

export const courseService = {
  async getBySlug(slug: string): Promise<Classroom> {
    return fetchClassroomDetail(slug, clientRequest);
  },

  async getBySlugServer(slug: string): Promise<Classroom | null> {
    try {
      return await fetchClassroomDetail(slug, serverRequest);
    } catch (error) {
      if (error instanceof CourseNotFoundError) return null;
      return null;
    }
  },
};
