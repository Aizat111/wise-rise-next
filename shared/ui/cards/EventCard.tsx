"use client";

import type { BaseCardProps } from "./types";
import { BaseCard } from "./BaseCard";

export type EventCardProps = Omit<BaseCardProps, "children"> & {
  thumbnail: string;
  title: string;
  dateLabel?: string;
};

/**
 * Placeholder for upcoming event content cards.
 * Extends the shared BaseCard shell so the public API stays stable.
 */
export function EventCard({
  title,
  dateLabel,
  className,
  aspectRatio,
  onClick,
  disabled,
  "aria-label": ariaLabel,
}: EventCardProps) {
  return (
    <BaseCard
      aria-label={ariaLabel ?? title}
      className={className}
      aspectRatio={aspectRatio}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex size-full flex-col justify-end gap-1 bg-white/5 p-3">
        {dateLabel ? (
          <p className="text-xs text-white/70">{dateLabel}</p>
        ) : null}
        <p className="line-clamp-2 text-sm font-semibold text-white">{title}</p>
      </div>
    </BaseCard>
  );
}
