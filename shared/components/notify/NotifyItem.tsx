"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { NotifyIcon } from "./NotifyIcon";
import { NotifyProgress } from "./NotifyProgress";
import { notify } from "./store/notify.store";
import type { NotifyItem as NotifyItemType } from "./types";

type NotifyItemProps = {
  item: NotifyItemType;
};

export function NotifyItem({ item }: NotifyItemProps) {
  const [paused, setPaused] = useState(false);
  const remainingRef = useRef(item.duration);
  const startedAtRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const dismiss = () => {
    clearTimer();
    notify.dismiss(item.id);
  };

  const startTimer = (ms: number) => {
    clearTimer();
    if (!Number.isFinite(ms) || ms <= 0) return;

    startedAtRef.current = Date.now();
    timerRef.current = setTimeout(dismiss, ms);
  };

  useEffect(() => {
    remainingRef.current = item.duration;
    startTimer(item.duration);

    return clearTimer;
    // Restart only when this toast identity/duration changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, item.duration]);

  const handleMouseEnter = () => {
    if (!Number.isFinite(item.duration) || item.duration <= 0) return;

    setPaused(true);
    if (startedAtRef.current !== null) {
      const elapsed = Date.now() - startedAtRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    }
    clearTimer();
  };

  const handleMouseLeave = () => {
    if (!Number.isFinite(item.duration) || item.duration <= 0) return;

    setPaused(false);
    startTimer(remainingRef.current);
  };

  return (
    <motion.div
      layout
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, x: 48 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 48 }}
      transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.8 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden",
        "rounded-xl border border-white/10 bg-[#121212]/95 px-4 py-3.5 shadow-lg backdrop-blur-md",
      )}
    >
      <NotifyIcon type={item.type} className="mt-0.5" />

      <p className="min-w-0 flex-1 break-words text-sm leading-5 text-foreground">
        {item.message}
      </p>

      <button
        type="button"
        aria-label="Kapat"
        onClick={dismiss}
        className={cn(
          "shrink-0 rounded-md p-1 text-muted-foreground transition-opacity",
          "opacity-60 hover:bg-white/10 hover:opacity-100",
          "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
        )}
      >
        <X className="size-4" strokeWidth={2} />
      </button>

      <NotifyProgress
        type={item.type}
        duration={item.duration}
        paused={paused}
      />
    </motion.div>
  );
}
