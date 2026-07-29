"use client";

import type { Category } from "@/core/api/types";

import { useHeader } from "../hooks/useHeader";
import { DesktopHeader } from "./DesktopHeader";
import { MobileHeader } from "./MobileHeader";

type HeaderProps = {
  categories: Category[];
};

export function Header({ categories }: HeaderProps) {
  const {
    isAuthenticated,
    isAuthLoading,
    profileName,
    email,
    avatarUrl,
  } = useHeader();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md">
      <DesktopHeader
        categories={categories}
        isAuthenticated={isAuthenticated}
        isAuthLoading={isAuthLoading}
        name={profileName}
        email={email}
        avatarUrl={avatarUrl}
      />
      <MobileHeader
        categories={categories}
        isAuthenticated={isAuthenticated}
        isAuthLoading={isAuthLoading}
        name={profileName}
        email={email}
        avatarUrl={avatarUrl}
      />
    </header>
  );
}
