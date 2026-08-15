import { ComingSoonCard } from "@/features/home/components/cards/ComingSoonCard";

import { COMING_SOON_GRID_CLASS } from "../constants";
import type { ComingSoonGridProps } from "../types";

export function ComingSoonGrid({ items }: ComingSoonGridProps) {
  return (
    <div className={COMING_SOON_GRID_CLASS}>
      {items.map((item) => (
        <ComingSoonCard
          key={item.id}
          thumbnail={item.thumbnail}
          title={item.title}
          authorName={item.authorName}
          authorLogo={item.authorLogo}
          dateLabel={item.dateLabel}
        />
      ))}
    </div>
  );
}
