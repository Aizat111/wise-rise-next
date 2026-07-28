"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import type { ProfileAvatar } from "@/core/types/profile.types";

type AvatarPickerProps = {
  avatars: ProfileAvatar[];
  value: number | null;
  onChange: (avatarId: number) => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string | null;
};

function AvatarSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="aspect-square animate-pulse rounded-lg bg-white/10"
        />
      ))}
    </div>
  );
}

export function AvatarPicker({
  avatars,
  value,
  onChange,
  isLoading = false,
  disabled = false,
  className,
  error,
}: AvatarPickerProps) {
  const t = useTranslations("profile");

  if (isLoading) {
    return <AvatarSkeleton />;
  }

  if (!avatars.length) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        {t("avatarRequired")}
      </p>
    );
  }

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <div
        className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6"
        role="listbox"
        aria-label="Avatar"
      >
        {avatars.map((avatar) => {
          const selected = value === avatar.id;
          const src = avatar.file?.path;

          return (
            <button
              key={avatar.id}
              type="button"
              role="option"
              aria-selected={selected}
              disabled={disabled}
              onClick={() => onChange(avatar.id)}
              className={cn(
                "aspect-square overflow-hidden rounded-lg border-2 bg-secondary transition-all",
                "hover:scale-[1.03] hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-transparent",
                disabled && "pointer-events-none opacity-50",
              )}
            >
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={avatar.name}
                  className="size-full object-cover"
                  draggable={false}
                />
              ) : (
                <span className="flex size-full items-center justify-center text-xs text-muted-foreground">
                  {avatar.name}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
