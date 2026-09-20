"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { TEACHERS_CONTAINER_CLASS } from "@/features/teachers/constants";

type Props = {
  reset: () => void;
};

export default function EgitmenlerError({ reset }: Props) {
  const t = useTranslations("teachersPage");

  return (
    <div className="bg-background text-foreground">
      <div className={TEACHERS_CONTAINER_CLASS}>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
          {t("title")}
        </h1>
        <div
          role="alert"
          className="mt-8 flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center"
        >
          <p className="max-w-md text-sm text-white/65 sm:text-base">
            {t("error")}
          </p>
          <Button
            type="button"
            variant="ghost"
            onClick={reset}
            className="cursor-pointer text-white/90 hover:bg-white/10 hover:text-white"
          >
            {t("retry")}
          </Button>
        </div>
      </div>
    </div>
  );
}
