"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";
import {
  detectCardBrand,
  formatCardNumber,
  type CardBrand,
} from "@/shared/utils/card";

const BRAND_SRC: Record<Exclude<CardBrand, null>, string> = {
  visa: "/credit-card/visa.png",
  mastercard: "/credit-card/mastercard.png",
};

export type LivePaymentCardValues = {
  cardNumber: string;
  firstName: string;
  lastName: string;
  expiry: string;
  cvc: string;
};

type LivePaymentCardProps = {
  values: LivePaymentCardValues;
  className?: string;
  ariaLabel?: string;
};

export function LivePaymentCard({
  values,
  className,
  ariaLabel,
}: LivePaymentCardProps) {
  const t = useTranslations("giveGift");
  const reduceMotion = useReducedMotion();
  const digits = values.cardNumber.replace(/\D/g, "").slice(0, 16);
  const brand = detectCardBrand(digits);
  const holder = `${values.firstName} ${values.lastName}`.trim();
  const formattedNumber = digits
    ? formatCardNumber(digits) +
      (digits.length < 16 ? " " + "•".repeat(Math.min(4, 16 - digits.length)) : "")
    : "•••• •••• •••• ••••";
  const expiryDisplay = values.expiry.trim() || "MM/YY";
  const nameDisplay = holder ? holder.toLocaleUpperCase("tr-TR") : t("cardHolderPlaceholder");

  return (
    <div
      role="img"
      aria-label={ariaLabel ?? t("paymentCardAlt")}
      className={cn(
        "relative aspect-16/10 w-full min-w-0 overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      <Image
        src="/credit-card/card_bg_img.jpg"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-br from-black/25 via-black/10 to-black/40"
      />

      <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <Image
            src="/credit-card/chip.png"
            alt=""
            width={52}
            height={40}
            className="h-8 w-11 object-contain sm:h-10 sm:w-13"
          />
          <div className="relative h-8 w-14 sm:h-10 sm:w-16">
            <AnimatePresence mode="wait">
              {brand ? (
                <motion.div
                  key={brand}
                  className="absolute inset-0"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={BRAND_SRC[brand]}
                    alt={brand === "visa" ? "Visa" : "Mastercard"}
                    fill
                    sizes="64px"
                    className="object-contain object-right"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  className="absolute inset-0 flex items-center justify-end"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                >
                  <span className="rounded border border-white/40 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-white/70">
                    CARD
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="font-mono text-base tracking-[0.18em] text-white sm:text-xl sm:tracking-[0.22em]">
          {formattedNumber}
        </p>

        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/55">
              {t("cardHolderLabel")}
            </p>
            <p className="truncate text-sm font-semibold tracking-wide text-white sm:text-base">
              {nameDisplay}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/55">
              {t("cardExpiryLabel")}
            </p>
            <p className="font-mono text-sm text-white sm:text-base">{expiryDisplay}</p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/55">
              CVC
            </p>
            <p className="font-mono text-sm tracking-[0.3em] text-white" aria-hidden>
              {values.cvc ? "•••" : "•••"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
