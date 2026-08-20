"use client";

import type { BaseCardProps } from "./types";
import { BaseCard } from "./BaseCard";

export type PodcastCardProps = Omit<BaseCardProps, "children"> & {
  thumbnail: string;
  title: string;
  hostName?: string;
};

/**
 * Placeholder for upcoming podcast content cards.
 * Extends the shared BaseCard shell so the public API stays stable.
 */
export function PodcastCard({
  title,
  hostName,
  className,
  aspectRatio,
  onClick,
  disabled,
  "aria-label": ariaLabel,
}: PodcastCardProps) {
  return (
    <BaseCard
      aria-label={ariaLabel ?? title}
      className={className}
      aspectRatio={aspectRatio}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex size-full flex-col justify-end gap-1 bg-white/5 p-3">
        {hostName ? (
          <p className="truncate text-xs text-white/70">{hostName}</p>
        ) : null}
        <p className="line-clamp-2 text-sm font-semibold text-white">{title}</p>
      </div>
    </BaseCard>
  );
}
