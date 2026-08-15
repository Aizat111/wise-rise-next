"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

import { PRICE_SWITCH_INTERVAL_MS } from "./constants";
import type { CyclingPlanPeriod } from "./types";

const tickerTransition = {
  duration: 1,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function useCyclingPlanPeriod(
  intervalMs = PRICE_SWITCH_INTERVAL_MS,
): CyclingPlanPeriod {
  const [period, setPeriod] = useState<CyclingPlanPeriod>("Yearly");

  useEffect(() => {
    const id = window.setInterval(() => {
      setPeriod((current) =>
        current === "Monthly" ? "Yearly" : "Monthly",
      );
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs]);

  return period;
}

export type PriceSwitcherProps = {
  period: CyclingPlanPeriod;
  monthly: ReactNode;
  yearly: ReactNode;
  className?: string;
};

function cloneSlot(node: ReactNode) {
  return isValidElement(node) ? cloneElement(node) : node;
}

export function PriceSwitcher({
  period,
  monthly,
  yearly,
  className,
}: PriceSwitcherProps) {
  const reduceMotion = useReducedMotion();
  const direction = period === "Monthly" ? 1 : -1;
  const active = period === "Yearly" ? yearly : monthly;

  return (
    <div
      className={cn("relative w-max shrink-0 overflow-hidden", className)}
      aria-live="polite"
    >
      <div className="invisible grid" aria-hidden>
        <div className="col-start-1 row-start-1 whitespace-nowrap">
          {cloneSlot(monthly)}
        </div>
        <div className="col-start-1 row-start-1 whitespace-nowrap">
          {cloneSlot(yearly)}
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="sync" initial={false} custom={direction}>
          <motion.div
            key={period}
            custom={direction}
            className="absolute inset-0 flex items-center"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : {
                    y: `${direction * 120}%`,
                    opacity: 0,
                  }
            }
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    y: `${direction * -120}%`,
                    opacity: 0,
                  }
            }
            transition={tickerTransition}
          >
            {active}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}