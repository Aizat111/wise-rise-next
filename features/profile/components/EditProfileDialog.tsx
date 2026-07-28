"use client";

import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  ProfileAvatar,
  UpdateProfileRequest,
  UserProfile,
} from "@/core/types/profile.types";

import { ProfileForm, profileToFormDefaults } from "./ProfileForm";

type EditProfileDialogProps = {
  profile: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  avatars: ProfileAvatar[];
  isLoadingAvatars?: boolean;
  onSave: (payload: {
    id: string | number;
    data: UpdateProfileRequest;
  }) => Promise<void>;
};

export function EditProfileDialog({
  profile,
  open,
  onOpenChange,
  avatars,
  isLoadingAvatars,
  onSave,
}: EditProfileDialogProps) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle className="text-xl">{t("editProfile")}</DialogTitle>
          <DialogDescription>{t("editProfileSubtitle")}</DialogDescription>
        </DialogHeader>

        {profile ? (
          <ProfileForm
            key={String(profile.id)}
            avatars={avatars}
            isLoadingAvatars={isLoadingAvatars}
            defaultValues={profileToFormDefaults(profile)}
            submitLabel={tCommon("save")}
            submittingLabel={t("saving")}
            compact
            onSubmit={async (data) => {
              await onSave({ id: profile.id, data });
              onOpenChange(false);
            }}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
