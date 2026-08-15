import { cn } from "@/lib/utils";

import {
  SEARCH_CONTAINER_CLASS,
  SEARCH_RESULTS_PADDING_CLASS,
} from "../constants";
import type { SearchShellProps } from "../types";
import { SearchHero } from "./SearchHero";

export function SearchShell({
  title,
  subtitle,
  overlay,
  children,
}: SearchShellProps) {
  return (
    <div className="bg-background text-foreground [--search-input-height:3.5rem] sm:[--search-input-height:4rem]">
      <SearchHero title={title} subtitle={subtitle}>
        {overlay ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-1/2">
            <div className={cn("pointer-events-auto", SEARCH_CONTAINER_CLASS)}>
              {overlay}
            </div>
          </div>
        ) : null}
      </SearchHero>
      <div
        className={cn(
          "relative z-0",
          SEARCH_CONTAINER_CLASS,
          SEARCH_RESULTS_PADDING_CLASS,
        )}
      >
        {children}
      </div>
    </div>
  );
}
