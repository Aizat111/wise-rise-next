export type RegisterRoutes = {
  1: string;
  2: string;
  3: string;
  4: string;
};

/** Step folders that must never be treated as a coupon code. */
const RESERVED_COUPON_SEGMENTS = new Set([
  "sifre-olustur",
  "plan-sec",
  "odeme",
]);

const COUPON_CODE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

const PLAIN_REGISTER_PATHS = new Set([
  "/kayit-ol",
  "/kayit-ol/sifre-olustur",
]);

export const REGISTER_ROUTES_WITHOUT_COUPON = {
  1: "/kayit-ol",
  2: "/kayit-ol/sifre-olustur",
  3: "/kayit-ol/plan-sec",
  4: "/kayit-ol/odeme",
} as const satisfies RegisterRoutes;

export function normalizeRegisterPathname(pathname: string) {
  if (pathname === "/az" || pathname.startsWith("/az/")) {
    return pathname.slice(3) || "/";
  }
  return pathname || "/";
}

export function isPlainRegisterPath(pathname: string) {
  return PLAIN_REGISTER_PATHS.has(normalizeRegisterPathname(pathname));
}

export function isNormalRegisterPath(pathname: string) {
  const path = normalizeRegisterPathname(pathname);
  return path === "/kayit-ol" || path.startsWith("/kayit-ol/");
}

/** Decode and validate a coupon segment from `/kayit-ol/...`. */
export function parseRegisterCouponCode(
  value: string | null | undefined,
): string | null {
  if (value == null) return null;

  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return null;
  }

  const trimmed = decoded.trim();
  if (!COUPON_CODE_PATTERN.test(trimmed)) return null;
  if (RESERVED_COUPON_SEGMENTS.has(trimmed.toLowerCase())) return null;
  return trimmed;
}

export function getRegisterRoutes(
  couponCode?: string | null,
): RegisterRoutes {
  const code = parseRegisterCouponCode(couponCode);
  if (!code) return REGISTER_ROUTES_WITHOUT_COUPON;

  const encoded = encodeURIComponent(code);
  return {
    1: `/kayit-ol/${encoded}`,
    2: `/kayit-ol/sifre-olustur/${encoded}`,
    3: REGISTER_ROUTES_WITHOUT_COUPON[3],
    4: REGISTER_ROUTES_WITHOUT_COUPON[4],
  };
}

type ResolveRegistrationCouponInput = {
  pathname: string;
  couponParam?: string | null;
  draftCoupon?: string | null;
  isFreeCampaign: boolean;
};

/**
 * Coupon visible for the normal register flow.
 * Steps 1–2 without a coupon segment stay coupon-free.
 * Later steps keep the code stored in the register draft.
 */
export function resolveRegistrationCoupon({
  pathname,
  couponParam,
  draftCoupon,
  isFreeCampaign,
}: ResolveRegistrationCouponInput): string | null {
  if (isFreeCampaign || !isNormalRegisterPath(pathname)) return null;

  const fromUrl = parseRegisterCouponCode(couponParam);
  if (fromUrl) return fromUrl;
  if (isPlainRegisterPath(pathname)) return null;
  return parseRegisterCouponCode(draftCoupon);
}
