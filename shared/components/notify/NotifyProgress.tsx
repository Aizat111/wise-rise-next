"use client";

import { cn } from "@/lib/utils";
import { NOTIFY_COLORS } from "./constants";
import type { NotifyType } from "./types";

type NotifyProgressProps = {
  type: NotifyType;
  duration: number;
  paused?: boolean;
  className?: string;
};

export function NotifyProgress({
  type,
  duration,
  paused = false,
  className,
}: NotifyProgressProps) {
  if (!Number.isFinite(duration) || duration <= 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 h-0.5 overflow-hidden rounded-b-xl bg-white/10",
        className,
      )}
    >
      <div
        className={cn(
          "h-full w-full origin-left will-change-transform",
          NOTIFY_COLORS[type].progress,
        )}
        style={{
          animation: `notify-progress-shrink ${duration}ms linear forwards`,
          animationPlayState: paused ? "paused" : "running",
        }}
      />
    </div>
  );
}
