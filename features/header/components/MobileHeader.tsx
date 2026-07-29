"use client";

import { useState } from "react";

import type { Category } from "@/core/api/types";

import { HeaderActions } from "./HeaderActions";
import { HeaderLogo } from "./HeaderLogo";
import { MobileAccountSidebar } from "./MobileAccountSidebar";
import { MobileNavigationSidebar } from "./MobileNavigationSidebar";

type MobileHeaderProps = {
  categories: Category[];
  isAuthenticated: boolean;
  isAuthLoading?: boolean;
  name: string;
  email: string;
  avatarUrl?: string | null;
};

export function MobileHeader({
  categories,
  isAuthenticated,
  isAuthLoading = false,
  name,
  email,
  avatarUrl,
}: MobileHeaderProps) {
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <>
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-3 px-4 md:hidden">
        <div className="flex w-10 shrink-0 items-center justify-start">
          <MobileNavigationSidebar
            categories={categories}
            isAuthenticated={isAuthenticated}
          />
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-center">
          <HeaderLogo width={140} height={40} />
        </div>

        <div className="flex shrink-0 items-center justify-end">
          <HeaderActions
            variant="mobile"
            isAuthenticated={isAuthenticated}
            isAuthLoading={isAuthLoading}
            name={name}
            email={email}
            avatarUrl={avatarUrl}
            onOpenAccount={() => setAccountOpen(true)}
          />
        </div>
      </div>

      {isAuthenticated ? (
        <MobileAccountSidebar
          open={accountOpen}
          onOpenChange={setAccountOpen}
          name={name}
          email={email}
          avatarUrl={avatarUrl}
        />
      ) : null}
    </>
  );
}
