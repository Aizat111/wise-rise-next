"use client";

import { cn } from "@/lib/utils";

type SurveyOptionCardProps = {
  id: string;
  name: string;
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
};

export function SurveyOptionCard({
  id,
  name,
  selected,
  disabled = false,
  onToggle,
}: SurveyOptionCardProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex h-full cursor-pointer items-start gap-3 rounded-xl border bg-surface p-4 transition-colors",
        "hover:border-primary/50 hover:bg-surface/80",
        "focus-within:ring-2 focus-within:ring-ring/60 focus-within:ring-offset-2 focus-within:ring-offset-background",
        selected
          ? "border-primary bg-primary/10"
          : "border-transparent",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={selected}
        disabled={disabled}
        onChange={onToggle}
        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border border-input bg-white/90 accent-primary disabled:cursor-not-allowed"
      />
      <span className="min-w-0 text-sm leading-relaxed break-words text-foreground sm:text-base">
        {name}
      </span>
    </label>
  );
}
