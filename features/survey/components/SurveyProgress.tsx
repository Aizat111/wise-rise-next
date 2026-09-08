"use client";

import { cn } from "@/lib/utils";

type SurveyProgressProps = {
  current: number;
  total: number;
  label: string;
};

export function SurveyProgress({ current, total, label }: SurveyProgressProps) {
  const progress = total > 0 ? Math.min(100, (current / total) * 100) : 0;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3">
      <p className="text-sm font-medium text-muted-foreground sm:text-base">
        {label}
      </p>
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={label}
      >
        <div
          className={cn("h-full rounded-full bg-primary transition-all duration-300")}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
