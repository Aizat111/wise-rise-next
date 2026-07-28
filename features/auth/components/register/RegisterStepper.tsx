"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
type RegisterStepperProps = {
  currentStep: 1 | 2 | 3 | 4;
  className?: string;
};

const STEPS = [1, 2, 3, 4] as const;

export function RegisterStepper({ currentStep, className }: RegisterStepperProps) {
  const t = useTranslations("common");
  return (
    <div
      className={cn("mb-2 flex items-center justify-center gap-2", className)}
      aria-label={`Adım ${currentStep}/4`}
    >




      <div>

        <div className="text-sm md:text-base text-primary font-semibold">{t("step")} {currentStep}/4</div>
      </div>


    </div>
  );
}
