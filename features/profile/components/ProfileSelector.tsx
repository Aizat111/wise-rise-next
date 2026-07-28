"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/core/i18n/navigation";
import { getAuthErrorMessage } from "@/features/auth/api/auth.mutations";
import type { UserProfile } from "@/core/types/profile.types";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveProfile } from "@/store/slices/profileSlice";

import { useProfiles } from "../hooks/useProfiles";
import { DeleteProfileDialog } from "./DeleteProfileDialog";
import { EditProfileDialog } from "./EditProfileDialog";
import { ProfileGrid } from "./ProfileGrid";
import { ProfileSkeleton } from "./ProfileSkeleton";

type ProfileSelectorProps = {
  className?: string;
};

export function ProfileSelector({ className }: ProfileSelectorProps) {
  const t = useTranslations("profile");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const activeProfile = useAppSelector((state) => state.profile.activeProfile);

  const {
    profiles,
    avatars,
    isLoadingProfiles,
    isLoadingAvatars,
    profilesError,
    updateProfile,
    deleteProfile,
    selectProfile,
  } = useProfiles();

  const [editTarget, setEditTarget] = useState<UserProfile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserProfile | null>(null);
  const [selectingId, setSelectingId] = useState<string | number | null>(null);
  const [selectError, setSelectError] = useState<string | null>(null);

  const handleSelect = async (profile: UserProfile) => {
    setSelectError(null);
    setSelectingId(profile.id);
    try {
      const selected = await selectProfile.mutateAsync({
        id: profile.id,
        profile,
      });
      dispatch(setActiveProfile(selected ?? profile));
      router.push("/");
    } catch (error) {
      setSelectError(getAuthErrorMessage(error, t("selectError")));
    } finally {
      setSelectingId(null);
    }
  };

  return (
    <div
      className={cn(
        "relative z-10 flex min-h-screen w-full flex-col items-center px-4 pt-[12vh] pb-16 sm:px-8",
        className,
      )}
    >
      <div className="mb-10 text-center md:mb-14">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
          {t("whoIsWatching")}
        </h1>
      </div>

      {isLoadingProfiles ? <ProfileSkeleton /> : null}

      {!isLoadingProfiles && profilesError ? (
        <p className="text-sm text-red-500" role="alert">
          {getAuthErrorMessage(profilesError, t("loadError"))}
        </p>
      ) : null}

      {!isLoadingProfiles && !profilesError && profiles.length === 0 ? (
        <div className="mb-8 text-center">
          <p className="text-base text-white/70">{t("emptyState")}</p>
        </div>
      ) : null}

      {!isLoadingProfiles && !profilesError ? (
        <ProfileGrid
          profiles={profiles}
          activeProfileId={activeProfile?.id}
          selectingId={selectingId}
          onSelect={(profile) => void handleSelect(profile)}
          onEdit={setEditTarget}
          onDelete={setDeleteTarget}
        />
      ) : null}

      {selectError ? (
        <p className="mt-6 text-sm text-red-500" role="alert">
          {selectError}
        </p>
      ) : null}

      <EditProfileDialog
        profile={editTarget}
        open={Boolean(editTarget)}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        avatars={avatars}
        isLoadingAvatars={isLoadingAvatars}
        onSave={async ({ id, data }) => {
          await updateProfile.mutateAsync({ id, data });
        }}
      />

      <DeleteProfileDialog
        profile={deleteTarget}
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={async (id) => {
          await deleteProfile.mutateAsync(id);
          if (activeProfile && String(activeProfile.id) === String(id)) {
            dispatch(setActiveProfile(null));
          }
        }}
      />
    </div>
  );
}
