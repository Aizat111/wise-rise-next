"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

import type { LoginRequiredDialogProps } from "../types";

/**
 * Prompts guests to sign in or register before watching locked lessons.
 */
export function LoginRequiredDialog({
  open,
  onOpenChange,
}: LoginRequiredDialogProps) {
  const t = useTranslations("course");
  const tAuth = useTranslations("auth");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "gap-4 bg-zinc-950 text-white ring-white/10 sm:max-w-md",
        )}
      >
        <DialogHeader className="gap-2 pr-8">
          <DialogTitle className="text-lg font-semibold text-white sm:text-xl">
            {t("loginRequiredTitle")}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-white/70">
            {t("loginRequiredDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            className="bg-primary text-white hover:bg-primary/90"
            render={<Link href="/giris" />}
            onClick={() => onOpenChange(false)}
          >
            {tAuth("login")}
          </Button>
          <Button
            variant="outline"
            className="border-white/15 bg-transparent text-white hover:bg-white/10"
            render={<Link href="/kayit-ol" />}
            onClick={() => onOpenChange(false)}
          >
            {tAuth("register")}
          </Button>
          <Button
            variant="outline"
            className="border-white/15 bg-transparent text-white hover:bg-white/10"
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
