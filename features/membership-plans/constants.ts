export const MEMBERSHIP_PLANS_ROUTE = "/uyelik-planlari" as const;

export const RENEWAL_ROUTE = "/uyelik-yenile" as const;
export const RENEWAL_PAYMENT_ROUTE = "/uyelik-yenile/odeme" as const;

export const EXPIRED_TODAY_REDIRECT_MS = 10_000;

export const EXPIRING_WARNING_MIN_DAYS = 1;
export const EXPIRING_WARNING_MAX_DAYS = 7;

/** Contract pages opened from the payment form — keep reachable while expired. */
export const EXPIRED_ALLOWED_PATHS = [
  RENEWAL_ROUTE,
  "/on-bilgilendirme-formu",
  "/mesafeli-satis-sozlesmesi",
  "/uyelik-sozlesmesi",
] as const;

export const MEMBERSHIP_PLANS_CONTAINER_CLASS =
  "mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12";

export const MEMBERSHIP_PLAN_GRID_CLASS =
  "grid grid-cols-1 gap-4 sm:grid-cols-2";
