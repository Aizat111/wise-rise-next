"use client";

import { useTranslations } from "next-intl";

import { notify } from "@/shared/components/notify";

type RegisterCouponBadgeProps = {
  couponCode: string;
};

export function RegisterCouponBadge({ couponCode }: RegisterCouponBadgeProps) {
  const t = useTranslations("register.coupon");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      notify.success(t("copied"));
    } catch {
      notify.error(t("copyError"));
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="mb-4 flex w-full cursor-pointer items-center justify-center rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/15"
    >
      {t("label")}: {couponCode}
    </button>
  );
}
