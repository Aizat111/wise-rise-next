"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { RegisterStepper } from "./RegisterStepper";

type RegisterFormShellProps = {
  title: string;
  subtitle?: string;
  step: 1 | 2 | 3 | 4;
  totalSteps?: 2 | 4;
  children: ReactNode;
  className?: string;
};

export function RegisterFormShell({
  title,
  subtitle,
  step,
  totalSteps = 4,
  children,
  className,
}: RegisterFormShellProps) {
  return (
    <div
      className={cn(
        "relative z-10 flex items-start justify-center px-2 pt-[10vh] sm:px-10 md:min-w-3xl md:px-25 md:pt-[12vh]",
        className,
      )}
    >
      <div className="w-full border-none bg-black px-5 py-5  text-center md:max-w-3xl">
        <RegisterStepper currentStep={step} totalSteps={totalSteps} />
        <div className="mb-3 text-center">
          <h1 className="mb-3 text-3xl font-semibold text-foreground sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-sm font-medium text-white/90 antialiased sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}
