"use client";

import { useMutation } from "@tanstack/react-query";

import type { SubmitSurveyRequest } from "@/core/types/survey.types";

import { surveyService } from "./survey.service";

type SubmitSurveyVariables = {
  profileId: string | number;
  surveyId: number;
  answers: SubmitSurveyRequest["answers"];
};

export function useSubmitSurveyMutation() {
  return useMutation<unknown, Error, SubmitSurveyVariables>({
    mutationFn: ({ profileId, surveyId, answers }) =>
      surveyService.submit(profileId, surveyId, { answers }),
  });
}
