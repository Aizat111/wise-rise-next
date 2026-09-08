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
import { cn } from "@/lib/utils";

type DeleteNoteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
};

export function DeleteNoteDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}: DeleteNoteDialogProps) {
  const t = useTranslations("course");

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isDeleting) return;
        onOpenChange(next);
      }}
    >
      <DialogContent
        showCloseButton={!isDeleting}
        className={cn("bg-surface text-foreground ring-foreground/10 sm:max-w-md")}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {t("deleteNoteTitle")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("deleteNoteDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            aria-busy={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? t("noteDeleting") : t("deleteNote")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
