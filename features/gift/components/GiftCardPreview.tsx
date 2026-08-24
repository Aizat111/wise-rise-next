"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";

import { GIFT_CARD_IMAGE } from "../constants";

type GiftCardPreviewProps = {
  note: string;
  senderName: string;
  senderSurname: string;
  className?: string;
};

export function GiftCardPreview({
  note,
  senderName,
  senderSurname,
  className,
}: GiftCardPreviewProps) {
  const t = useTranslations("giveGift");
  const sender = `${senderName} ${senderSurname}`.trim();

  return (
    <div
      className={cn(
        "relative aspect-4/3 w-full min-w-0 overflow-hidden rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      <Image
        src={GIFT_CARD_IMAGE}
        alt={t("giftCardAlt")}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent"
      />
      <div className="absolute inset-x-0 top-0 flex h-[72%] flex-col items-center justify-center px-6 text-center sm:px-10">
        <p
          className={cn(
            "max-w-md text-base font-medium leading-relaxed text-white transition-opacity duration-200 sm:text-lg md:text-xl",
            "text-shadow-sm",
            note ? "opacity-100" : "opacity-55",
          )}
        >
          {note || t("giftNotePlaceholder")}
        </p>
        <p
          className={cn(
            "mt-4 text-sm font-semibold tracking-wide text-white/95 transition-opacity duration-200 sm:text-base",
            sender ? "opacity-100" : "opacity-0",
          )}
        >
          {sender}
        </p>
      </div>
    </div>
  );
}
