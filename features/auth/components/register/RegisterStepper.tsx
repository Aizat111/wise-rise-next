"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

type RegisterStepperProps = {
  currentStep: 1 | 2 | 3 | 4;
  totalSteps?: 2 | 4;
  className?: string;
};

export function RegisterStepper({
  currentStep,
  totalSteps = 4,
  className,
}: RegisterStepperProps) {
  const t = useTranslations("common");
  return (
    <div
      className={cn("mb-2 flex items-center justify-center gap-2", className)}
      aria-label={`${t("step")} ${currentStep}/${totalSteps}`}
    >
      <div className="text-sm font-semibold text-primary md:text-base">
        {t("step")} {currentStep}/{totalSteps}
      </div>
    </div>
  );
}
