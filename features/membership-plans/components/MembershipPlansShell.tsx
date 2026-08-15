import { CATEGORY_HERO_BACKGROUND } from "@/shared/ui/category-hero.constants";
import { CategoryHero } from "@/shared/ui/CategoryHero";

import { MEMBERSHIP_PLANS_CONTAINER_CLASS } from "../constants";
import type { MembershipPlansShellProps } from "../types";

export function MembershipPlansShell({
  title,
  subtitle,
  children,
}: MembershipPlansShellProps) {
  return (
    <div className="bg-background text-foreground">
      <CategoryHero
        title={title}
        subtitle={subtitle}
        backgroundSrc={CATEGORY_HERO_BACKGROUND}
      />
      <div className={MEMBERSHIP_PLANS_CONTAINER_CLASS}>{children}</div>
    </div>
  );
}
