"use client";

import { useTranslations } from "next-intl";
import { useNotify } from "@/shared/components/notify/hooks/useNotify";
import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";
import { useRouter } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";
import { useAvatarsQuery } from "../api/profile.queries";
import { useCreateProfileMutation } from "../api/profile.mutations";
import { ProfileForm } from "../components/ProfileForm";

export default function CreateProfilePage() {
  const t = useTranslations("profile");
  const router = useRouter();
  const avatarsQuery = useAvatarsQuery();
  const createProfile = useCreateProfileMutation();
  const notify = useNotify();
  return (
    <AuthLayout solid>
      <div
        className={cn(
          "relative z-10 flex min-h-screen items-start justify-center px-2 pt-[10vh] sm:px-10 md:px-25",
        )}
      >
        <div className="w-full border-none bg-black px-5 py-8 text-left md:max-w-lg">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-semibold text-foreground sm:text-4xl">
              {t("createProfile")}
            </h1>
            <p className="text-sm font-medium text-white/90 antialiased sm:text-base">
              {t("createProfileSubtitle")}
            </p>
          </div>

          <ProfileForm
            avatars={avatarsQuery.data ?? []}
            isLoadingAvatars={avatarsQuery.isLoading}
            submitLabel={t("createSubmit")}
            submittingLabel={t("creating")}
            onSubmit={async (data) => {
              await createProfile.mutateAsync(data).then(() => {
                notify.success(t("profileCreatedSuccess"));
                router.push("/profil-sec");
              }).catch((error) => {
                console.error(error);
              });
              router.push("/profil-sec");
            }}
          />
        </div>
      </div>
    </AuthLayout>
  );
}
