"use client";

import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { NOTIFY_COLORS } from "./constants";
import type { NotifyType } from "./types";

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
} as const;

type NotifyIconProps = {
  type: NotifyType;
  className?: string;
};

export function NotifyIcon({ type, className }: NotifyIconProps) {
  const Icon = ICONS[type];

  return (
    <Icon
      aria-hidden
      className={cn("size-5 shrink-0", NOTIFY_COLORS[type].icon, className)}
      strokeWidth={2}
    />
  );
}
