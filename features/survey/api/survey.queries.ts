"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/core/api/query-keys";
import type { SurveyData } from "@/core/types/survey.types";
import { hasAccessToken } from "@/core/lib/token";

import { surveyService } from "./survey.service";

export function useSurveyQuery(surveyId: number, enabled = true) {
  return useQuery<SurveyData, Error>({
    queryKey: QUERY_KEYS.survey.detail(surveyId),
    queryFn: ({ signal }) => surveyService.getById(surveyId, signal),
    enabled: enabled && typeof window !== "undefined" && hasAccessToken(),
    staleTime: 5 * 60 * 1000,
  });
}
