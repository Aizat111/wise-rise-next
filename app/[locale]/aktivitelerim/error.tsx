"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { ACTIVITIES_CONTAINER_CLASS } from "@/features/activities/constants";

type Props = {
  reset: () => void;
};

export default function AktivitelerimError({ reset }: Props) {
  const t = useTranslations("activitiesPage");

  return (
    <div className="bg-background text-foreground">
      <div className={ACTIVITIES_CONTAINER_CLASS}>
        <div
          role="alert"
          className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center"
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
