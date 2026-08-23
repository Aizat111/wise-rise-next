"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WeTheLivingSliderNavigationProps = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
};

export function WeTheLivingSliderNavigation({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
}: WeTheLivingSliderNavigationProps) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        aria-label="Önceki"
        disabled={!canScrollLeft}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={onScrollLeft}
        className={cn(
          "absolute top-1/2 left-0 z-20 -translate-x-1/2 -translate-y-1/2",
          "size-10 rounded-full border border-white/35 bg-black/55 text-white",
          "backdrop-blur-[2px] hover:bg-black/75 hover:text-white",
          "focus-visible:ring-2 focus-visible:ring-white/50",
          "disabled:pointer-events-none disabled:opacity-30",
          "cursor-pointer sm:size-11",
        )}
      >
        <ChevronLeft className="size-5 sm:size-6" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        aria-label="Sonraki"
        disabled={!canScrollRight}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={onScrollRight}
        className={cn(
          "absolute top-1/2 right-0 z-20 translate-x-1/2 -translate-y-1/2",
          "size-10 rounded-full border border-white/35 bg-black/55 text-white",
          "backdrop-blur-[2px] hover:bg-black/75 hover:text-white",
          "focus-visible:ring-2 focus-visible:ring-white/50",
          "disabled:pointer-events-none disabled:opacity-30",
          "cursor-pointer sm:size-11",
        )}
      >
        <ChevronRight className="size-5 sm:size-6" />
      </Button>
    </>
  );
}
