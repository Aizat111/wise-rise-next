"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/core/i18n/navigation";
import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";

export default function SurveyPage() {
  const t = useTranslations("survey");

  return (
    <AuthLayout>
      <div className="relative z-10 flex min-h-[calc(100vh-5rem)] items-start justify-center px-4 pt-[18vh]">
        <div className="w-full max-w-lg border-none bg-black px-5 py-10 text-center">
          <h1 className="mb-3 text-3xl font-semibold text-foreground sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mb-8 text-sm font-medium text-white/90 sm:text-base">
            {t("subtitle")}
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/" />}
            className="h-11 w-full font-semibold"
          >
            {t("cta")}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
