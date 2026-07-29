"use client";

import type { Category } from "@/core/api/types";

import { HeaderActions } from "./HeaderActions";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderNavigation } from "./HeaderNavigation";

type DesktopHeaderProps = {
  categories: Category[];
  isAuthenticated: boolean;
  isAuthLoading?: boolean;
  name: string;
  email: string;
  avatarUrl?: string | null;
};

export function DesktopHeader({
  categories,
  isAuthenticated,
  isAuthLoading = false,
  name,
  email,
  avatarUrl,
}: DesktopHeaderProps) {
  return (
    <div className="mx-auto hidden h-20 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 md:flex">
      <div className="flex min-w-0 items-center gap-5">
        <HeaderLogo />
        <HeaderNavigation
          categories={categories}
          isAuthenticated={isAuthenticated}
        />
      </div>

      <div className="flex-1" />

      <HeaderActions
        variant="desktop"
        isAuthenticated={isAuthenticated}
        isAuthLoading={isAuthLoading}
        name={name}
        email={email}
        avatarUrl={avatarUrl}
      />
    </div>
  );
}
