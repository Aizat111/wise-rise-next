"use client";

import { useLayoutEffect } from "react";

import { useRegisterDraft } from "@/features/auth/hooks/useRegisterDraft";
import { parseRegisterCouponCode } from "@/features/auth/lib/register-coupon";

type RegisterCouponSyncProps = {
  /** Raw coupon segment. `null` clears the code on the plain step 1/2 routes. */
  couponCode: string | null;
};

/** Keeps the register draft aligned with `/kayit-ol` and `/kayit-ol/sifre-olustur`. */
export function RegisterCouponSync({ couponCode }: RegisterCouponSyncProps) {
  const { draft, ready, updateDraft } = useRegisterDraft();
  const parsed = parseRegisterCouponCode(couponCode);

  useLayoutEffect(() => {
    if (!ready) return;
    if ((draft.couponCode ?? null) === parsed) return;
    updateDraft({ couponCode: parsed });
  }, [draft.couponCode, parsed, ready, updateDraft]);

  return null;
}
