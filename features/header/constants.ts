import type { Category } from "@/core/api/types";

export const guestNavLinks = [
  { href: "/plan", label: "header.plan" },
  { href: "/business", label: "header.business" },
  { href: "/yakinda", label: "header.comingSoon" },
] as const;

export const authNavLinks = [
  { href: "/business", label: "header.business" },
  { href: "/yakinda-gelecekler", label: "header.comingSoon" },
  { href: "/kesfet", label: "header.find" },
  { href: "/aktivitelerim", label: "header.activities" },
] as const;

export const profileMenuLinks = [
  {
    href: "/profil-sec",
    label: "header.profile",
    icon: "user" as const,
  },
  {
    href: "/profil/duzenle",
    label: "header.editProfile",
    icon: "edit" as const,
  },
  {
    href: "/planlarim",
    label: "header.myPlans",
    icon: "plans" as const,
  },
  {
    href: "/yardim-destek",
    label: "header.helpSupport",
    icon: "help" as const,
  },
] as const;

export const mobileAccountExtraLinks = [
  {
    href: "/takip-ettiklerim",
    label: "header.following",
    icon: "heart" as const,
  },
] as const;

export type HeaderNavLink = {
  href: string;
  label: string;
};

export function getCategoryHref(category: Category) {
  return `/kategoriler/${category.slug}`;
}
