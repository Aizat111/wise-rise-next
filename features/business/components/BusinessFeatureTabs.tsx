"use client";

import { useId, useRef, type KeyboardEvent } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { BusinessFeatureTabsProps } from "../types";

export function BusinessFeatureTabs({
  tabs,
  activeType,
  onTypeChange,
  labelledBy,
  panelId,
}: BusinessFeatureTabsProps) {
  const layoutId = useId();
  const reduceMotion = useReducedMotion();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function focusTab(index: number) {
    const tab = tabs[index];
    if (!tab) return;
    onTypeChange(tab.type);
    tabRefs.current[index]?.focus();
  }

  function onKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab((index + 1) % tabs.length);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab((index - 1 + tabs.length) % tabs.length);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusTab(tabs.length - 1);
    }
  }

  return (
    <LayoutGroup id={layoutId}>
      <div
        role="tablist"
        aria-labelledby={labelledBy}
        className="mx-auto flex  justify-center w-full max-w-md gap-1 p-1 sm:w-auto sm:max-w-none "
      >
        {tabs.map((tab, index) => {
          const isActive = activeType === tab.type;
          const tabId = `${panelId}-tab-${tab.type}`;

          return (
            <button
              key={tab.type}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={tabId}
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTypeChange(tab.type)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "relative z-10 min-h-11 flex-1 cursor-pointer rounded-full px-4 py-2.5 text-sm font-semibold transition-colors md:text-base sm:flex-none sm:px-6",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive ? "text-white font-bold" : "text-white/80 hover:text-white",
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId={`${layoutId}-pill`}
                  className="absolute inset-0 border-b-2 border-primary "
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 32 }
                  }
                />
              ) : null}
              <span className="relative z-10 ">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
