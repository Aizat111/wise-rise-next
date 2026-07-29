"use client";

import { AnimatePresence } from "framer-motion";
import { getZIndex } from "@/core/constants/zIndex.constants";
import { useNotifyStore } from "./hooks/useNotify";
import { NotifyItem } from "./NotifyItem";

export function NotifyContainer() {
  const notifications = useNotifyStore();

  return (
    <div
      aria-label="Bildirimler"
      className="pointer-events-none fixed inset-x-6 bottom-6 flex flex-col gap-3 sm:inset-x-auto sm:right-6 sm:w-full sm:max-w-sm"
      style={{ zIndex: getZIndex("toast") }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {notifications.map((item) => (
          <NotifyItem key={item.id} item={item} />
        ))}
      </AnimatePresence>
    </div>
  );
}
