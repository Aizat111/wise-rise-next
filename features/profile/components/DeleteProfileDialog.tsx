"use client";

import { useState } from "react";
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
import { getAuthErrorMessage } from "@/features/auth/api/auth.mutations";
import type { UserProfile } from "@/core/types/profile.types";

type DeleteProfileDialogProps = {
  profile: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string | number) => Promise<void>;
};

export function DeleteProfileDialog({
  profile,
  open,
  onOpenChange,
  onConfirm,
}: DeleteProfileDialogProps) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const [isDeleting, setIsDeleting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!profile) return;
    setApiError(null);
    setIsDeleting(true);
    try {
      await onConfirm(profile.id);
      onOpenChange(false);
    } catch (error) {
      setApiError(getAuthErrorMessage(error, t("deleteError")));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isDeleting) return;
        setApiError(null);
        onOpenChange(next);
      }}
    >
      <DialogContent showCloseButton={!isDeleting} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("deleteProfile")}</DialogTitle>
          <DialogDescription>{t("deleteProfileConfirm")}</DialogDescription>
        </DialogHeader>

        {apiError ? (
          <p className="text-sm text-red-500" role="alert">
            {apiError}
          </p>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            className="h-10"
          >
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={() => void handleConfirm()}
            className="h-10"
          >
            {isDeleting ? t("deleting") : tCommon("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
