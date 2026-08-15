import { CATEGORY_HERO_BACKGROUND } from "@/shared/ui/category-hero.constants";
import { CategoryHero } from "@/shared/ui/CategoryHero";

import { COMING_SOON_CONTAINER_CLASS } from "../constants";
import type { ComingSoonShellProps } from "../types";

export function ComingSoonShell({
  title,
  subtitle,
  children,
}: ComingSoonShellProps) {
  return (
    <div className="bg-background text-foreground">
      <CategoryHero
        title={title}
        subtitle={subtitle}
        backgroundSrc={CATEGORY_HERO_BACKGROUND}
      />
      <div className={COMING_SOON_CONTAINER_CLASS}>{children}</div>
    </div>
  );
}
