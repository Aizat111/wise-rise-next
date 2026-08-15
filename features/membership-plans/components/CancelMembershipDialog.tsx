"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

import { useDisableAccountMutation } from "../api/membership.mutations";

type CancelMembershipDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CancelMembershipDialog({
  open,
  onOpenChange,
}: CancelMembershipDialogProps) {
  const t = useTranslations("pracingPlan");
  const disableAccount = useDisableAccountMutation();

  const handleConfirm = async () => {
    try {
      await disableAccount.mutateAsync();
      onOpenChange(false);
    } catch {
      // Error notify is handled in the mutation.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="gap-4 bg-zinc-950 text-white ring-white/10 sm:max-w-md"
      >
        <DialogHeader className="gap-2 pr-8">
          <DialogTitle className="text-lg font-semibold text-white sm:text-xl">
            {t("cancelTitle")}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-white/70">
            {t("subscriptionMessage")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            nativeButton
            variant="outline"
            className="border-white/15 bg-transparent text-white hover:bg-white/10"
            onClick={() => onOpenChange(false)}
            disabled={disableAccount.isPending}
          >
            {t("cancelDismiss")}
          </Button>
          <Button
            type="button"
            nativeButton
            variant="destructive"
            onClick={handleConfirm}
            disabled={disableAccount.isPending}
            className="font-semibold"
          >
            {disableAccount.isPending ? t("cancelling") : t("cancelConfirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
