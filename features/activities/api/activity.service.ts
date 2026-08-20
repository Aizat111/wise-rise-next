import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type { Classroom } from "@/core/types/classroom.types";

type ActivityListParams = {
  profileId: string | number;
  signal?: AbortSignal;
};

type NestedList<T> = {
  data?: T[] | { data?: T[]; classrooms?: T[] };
  classrooms?: T[];
  items?: T[];
};

type ActivityListResponse = Classroom[] | NestedList<unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const numeric = Number(value);
    if (!Number.isNaN(numeric)) return numeric;
  }
  return null;
}

function pickCompletionRate(
  record: Record<string, unknown>,
): number | null {
  return (
    toFiniteNumber(record.completion_rate) ??
    toFiniteNumber(record.completionRate) ??
    toFiniteNumber(record.progress) ??
    toFiniteNumber(record.percent)
  );
}

function extractListItems(response: ActivityListResponse): unknown[] {
  if (Array.isArray(response)) return response;
  if (!isRecord(response)) return [];

  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.classrooms)) return response.classrooms;
  if (Array.isArray(response.items)) return response.items;

  if (isRecord(response.data)) {
    if (Array.isArray(response.data.data)) return response.data.data;
    if (Array.isArray(response.data.classrooms)) return response.data.classrooms;
  }

  return [];
}

export function unwrapActivityClassroom(item: unknown): Classroom | null {
  if (!isRecord(item)) return null;

  const nested = isRecord(item.classroom)
    ? item.classroom
    : isRecord(item.course)
      ? item.course
      : item;

  if (nested.id == null) return null;

  const completion =
    pickCompletionRate(item) ?? pickCompletionRate(nested);

  const extras: Record<string, unknown> = {};
  if (item !== nested) {
    for (const key of [
      "certificate",
      "certificates",
      "certificate_id",
      "certificateId",
      "user_id",
      "userId",
      "profile_id",
      "profileId",
    ]) {
      if (item[key] != null) extras[key] = item[key];
    }
  }

  return {
    ...(nested as unknown as Classroom),
    ...extras,
    completion_rate:
      completion ?? (nested as unknown as Classroom).completion_rate ?? null,
  } as Classroom;
}

function normalizeActivityClassrooms(
  response: ActivityListResponse,
): Classroom[] {
  return extractListItems(response)
    .map(unwrapActivityClassroom)
    .filter((classroom): classroom is Classroom => classroom != null);
}

export const activityService = {
  async listWatching({
    profileId,
    signal,
  }: ActivityListParams): Promise<Classroom[]> {
    const response = await clientRequest<ActivityListResponse>({
      url: ENDPOINTS.activities.watching(profileId),
      method: "GET",
      signal,
    });

    return normalizeActivityClassrooms(response);
  },

  async listWatched({
    profileId,
    signal,
  }: ActivityListParams): Promise<Classroom[]> {
    const response = await clientRequest<ActivityListResponse>({
      url: ENDPOINTS.activities.watched(profileId),
      method: "GET",
      signal,
    });

    return normalizeActivityClassrooms(response);
  },

  async listAssigned({
    profileId,
    signal,
  }: ActivityListParams): Promise<Classroom[]> {
    const response = await clientRequest<ActivityListResponse>({
      url: ENDPOINTS.assignedClassroom.list(profileId),
      method: "GET",
      signal,
    });

    return normalizeActivityClassrooms(response);
  },
};
