"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

import type { FaqAccordionProps } from "../types";

const panelTransition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={cn("space-y-3", className)} role="list">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-panel-${item.id}`;
        const buttonId = `${baseId}-button-${item.id}`;

        return (
          <div
            key={item.id}
            role="listitem"
            className="border-b border-white/10 last:border-b-0"
          >
            <h2>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-lg"
              >
                <span className="text-xl">{item.title}</span>
                <span
                  className={cn(
                    "relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary transition-transform duration-300 ease-out",
                    isOpen && "scale-95",
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isOpen ? (
                      <motion.span
                        key="minus"
                        initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Minus
                          aria-hidden
                          className="size-5 text-white"
                          strokeWidth={2.5}
                        />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="plus"
                        initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Plus
                          aria-hidden
                          className="size-5 text-white"
                          strokeWidth={2.5}
                        />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </button>
            </h2>
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              initial={false}
              animate={{
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={panelTransition}
              className="overflow-hidden"
            >
              <p className="pb-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
                {item.description}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
