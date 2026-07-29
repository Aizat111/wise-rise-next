"use client";

import { HeartIcon, SearchIcon, UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/core/i18n/navigation";

import { DesktopProfileDropdown } from "./DesktopProfileDropdown";
import { NotificationDropdown } from "./NotificationDropdown";
import { ProfileAvatar } from "./AvatarMenu";

type HeaderActionsProps = {
  isAuthenticated: boolean;
  isAuthLoading?: boolean;
  name: string;
  email: string;
  avatarUrl?: string | null;
  variant?: "desktop" | "mobile";
  onOpenAccount?: () => void;
};

export function HeaderActions({
  isAuthenticated,
  isAuthLoading = false,
  name,
  email,
  avatarUrl,
  variant = "desktop",
  onOpenAccount,
}: HeaderActionsProps) {
  const t = useTranslations();
  const isMobile = variant === "mobile";

  if (isAuthLoading) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Skeleton className="size-8 rounded-md" />
        {isMobile ? null : <Skeleton className="size-8 rounded-md" />}
        <Skeleton className="size-8 rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (isMobile) {
      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("header.search")}
            nativeButton={false}
            render={<Link href="/ara" />}
            className="text-base hover:text-primary"
          >
            <SearchIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("auth.loginText")}
            nativeButton={false}
            render={<Link href="/giris" />}
            className="text-base hover:text-primary"
          >
            <UserIcon />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("header.search")}
          className="text-base hover:text-primary"
        >
          <SearchIcon />
        </Button>

        <Button
          render={<Link href="/giris" />}
          nativeButton={false}
          className="border-none bg-background text-lg font-medium hover:bg-background"
        >
          {t("auth.loginText")}
        </Button>

        <Button
          render={<Link href="/kayit-ol" />}
          nativeButton={false}
          className="px-5 py-5 text-lg font-medium"
        >
          {t("auth.register")}
        </Button>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("header.search")}
          nativeButton={false}
          render={<Link href="/ara" />}
          className="text-base hover:text-primary"
        >
          <SearchIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("header.profile")}
          className="rounded-full"
          onClick={onOpenAccount}
        >
          <ProfileAvatar name={name} src={avatarUrl} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("header.search")}
        nativeButton={false}
        render={<Link href="/ara" />}
        className="text-base hover:text-primary"
      >
        <SearchIcon />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        aria-label={t("header.following")}
        nativeButton={false}
        render={<Link href="/takip-ettiklerim" />}
        className="text-base hover:text-primary"
      >
        <HeartIcon />
      </Button>

      <NotificationDropdown />

      <DesktopProfileDropdown
        name={name}
        email={email}
        avatarUrl={avatarUrl}
      />
    </div>
  );
}
