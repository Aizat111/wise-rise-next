"use client";

import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { COUNTRY_CALLING_CODES } from "../constants";
import type { GiftFormValues } from "../utils/gift-schema";
import { GiftField } from "./GiftField";
import { GiftScheduleFields } from "./GiftScheduleFields";

type GiftInformationFormProps = {
  register: UseFormRegister<GiftFormValues>;
  watch: UseFormWatch<GiftFormValues>;
  setValue: UseFormSetValue<GiftFormValues>;
  errors: FieldErrors<GiftFormValues>;
};

const selectClassName = cn(
  "h-11 w-full min-w-0 border border-input bg-secondary px-3 py-2 text-sm text-foreground outline-none",
  "disabled:pointer-events-none disabled:opacity-50",
  "aria-invalid:border-destructive",
);

const textareaClassName = cn(
  "min-h-28 w-full min-w-0 resize-y border border-input bg-secondary px-3 py-2 text-sm text-foreground outline-none",
  "placeholder:text-muted-foreground",
  "disabled:pointer-events-none disabled:opacity-50",
  "aria-invalid:border-destructive",
);

export function GiftInformationForm({
  register,
  watch,
  setValue,
  errors,
}: GiftInformationFormProps) {
  const t = useTranslations("giveGift");

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <GiftField
          id="senderName"
          label={t("senderName")}
          error={errors.senderName?.message}
        >
          <Input
            id="senderName"
            autoComplete="given-name"
            placeholder={t("senderNamePlaceholder")}
            aria-invalid={Boolean(errors.senderName)}
            {...register("senderName")}
          />
        </GiftField>
        <GiftField
          id="senderSurname"
          label={t("senderSurname")}
          error={errors.senderSurname?.message}
        >
          <Input
            id="senderSurname"
            autoComplete="family-name"
            placeholder={t("senderSurnamePlaceholder")}
            aria-invalid={Boolean(errors.senderSurname)}
            {...register("senderSurname")}
          />
        </GiftField>
      </div>

      <GiftField
        id="senderEmail"
        label={t("senderEmail")}
        error={errors.senderEmail?.message}
      >
        <Input
          id="senderEmail"
          type="email"
          autoComplete="email"
          placeholder={t("senderEmailPlaceholder")}
          aria-invalid={Boolean(errors.senderEmail)}
          {...register("senderEmail")}
        />
      </GiftField>

      <GiftField
        id="phoneNumber"
        label={t("senderPhone")}
        error={errors.phoneNumber?.message}
      >
        <div className="flex min-w-0 gap-2">
          <label htmlFor="countryCode" className="sr-only">
            {t("countryCode")}
          </label>
          <select
            id="countryCode"
            className={cn(selectClassName, "w-28 shrink-0 sm:w-32")}
            aria-invalid={Boolean(errors.countryCode)}
            {...register("countryCode", { valueAsNumber: true })}
          >
            {COUNTRY_CALLING_CODES.map((country) => (
              <option key={`${country.iso}-${country.code}`} value={country.code}>
                +{country.code}
              </option>
            ))}
          </select>
          <Input
            id="phoneNumber"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={t("senderPhonePlaceholder")}
            aria-invalid={Boolean(errors.phoneNumber)}
            className="min-w-0 flex-1"
            {...register("phoneNumber")}
          />
        </div>
      </GiftField>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <GiftField
          id="receiverName"
          label={t("receiverName")}
          error={errors.receiverName?.message}
        >
          <Input
            id="receiverName"
            autoComplete="off"
            placeholder={t("receiverNamePlaceholder")}
            aria-invalid={Boolean(errors.receiverName)}
            {...register("receiverName")}
          />
        </GiftField>
        <GiftField
          id="receiverSurname"
          label={t("receiverSurname")}
          error={errors.receiverSurname?.message}
        >
          <Input
            id="receiverSurname"
            autoComplete="off"
            placeholder={t("receiverSurnamePlaceholder")}
            aria-invalid={Boolean(errors.receiverSurname)}
            {...register("receiverSurname")}
          />
        </GiftField>
      </div>

      <GiftField
        id="receiverEmail"
        label={t("receiverEmail")}
        error={errors.receiverEmail?.message}
      >
        <Input
          id="receiverEmail"
          type="email"
          autoComplete="off"
          placeholder={t("receiverEmailPlaceholder")}
          aria-invalid={Boolean(errors.receiverEmail)}
          {...register("receiverEmail")}
        />
      </GiftField>

      <GiftField
        id="giftNote"
        label={t("giftNote")}
        error={errors.giftNote?.message}
      >
        <textarea
          id="giftNote"
          rows={4}
          placeholder={t("giftNotePlaceholder")}
          aria-invalid={Boolean(errors.giftNote)}
          className={textareaClassName}
          {...register("giftNote")}
        />
      </GiftField>

      <GiftScheduleFields
        register={register}
        watch={watch}
        setValue={setValue}
        dateError={errors.sendDate?.message}
        timeError={errors.sendTime?.message}
      />
    </div>
  );
}
