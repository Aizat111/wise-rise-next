"use client";

import { useTranslations } from "next-intl";

import Image from "@/shared/ui/Images/Image";
import { cn } from "@/lib/utils";

export const LIVE_HREF = "https://wisenrise.com/live/";
export const LIVE_LOGO_SRC = "/logo/live.png";

type LiveLogoLinkProps = {
  className?: string;
  onClick?: () => void;
};

export function LiveLogoLink({ className, onClick }: LiveLogoLinkProps) {
  const t = useTranslations();
  const label = t("footer.live");

  return (
    <a
      href={LIVE_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn("inline-flex shrink-0 items-center", className)}
      onClick={onClick}
    >
      <Image
        src={LIVE_LOGO_SRC}
        alt={label}
        width={230}
        height={80}
        className="h-8 w-[5.75rem] object-cover"
      />
    </a>
  );
}
