import type { NotifyType } from "./types";

export const DEFAULT_NOTIFY_DURATION = 4000;

export const MAX_VISIBLE_NOTIFICATIONS = 5;

export const NOTIFY_COLORS: Record<
  NotifyType,
  { icon: string; progress: string }
> = {
  success: {
    icon: "text-[#22c55e]",
    progress: "bg-[#22c55e]",
  },
  error: {
    icon: "text-[#ef4444]",
    progress: "bg-[#ef4444]",
  },
  info: {
    icon: "text-[#3b82f6]",
    progress: "bg-[#3b82f6]",
  },
  warning: {
    icon: "text-[#eab308]",
    progress: "bg-[#eab308]",
  },
};
