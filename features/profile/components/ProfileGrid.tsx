"use client";

import { MAX_PROFILES } from "@/core/constants/auth.constants";
import type { UserProfile } from "@/core/types/profile.types";
import { cn } from "@/lib/utils";

import { AddProfileCard } from "./AddProfileCard";
import { ProfileCard } from "./ProfileCard";

type ProfileGridProps = {
  profiles: UserProfile[];
  activeProfileId?: string | number | null;
  selectingId?: string | number | null;
  onSelect: (profile: UserProfile) => void;
  onEdit: (profile: UserProfile) => void;
  onDelete: (profile: UserProfile) => void;
  className?: string;
};

const cardClassName = "w-full max-w-xs md:w-44 md:max-w-44 lg:w-48 lg:max-w-48";

export function ProfileGrid({
  profiles,
  activeProfileId,
  selectingId,
  onSelect,
  onEdit,
  onDelete,
  className,
}: ProfileGridProps) {
  const canAdd = profiles.length < MAX_PROFILES;

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-5xl flex-col items-center gap-8",
        "md:flex-row md:flex-wrap md:justify-center md:gap-x-8 md:gap-y-10",
        className,
      )}
    >
      {profiles.map((profile) => (
        <ProfileCard
          key={String(profile.id)}
          profile={profile}
          isActive={String(activeProfileId) === String(profile.id)}
          isSelecting={String(selectingId) === String(profile.id)}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          className={cardClassName}
        />
      ))}
      {canAdd ? <AddProfileCard className={cardClassName} /> : null}
    </div>
  );
}
