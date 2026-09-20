import type { Category } from "@/core/api/types";

export const guestNavLinks = [
  { href: "/uyelik-planlari", label: "header.plan" },
  { href: "/business", label: "header.business" },
  { href: "/yakinda-gelecekler", label: "header.comingSoon" },
] as const;

export const authNavLinks = [
  { href: "/business", label: "header.business" },
  { href: "/yakinda-gelecekler", label: "header.comingSoon" },
  { href: "/kategoriler", label: "header.find" },
  { href: "/aktivitelerim", label: "header.activities" },
] as const;

export const mobileNavLinks = [
  { href: "/kategoriler", label: "header.categories" },
  { href: "/business", label: "header.business" },
  { href: "/yakinda-gelecekler", label: "header.comingSoon" },
  { href: "/hediye-et", label: "footer.giveGift" },
  { href: "/hediye-kullan", label: "footer.giftCoupon" },
  { href: "/kategoriler", label: "header.find" },
  { href: "/iletisim", label: "footer.contact" },
  { href: "/sikca-sorulan-sorular", label: "footer.frequentlyAskedQuestions" },
  { href: "/iletisim", label: "footer.helpCenter" },
  { href: "/uyelik-sozlesmesi", label: "footer.subscriptionTerms" },
  { href: "/gizlilik-politikasi", label: "footer.privacyPolicy" },
] as const;

export const profileMenuLinks = [
  {
    href: "/profil-sec",
    label: "header.profile",
    icon: "user" as const,
  },
  {
    href: "/profil-sec",
    label: "header.editProfile",
    icon: "edit" as const,
  },
  {
    href: "/uyelik-planlari",
    label: "header.myPlans",
    icon: "plans" as const,
  },
  {
    href: "/sikca-sorulan-sorular",
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
  return `/${category.slug}`;
}
