"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import type { TrailerDialogProps } from "../types";
import { VideoPlayer } from "./VideoPlayer";

/**
 * Responsive trailer / lesson video modal.
 * Reports max watch percentage when closed or when playback finishes.
 */
export function TrailerDialog({
  open,
  onOpenChange,
  title,
  videoUrl,
  onWatchProgress,
}: TrailerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "gap-0 overflow-hidden p-0 sm:max-w-4xl",
          "bg-zinc-950 text-white ring-white/10",
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="relative aspect-video w-full max-h-[85vh]  bg-black">
          {open && videoUrl ? (
            <VideoPlayer
              key={videoUrl}
              src={videoUrl}
              autoPlay
              playsInline
              onClose={onWatchProgress}
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-white/55">
              {title}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
