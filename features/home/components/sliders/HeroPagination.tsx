"use client";

import { cn } from "@/lib/utils";

type HeroPaginationProps = {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
};

export function HeroPagination({
  count,
  activeIndex,
  onSelect,
  className,
}: HeroPaginationProps) {
  if (count <= 1) return null;

  return (
    <div
      role="tablist"
      aria-label="Hero sayfaları"
      className={cn("mt-4 flex items-center justify-center gap-2", className)}
    >
      {Array.from({ length: count }).map((_, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Hero ${index + 1}`}
            onClick={() => onSelect(index)}
            className={cn(
              "size-2 rounded-full transition-all duration-300 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
              isActive
                ? "scale-125 bg-white"
                : "bg-white/40 hover:bg-white/70",
            )}
          />
        );
      })}
    </div>
  );
}
