import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";
import type {
  SubmitSurveyRequest,
  SurveyData,
  SurveyOption,
} from "@/core/types/survey.types";

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function unwrapSurveyRecord(payload: unknown): Record<string, unknown> | null {
  const record = asRecord(payload);
  if (!record) return null;

  const nested = asRecord(record.data);
  if (nested && ("answers" in nested || "name" in nested)) {
    return nested;
  }

  if ("answers" in record || "name" in record) {
    return record;
  }

  return nested ?? record;
}

function mapAnswer(value: unknown): SurveyOption | null {
  const record = asRecord(value);
  if (!record || record.id == null) return null;

  const name = readString(record.name);
  if (!name) return null;

  return {
    id: record.id as string | number,
    name,
  };
}

function extractAnswers(payload: unknown): SurveyOption[] {
  const record = unwrapSurveyRecord(payload);
  if (!record || !Array.isArray(record.answers)) return [];

  return record.answers.flatMap((item) => {
    const answer = mapAnswer(item);
    return answer ? [answer] : [];
  });
}

function extractName(payload: unknown): string {
  const record = unwrapSurveyRecord(payload);
  return readString(record?.name) ?? "";
}

function extractAllowMultiple(payload: unknown): boolean {
  const record = unwrapSurveyRecord(payload);
  if (!record) return true;

  if (typeof record.is_multiple === "boolean") return record.is_multiple;
  if (typeof record.allow_multiple === "boolean") return record.allow_multiple;
  if (typeof record.multiple === "boolean") return record.multiple;
  if (record.type === "single") return false;
  if (record.type === "multiple") return true;

  return true;
}

function normalizeSurvey(payload: unknown): SurveyData {
  return {
    name: extractName(payload),
    options: extractAnswers(payload),
    allowMultiple: extractAllowMultiple(payload),
  };
}

export const surveyService = {
  async getById(id: number, signal?: AbortSignal): Promise<SurveyData> {
    const response = await clientRequest<unknown>({
      url: ENDPOINTS.survey.detail(id),
      method: "GET",
      signal,
    });

    return normalizeSurvey(response);
  },

  async submit(
    profileId: string | number,
    surveyId: number,
    data: SubmitSurveyRequest,
  ) {
    return clientRequest<unknown>({
      url: ENDPOINTS.profile.survey(profileId, surveyId),
      method: "PUT",
      data,
    });
  },
};
