"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SubscriptionWarningDialogProps = {
  open: boolean;
  variant: "expiring" | "expiredToday";
  remainingDays?: number;
  onRenew: () => void;
  onDismiss?: () => void;
};

export function SubscriptionWarningDialog({
  open,
  variant,
  remainingDays = 0,
  onRenew,
  onDismiss,
}: SubscriptionWarningDialogProps) {
  const t = useTranslations("subscription");
  const isExpiring = variant === "expiring";

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && isExpiring) onDismiss?.();
      }}
    >
      <DialogContent
        showCloseButton={isExpiring}
        className="gap-4 bg-zinc-950 text-white ring-white/10 sm:max-w-md"
      >
        <DialogHeader className="gap-2 pr-8">
          <DialogTitle className="text-lg font-semibold text-white sm:text-xl">
            {isExpiring
              ? t("daysRemaining", { count: remainingDays })
              : t("expiredTitle")}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-white/70">
            {isExpiring ? t("warningDescription") : t("expiredDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:justify-end">
          {isExpiring ? (
            <Button
              type="button"
              nativeButton
              variant="outline"
              className="border-white/15 bg-transparent text-white hover:bg-white/10"
              onClick={onDismiss}
            >
              {t("ok")}
            </Button>
          ) : null}
          <Button
            type="button"
            nativeButton
            onClick={onRenew}
            className="font-semibold"
          >
            {t("renewCta")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
