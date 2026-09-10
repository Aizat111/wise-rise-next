"use client";

import { BellIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";

import { useNotifications } from "../hooks/useNotifications";

type NotificationDropdownProps = {
  className?: string;
};

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const t = useTranslations();
  const { data } = useNotifications(true);
  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("header.notifications")}
            className={cn("relative text-base hover:text-primary", className)}
          />
        }
      >
        <BellIcon />
        {unreadCount > 0 ? (
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="w-80 min-w-80 p-0"
      >
        <div className="px-4 py-3">
          <p className="text-sm font-semibold text-foreground">
            {t("header.notifications")}
          </p>
        </div>

        <div className="border-t border-border">
          {notifications.length === 0 ? (
            <DropdownMenuItem
              disabled
              className="cursor-default justify-center py-10 text-center text-sm text-muted-foreground data-disabled:opacity-100"
            >
              {t("header.noNotifications")}
            </DropdownMenuItem>
          ) : (
            <div className="max-h-80 overflow-y-auto py-1">
              {notifications.slice(0, 8).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="items-start gap-2 px-4 py-2.5"
                  render={
                    notification.link ? (
                      <Link href={notification.link} />
                    ) : undefined
                  }
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate text-sm",
                        !notification.is_read && "font-medium text-foreground",
                      )}
                    >
                      {notification.title}
                    </p>
                    {notification.message ? (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                    ) : null}
                  </div>
                  {!notification.is_read ? (
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                  ) : null}
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
