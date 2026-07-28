"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/core/types/profile.types";
import Image from "@/shared/ui/Images/Image";

type ProfileCardProps = {
  profile: UserProfile;
  isActive?: boolean;
  isSelecting?: boolean;
  onSelect: (profile: UserProfile) => void;
  onEdit: (profile: UserProfile) => void;
  onDelete: (profile: UserProfile) => void;
  className?: string;
};

function getAvatarUrl(profile: UserProfile): string | null {
  console.log(profile)
  return profile.avatar?.path ?? null;
}

export function ProfileCard({
  profile,
  isActive = false,
  isSelecting = false,
  onSelect,
  onEdit,
  onDelete,
  className,
}: ProfileCardProps) {
  const tCommon = useTranslations("common");
  const avatarUrl = getAvatarUrl(profile);
  console.log(avatarUrl)

  return (
    <div
      className={cn(
        "group flex w-full flex-col items-center gap-3 transition-transform duration-200",
        "hover:-translate-y-1",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(profile)}
        disabled={isSelecting}
        className={cn(
          "relative flex size-28 items-center justify-center overflow-hidden rounded-full border-2 bg-secondary transition-all sm:size-32 md:size-36",
          "hover:border-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive ? "border-primary ring-2 ring-primary/40" : "border-white/15",
          isSelecting && "opacity-70",
        )}
        aria-label={profile.name}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <Image
            src={avatarUrl}
            width={100}
            height={100}
            alt={profile.name}
            className="size-full object-cover"
            draggable={false}

          />
        ) : (
          <span className="text-3xl font-semibold text-white/70">
            {profile.name.slice(0, 1).toUpperCase()}
          </span>
        )}
      </button>

      <p className="max-w-full truncate text-center text-base font-medium text-foreground sm:text-lg">
        {profile.name}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onEdit(profile);
          }}
          className="inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-foreground"
        >
          <Pencil className="size-3.5" />
          {tCommon("edit")}
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(profile);
          }}
          className="inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
          {tCommon("delete")}
        </button>
      </div>
    </div>
  );
}
