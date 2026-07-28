"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";

type AddProfileCardProps = {
  href?: string;
  className?: string;
};

export function AddProfileCard({
  href = "/profil-ekle",
  className,
}: AddProfileCardProps) {
  const t = useTranslations("profile");

  return (
    <Link
      href={href}
      className={cn(
        "group flex w-full flex-col items-center gap-3 transition-transform duration-200",
        "hover:-translate-y-1",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-28 items-center justify-center rounded-full border-2 border-dashed border-white/25 bg-secondary/60 text-white/60 transition-all sm:size-32 md:size-36",
          "group-hover:border-primary/70 group-hover:text-primary",
        )}
      >
        <Plus className="size-12 sm:size-14" strokeWidth={1.5} />
      </span>
      <p className="text-center text-base font-medium text-foreground sm:text-lg">
        {t("addProfile")}
      </p>
    </Link>
  );
}
