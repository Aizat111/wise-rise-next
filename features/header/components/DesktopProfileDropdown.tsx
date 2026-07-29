"use client";

import {
  CircleHelpIcon,
  CreditCardIcon,
  LogOutIcon,
  PencilIcon,
  UserIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouter } from "@/core/i18n/navigation";
import { useLogoutMutation } from "@/features/auth/api/auth.mutations";

import { profileMenuLinks } from "../constants";
import { ProfileAvatar } from "./AvatarMenu";

const iconMap = {
  user: UserIcon,
  edit: PencilIcon,
  plans: CreditCardIcon,
  help: CircleHelpIcon,
} as const;

type DesktopProfileDropdownProps = {
  name: string;
  email: string;
  avatarUrl?: string | null;
};

export function DesktopProfileDropdown({
  name,
  email,
  avatarUrl,
}: DesktopProfileDropdownProps) {
  const t = useTranslations();
  const router = useRouter();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("header.profile")}
            className="rounded-full"
          />
        }
      >
        <ProfileAvatar name={name} src={avatarUrl} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 min-w-56 p-0">
        <div className="flex items-center gap-3 px-3 py-3">
          <ProfileAvatar name={name} src={avatarUrl} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {name || t("header.profile")}
            </p>
            {email ? (
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            ) : null}
          </div>
        </div>

        <DropdownMenuSeparator />

        {profileMenuLinks.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <DropdownMenuItem
              key={item.href}
              className="gap-2 px-3 py-2"
              render={<Link href={item.href} />}
            >
              <Icon className="size-4 opacity-70" />
              {t(item.label)}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="gap-2 px-3 py-2"
          disabled={logoutMutation.isPending}
          onClick={() => {
            void handleLogout();
          }}
        >
          <LogOutIcon className="size-4" />
          {logoutMutation.isPending
            ? t("header.loggingOut")
            : t("header.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
