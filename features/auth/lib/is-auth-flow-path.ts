import { isFreeCampaignPathname } from "@/features/auth/lib/free-campaign";

/**
 * Login, register, and adjacent auth-flow routes where global guest CTAs
 * must stay hidden. Prefix matches cover nested steps such as `/kayit-ol/odeme`.
 */
export const AUTH_FLOW_PATHS = [
  "/giris",
  "/kayit-ol",
  "/kayit",
  "/sifremi-unuttum",
  "/hediye-kullan",
  "/hediye-kuponu",
  "/profil-ekle",
  "/profil-sec",
  "/hedefini-belirle",
  "/survey",
] as const;

export function isAuthFlowPath(pathname: string): boolean {
  if (isFreeCampaignPathname(pathname)) return true;

  return AUTH_FLOW_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
