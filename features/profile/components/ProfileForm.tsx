"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuthErrorMessage } from "@/features/auth/api/auth.mutations";
import { cn } from "@/lib/utils";
import type {
  CreateProfileRequest,
  ProfileAvatar,
  UserProfile,
} from "@/core/types/profile.types";

import { AvatarPicker } from "./AvatarPicker";
import Image from "@/shared/ui/Images/Image";

function createProfileSchema(
  t: ReturnType<typeof useTranslations<"profile">>,
) {
  return z.object({
    name: z
      .string()
      .min(1, t("nameRequired"))
      .min(2, t("nameMinLength"))
      .max(30, t("nameMaxLength")),
    avatarId: z.number().nullable().refine((value) => value != null, {
      message: t("avatarRequired"),
    }),

  });
}

export type ProfileFormValues = {
  name: string;
  avatarId: number | null;
  timezone?: string;
  language?: string;
};

type ProfileFormProps = {
  avatars: ProfileAvatar[];
  isLoadingAvatars?: boolean;
  defaultValues?: Partial<ProfileFormValues>;
  submitLabel: string;
  submittingLabel?: string;
  onSubmit: (values: CreateProfileRequest) => Promise<void>;
  className?: string;
  /** Compact layout for modal edit */
  compact?: boolean;
};

export function ProfileForm({
  avatars,
  isLoadingAvatars = false,
  defaultValues,
  submitLabel,
  submittingLabel,
  onSubmit,
  className,
  compact = false,
}: ProfileFormProps) {
  const t = useTranslations("profile");
  const [apiError, setApiError] = useState<string | null>(null);

  const schema = useMemo(() => createProfileSchema(t), [t]);
  const resolver = useMemo(() => standardSchemaResolver(schema), [schema]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver,
    defaultValues: {
      name: defaultValues?.name ?? "",
      avatarId: defaultValues?.avatarId ?? null,
      timezone: "Europe/Istanbul",
      language: "tr",
    },
  });

  const selectedAvatarId = watch("avatarId");
  const selectedAvatar = avatars.find((avatar) => avatar.id === selectedAvatarId);
  const isLoading = isSubmitting;

  const handleFormSubmit = handleSubmit(async (values) => {
    if (values.avatarId == null) return;
    setApiError(null);
    try {
      await onSubmit({
        name: values.name.trim(),
        avatar_id: values.avatarId,
        timezone: "Europe/Istanbul",
        language: "tr",

      });
    } catch (error) {
      setApiError(getAuthErrorMessage(error, t("genericError")));
    }
  });

  return (
    <form
      onSubmit={handleFormSubmit}
      className={cn("flex w-full flex-col gap-5", className)}
      noValidate
    >
      <div className="flex w-full flex-col gap-1.5">
        <label className="text-sm font-medium text-white/80" htmlFor="profile-name">
          {t("name")}
        </label>
        <div className="relative w-full">
          <Input
            id="profile-name"
            type="text"
            autoComplete="off"
            placeholder={t("namePlaceholder")}
            aria-invalid={Boolean(errors.name)}
            disabled={isLoading}
            className="pr-14"
            {...register("name")}
          />
          <button
            type="button"
            tabIndex={-1}
            disabled={isLoading}
            onClick={() => {
              document.getElementById("avatar-picker")?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
              });
            }}
            className={cn(
              "absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-secondary",
              "transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
            aria-label={t("chooseAvatar")}
            title={t("chooseAvatar")}
          >
            {selectedAvatar?.file?.path ? (
              // eslint-disable-next-line @next/next/no-img-element
              <Image
                src={selectedAvatar.file.path}
                width={100}
                height={100}
                alt={selectedAvatar.name}
                className="size-full object-cover"
                draggable={false}
              />
            ) : (
              <span className="text-[10px] font-medium text-white/50">+</span>
            )}
          </button>
        </div>
        {errors.name?.message ? (
          <p className="text-sm text-red-500" role="alert">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div id="avatar-picker" className="flex w-full flex-col gap-2">
        <p className="text-sm font-medium text-white/80">{t("chooseAvatar")}</p>
        <Controller
          name="avatarId"
          control={control}
          render={({ field }) => (
            <AvatarPicker
              avatars={avatars}
              value={field.value}
              onChange={(id) => {
                field.onChange(id);
                setValue("avatarId", id, { shouldValidate: true });
              }}
              isLoading={isLoadingAvatars}
              disabled={isLoading}
              error={errors.avatarId?.message}
            />
          )}
        />
      </div>

      {apiError ? (
        <p className="text-sm text-red-500" role="alert">
          {apiError}
        </p>
      ) : null}

      <Button
        type="submit"
        nativeButton
        disabled={isLoading}
        className={cn(
          "h-11 w-full text-sm font-semibold md:text-base",
          compact && "mt-1",
        )}
      >
        {isLoading ? (submittingLabel ?? submitLabel) : submitLabel}
      </Button>
    </form>
  );
}

export function profileToFormDefaults(
  profile: UserProfile,
): Partial<ProfileFormValues> {
  return {
    name: profile.name,
    avatarId: profile.avatar_id ?? profile.avatar?.id ?? null,
  };
}
