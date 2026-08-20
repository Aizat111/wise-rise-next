"use client";

import type { KeyboardEvent } from "react";

import { cn } from "@/lib/utils";

import { CARD_ASPECT_RATIO_CLASS } from "./constants";
import type { BaseCardProps } from "./types";

/**
 * Shared portrait card shell for content cards.
 * Handles aspect ratio, desktop hover lift/shadow, and keyboard activation.
 */
export function BaseCard({
  children,
  onClick,
  className,
  contentClassName,
  aspectRatio = "3/4",
  disabled = false,
  "aria-label": ariaLabel,
}: BaseCardProps) {
  const isInteractive = Boolean(onClick) && !disabled;

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!isInteractive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <article
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative w-full  overflow-hidden rounded-xl bg-white/5",
        "transition-[transform,box-shadow] duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        isInteractive && "cursor-pointer",
        disabled && "pointer-events-none opacity-60",
        "md:hover:-translate-y-0.5 md:hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
        CARD_ASPECT_RATIO_CLASS[aspectRatio],
        className,
      )}
    >
      <div className={cn("absolute inset-0", contentClassName)}>{children}</div>
    </article>
  );
}
