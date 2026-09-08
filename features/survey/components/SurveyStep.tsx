"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { SurveyData } from "@/core/types/survey.types";

import { SURVEY_GRID_CLASS } from "../constants";
import { SurveyOptionCard } from "./SurveyOptionCard";

type SurveyStepProps = {
  surveyId: number;
  survey: SurveyData | undefined;
  selectedIds: Array<string | number>;
  isLoading: boolean;
  isError: boolean;
  isSubmitting: boolean;
  emptyLabel: string;
  errorLabel: string;
  retryLabel: string;
  submitLabel: string;
  loadingLabel: string;
  onToggle: (id: string | number) => void;
  onRetry: () => void;
  onSubmit: () => void;
};

export function SurveyStep({
  surveyId,
  survey,
  selectedIds,
  isLoading,
  isError,
  isSubmitting,
  emptyLabel,
  errorLabel,
  retryLabel,
  submitLabel,
  loadingLabel,
  onToggle,
  onRetry,
  onSubmit,
}: SurveyStepProps) {
  const options = survey?.options ?? [];
  const hasSelection = selectedIds.length > 0;
  const canSubmit = hasSelection && !isSubmitting && !isLoading && !isError;

  if (isLoading) {
    return (
      <div className={SURVEY_GRID_CLASS} aria-busy="true" aria-label={loadingLabel}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={`survey-skeleton-${surveyId}-${index}`}
            className="h-16 w-full rounded-xl bg-white/10"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center gap-4 rounded-xl bg-white/5 px-4 py-12 text-center"
      >
        <p className="text-sm text-white/70">{errorLabel}</p>
        <Button
          type="button"
          variant="ghost"
          nativeButton
          onClick={onRetry}
          className="cursor-pointer text-white/90 hover:bg-white/10 hover:text-white"
        >
          {retryLabel}
        </Button>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="rounded-xl bg-white/5 px-4 py-12 text-center">
        <p className="text-sm text-white/70">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className={SURVEY_GRID_CLASS}>
        {options.map((option) => {
          const optionId = `survey-${surveyId}-option-${option.id}`;
          const selected = selectedIds.some(
            (id) => String(id) === String(option.id),
          );

          return (
            <SurveyOptionCard
              key={optionId}
              id={optionId}
              name={option.name}
              selected={selected}
              disabled={isSubmitting}
              onToggle={() => onToggle(option.id)}
            />
          );
        })}
      </div>

      <Button
        type="button"
        nativeButton
        disabled={!canSubmit || options.length === 0}
        onClick={onSubmit}
        className="h-12 w-full cursor-pointer text-sm font-semibold md:h-11 md:text-base"
      >
        {isSubmitting ? loadingLabel : submitLabel}
      </Button>
    </div>
  );
}
