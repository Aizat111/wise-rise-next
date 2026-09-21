"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { getAuthErrorMessage } from "@/features/auth/api/auth.mutations";
import { useCheckCouponCodeQuery } from "@/features/auth/api/auth.queries";
import { notify } from "@/shared/components/notify";
import { useDebounce } from "@/shared/hooks/useDebounce";

const COUPON_CHECK_DEBOUNCE_MS = 400;

function displayNewPrice(
  value: string | number,
  formatPrice: (price: number) => string,
) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return formatPrice(value);
  }

  const text = String(value).trim();
  return text || null;
}

export function useCheckRegisterCoupon(
  code: string,
  planId: string | null,
  formatPrice: (price: number) => string,
) {
  const t = useTranslations("register.coupon");
  const trimmed = code.trim();
  const debouncedCode = useDebounce(trimmed, COUPON_CHECK_DEBOUNCE_MS);
  const query = useCheckCouponCodeQuery(debouncedCode, planId);
  const notifiedInvalidKey = useRef<string | null>(null);
  const notifiedErrorKey = useRef<string | null>(null);

  const matchesLatest =
    trimmed.length > 0 && trimmed === debouncedCode && Boolean(planId);
  const isChecking =
    trimmed.length > 0 &&
    Boolean(planId) &&
    (trimmed !== debouncedCode || query.isFetching);

  const isInvalid =
    matchesLatest &&
    !query.isFetching &&
    query.isSuccess &&
    query.data.success === false;

  const newPrice =
    matchesLatest &&
    !query.isFetching &&
    query.isSuccess &&
    query.data.success &&
    query.data.data?.new_price != null
      ? displayNewPrice(query.data.data.new_price, formatPrice)
      : null;

  useEffect(() => {
    if (!isInvalid || !planId) return;
    const key = `${planId}:${debouncedCode}`;
    if (notifiedInvalidKey.current === key) return;
    notifiedInvalidKey.current = key;
    notify.error(t("invalid"));
  }, [debouncedCode, isInvalid, planId, t]);

  useEffect(() => {
    if (!matchesLatest || !query.isError || !planId) return;
    const key = `${planId}:${debouncedCode}`;
    if (notifiedErrorKey.current === key) return;
    notifiedErrorKey.current = key;
    notify.error(getAuthErrorMessage(query.error, t("invalid")));
  }, [
    debouncedCode,
    matchesLatest,
    planId,
    query.error,
    query.isError,
    t,
  ]);

  return {
    debouncedCode,
    isChecking: Boolean(isChecking && !isInvalid && !newPrice),
    isInvalid,
    newPrice,
  };
}
