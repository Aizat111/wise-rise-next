import { CATEGORY_HERO_BACKGROUND } from "@/shared/ui/category-hero.constants";
import { CategoryHero } from "@/shared/ui/CategoryHero";

import type { SearchHeroProps } from "../types";

export function SearchHero({ title, subtitle, children }: SearchHeroProps) {
  return (
    <div className="relative z-20">
      <CategoryHero
        title={title}
        subtitle={subtitle}
        backgroundSrc={CATEGORY_HERO_BACKGROUND}
      />
      {children}
    </div>
  );
}
