import { EXPIRED_ALLOWED_PATHS, RENEWAL_ROUTE } from "../constants";

export function isRenewalPath(pathname: string): boolean {
  return pathname === RENEWAL_ROUTE || pathname.startsWith(`${RENEWAL_ROUTE}/`);
}

export function isExpiredAccessAllowedPath(pathname: string): boolean {
  return EXPIRED_ALLOWED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
