"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { SliderNavigationProps } from "../../types";

export function SliderNavigation({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
  className,
}: SliderNavigationProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Önceki"
        disabled={!canScrollLeft}
        onClick={onScrollLeft}
        className={cn(
          "text-white/80 hover:bg-white/10 hover:text-white cursor-pointer",
          "disabled:pointer-events-none disabled:opacity-30",
        )}
      >
        <ChevronLeft className="size-6 text-primary font-bold" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Sonraki"
        disabled={!canScrollRight}
        onClick={onScrollRight}
        className={cn(
          "text-white/80 hover:bg-white/10 hover:text-white cursor-pointer",
          "disabled:pointer-events-none disabled:opacity-30",
        )}
      >
        <ChevronRight className="size-6 text-primary font-bold" />
      </Button>
    </div>
  );
}
