import { cache } from "react";
import { unstable_cache } from "next/cache";

import { ENDPOINTS } from "@/core/api/endpoints";
import { serverRequest } from "@/core/api/server";
import type {
  Classroom,
  ClassroomsPaginatedResponse,
} from "@/core/types/classroom.types";

type ComingSoonResponse = Classroom[] | ClassroomsPaginatedResponse;

function normalizeComingSoonClassrooms(
  response: ComingSoonResponse,
): Classroom[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  return [];
}

async function fetchComingSoonClassrooms(): Promise<Classroom[]> {
  const response = await serverRequest<ComingSoonResponse>({
    url: ENDPOINTS.course.comingSoon,
    method: "GET",
  });

  return normalizeComingSoonClassrooms(response);
}

/**
 * Server-side coming soon classrooms. Throws on request failure so the
 * route `error.tsx` can render; an empty list is a valid success.
 * Cached for 1 hour — listings do not change frequently.
 */
export const getComingSoonClassrooms = cache(
  unstable_cache(fetchComingSoonClassrooms, ["coming-soon-classrooms"], {
    revalidate: 3600,
  }),
);
