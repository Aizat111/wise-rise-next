"use client";

import {
  CircleHelpIcon,
  CreditCardIcon,
  HeartIcon,
  LogOutIcon,
  PencilIcon,
  UserIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link, useRouter } from "@/core/i18n/navigation";
import { useLogoutMutation } from "@/features/auth/api/auth.mutations";

import {
  mobileAccountExtraLinks,
  profileMenuLinks,
} from "../constants";
import { ProfileAvatar } from "./AvatarMenu";

const iconMap = {
  user: UserIcon,
  edit: PencilIcon,
  plans: CreditCardIcon,
  help: CircleHelpIcon,
  heart: HeartIcon,
} as const;

type MobileAccountSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  email: string;
  avatarUrl?: string | null;
};

export function MobileAccountSidebar({
  open,
  onOpenChange,
  name,
  email,
  avatarUrl,
}: MobileAccountSidebarProps) {
  const t = useTranslations();
  const router = useRouter();
  const logoutMutation = useLogoutMutation();

  const close = () => onOpenChange(false);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    close();
    router.push("/");
  };

  const menuItems = [
    ...profileMenuLinks.slice(0, 3),
    ...mobileAccountExtraLinks,
    ...profileMenuLinks.slice(3),
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton
        className="w-full max-w-none gap-0 border-0 p-0 sm:max-w-none"
      >
        <SheetHeader className="border-b border-border px-4 py-5 pr-14">
          <SheetTitle className="sr-only">{t("header.account")}</SheetTitle>
          <div className="flex items-center gap-3">
            <ProfileAvatar name={name} src={avatarUrl} size="lg" />
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-base font-medium text-foreground">
                {name || t("header.profile")}
              </p>
              {email ? (
                <p className="truncate text-sm text-muted-foreground">{email}</p>
              ) : null}
            </div>
          </div>
        </SheetHeader>

        <nav className="flex flex-1 flex-col overflow-y-auto px-2 py-3">
          {menuItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-base text-foreground/90 hover:bg-muted hover:text-foreground"
              >
                <Icon className="size-4 opacity-70" />
                {t(item.label)}
              </Link>
            );
          })}

          <Separator className="my-2" />

          <button
            type="button"
            disabled={logoutMutation.isPending}
            onClick={() => {
              void handleLogout();
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-base text-destructive hover:bg-destructive/10 disabled:opacity-50"
          >
            <LogOutIcon className="size-4" />
            {logoutMutation.isPending
              ? t("header.loggingOut")
              : t("header.logout")}
          </button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
