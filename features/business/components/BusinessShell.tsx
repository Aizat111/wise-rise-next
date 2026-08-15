import { CATEGORY_HERO_BACKGROUND } from "@/shared/ui/category-hero.constants";
import { CategoryHero } from "@/shared/ui/CategoryHero";

import { BUSINESS_CONTAINER_CLASS, BUSINESS_REFERENCE_LOGOS } from "../constants";
import type { BusinessShellProps } from "../types";
import { BusinessReferences } from "./BusinessReferences";
import { BusinessBanner2 } from "@/shared/ui/banners/BusinessBanner2";


export function BusinessShell({
  title,
  subtitle,
  children,
  referencesTitle
}: BusinessShellProps) {
  return (
    <div className="bg-background text-foreground">
      <CategoryHero
        title={title}
        subtitle={subtitle}
        backgroundSrc={CATEGORY_HERO_BACKGROUND}
      />
      <BusinessBanner2 className="bg-black" />
      <BusinessReferences
        title={referencesTitle}
        logos={BUSINESS_REFERENCE_LOGOS}
      />
      <div className={BUSINESS_CONTAINER_CLASS}>{children}</div>
    </div>
  );
}
