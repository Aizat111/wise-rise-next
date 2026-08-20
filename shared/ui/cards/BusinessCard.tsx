"use client";

import type { BaseCardProps } from "./types";
import { BaseCard } from "./BaseCard";

export type BusinessCardProps = Omit<BaseCardProps, "children"> & {
  thumbnail: string;
  title: string;
  subtitle?: string;
};

/**
 * Placeholder for upcoming business content cards.
 * Extends the shared BaseCard shell so the public API stays stable.
 */
export function BusinessCard({
  title,
  className,
  aspectRatio,
  onClick,
  disabled,
  "aria-label": ariaLabel,
}: BusinessCardProps) {
  return (
    <BaseCard
      aria-label={ariaLabel ?? title}
      className={className}
      aspectRatio={aspectRatio}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex size-full items-end bg-white/5 p-3">
        <p className="line-clamp-2 text-sm font-semibold text-white">{title}</p>
      </div>
    </BaseCard>
  );
}
