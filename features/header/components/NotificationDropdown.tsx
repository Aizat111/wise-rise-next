"use client";

import { BellIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";

import { useNotifications } from "../hooks/useNotifications";

type NotificationDropdownProps = {
  className?: string;
};

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const t = useTranslations();
  const { data, isLoading, isError } = useNotifications(true);
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
      <DropdownMenuContent align="end" className="w-80 min-w-72 p-0">
        <DropdownMenuLabel className="px-3 py-2.5 text-sm font-semibold text-foreground">
          {t("header.notifications")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="max-h-80 overflow-y-auto py-1">
          {isLoading ? (
            <div className="space-y-3 px-3 py-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : isError || notifications.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              {t("header.noNotifications")}
            </div>
          ) : (
            notifications.slice(0, 8).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="items-start gap-2 px-3 py-2.5"
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
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                </div>
                {!notification.is_read ? (
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                ) : null}
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="justify-center py-2.5 text-sm font-medium"
          render={<Link href="/bildirimler" />}
        >
          {t("header.viewAllNotifications")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
