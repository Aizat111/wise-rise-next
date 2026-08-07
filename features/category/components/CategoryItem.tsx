"use client";

import { Link } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";

import type { CategoryItemProps } from "../types";

export function CategoryItem({
  label,
  href,
  isActive = false,
}: CategoryItemProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "block rounded-md px-3 py-3 text-sm transition-colors duration-200 font-semibold lg:text-base",
        "hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        isActive
          ? "bg-white/10 font-semibold text-white"
          : "text-white",
      )}
    >
      {label}
    </Link>
  );
}
