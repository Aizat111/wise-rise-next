import { Link } from "@/core/i18n/navigation";
import { EducationCard } from "@/features/home/components/cards/EducationCard";

import { SEARCH_GRID_CLASS } from "../constants";
import type { SearchResultsGridProps } from "../types";

export function SearchResultsGrid({ items }: SearchResultsGridProps) {
  return (
    <div className={SEARCH_GRID_CLASS}>
      {items.map((item) => {
        const card = (
          <EducationCard
            entityId={item.id}
            thumbnail={item.thumbnail}
            title={item.title}
            authorName={item.authorName}
            authorLogo={item.authorLogo}
            isFavorite={item.is_favorite ?? false}
          />
        );

        if (!item.href) {
          return (
            <div key={item.id}>{card}</div>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            className="block focus-visible:outline-none"
          >
            {card}
          </Link>
        );
      })}
    </div>
  );
}
