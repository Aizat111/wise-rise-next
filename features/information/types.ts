import type { ReactNode } from "react";

export type InformationBreadcrumbProps = {
  /** Current page label shown as plain text (not a link). */
  current: string;
  /** Optional override for the home link label. Defaults to i18n `information.home`. */
  homeLabel?: string;
  className?: string;
};

export type InformationHeroProps = {
  title: string;
  breadcrumbCurrent: string;
  homeLabel?: string;
  className?: string;
};

export type InformationLayoutProps = {
  title: string;
  breadcrumbCurrent?: string;
  homeLabel?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export type InformationContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
};

export type ContactCardProps = {
  title: string;
  description: string;
  emailLabel: string;
  email: string;
  addressLabel: string;
  address: string;
  className?: string;
  buttonLabel: string;
};

export type FaqItem = {
  id: string;
  title: string;
  description: string;
};

export type FaqAccordionProps = {
  items: FaqItem[];
  className?: string;
};

export type HtmlContentProps = {
  html: string;
  className?: string;
  as?: "div" | "p" | "span";
};

export type InformationPageKey =
  | "about"
  | "contact"
  | "faq"
  | "privacyPolicy"
  | "userAgreement"
  | "distanceSales"
  | "preInfo"
  | "cookiePolicy"
  | "kvkk"
  | "termsOfUse";
