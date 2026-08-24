"use client";

import { useState } from "react";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Link } from "@/core/i18n/navigation";
import type { MembershipPlan } from "@/core/types/plan.types";
import { cn } from "@/lib/utils";
import { formatCardNumber } from "@/shared/utils/card";

import type { GiftFormValues } from "../utils/gift-schema";
import { formatGiftPrice } from "../utils/format-gift-price";
import { GiftField } from "./GiftField";

type GiftPaymentFormProps = {
  selectedPlan: MembershipPlan;
  register: UseFormRegister<GiftFormValues>;
  control: Control<GiftFormValues>;
  setValue: UseFormSetValue<GiftFormValues>;
  watch: UseFormWatch<GiftFormValues>;
  errors: FieldErrors<GiftFormValues>;
  disabled?: boolean;
  apiError?: string | null;
};

export function GiftPaymentForm({
  selectedPlan,
  register,
  control,
  setValue,
  watch,
  errors,
  disabled = false,
  apiError,
}: GiftPaymentFormProps) {
  const t = useTranslations("register.step4");
  const tGift = useTranslations("giveGift");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [showCoupon, setShowCoupon] = useState(Boolean(watch("couponCode")));

  const periodLabel =
    selectedPlan.period === "Yearly" ? tCommon("yearly") : tCommon("monthly");
  const planPriceLabel = formatGiftPrice(selectedPlan.price, locale);

  return (
    <div className="flex min-w-0 w-full flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <GiftField
          id="firstName"
          label={t("name")}
          error={errors.firstName?.message}
        >
          <Input
            id="firstName"
            type="text"
            autoComplete="cc-given-name"
            placeholder={t("namePlaceholder")}
            aria-invalid={Boolean(errors.firstName)}
            disabled={disabled}
            {...register("firstName")}
          />
        </GiftField>
        <GiftField
          id="lastName"
          label={t("surname")}
          error={errors.lastName?.message}
        >
          <Input
            id="lastName"
            type="text"
            autoComplete="cc-family-name"
            placeholder={t("surnamePlaceholder")}
            aria-invalid={Boolean(errors.lastName)}
            disabled={disabled}
            {...register("lastName")}
          />
        </GiftField>
      </div>

      <GiftField
        id="cardNumber"
        label={t("cardNumber")}
        error={errors.cardNumber?.message}
      >
        <Controller
          name="cardNumber"
          control={control}
          render={({ field }) => (
            <Input
              id="cardNumber"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="0000 0000 0000 0000"
              aria-invalid={Boolean(errors.cardNumber)}
              disabled={disabled}
              maxLength={19}
              value={formatCardNumber(field.value ?? "")}
              onBlur={field.onBlur}
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, "").slice(0, 16);
                field.onChange(digits);
              }}
            />
          )}
        />
      </GiftField>

      <div className="grid grid-cols-2 gap-3">
        <GiftField
          id="expiry"
          label={t("cardDate")}
          error={errors.expiry?.message}
        >
          <Input
            id="expiry"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder={t("cardDatePlaceholder")}
            aria-invalid={Boolean(errors.expiry)}
            disabled={disabled}
            maxLength={5}
            {...register("expiry", {
              onChange: (event) => {
                const raw = event.target.value.replace(/\D/g, "").slice(0, 4);
                const formatted =
                  raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
                setValue("expiry", formatted, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              },
            })}
          />
        </GiftField>
        <GiftField
          id="cvc"
          label={t("cardCode")}
          error={errors.cvc?.message}
        >
          <Input
            id="cvc"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="***"
            aria-invalid={Boolean(errors.cvc)}
            disabled={disabled}
            maxLength={4}
            {...register("cvc", {
              onChange: (event) => {
                const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                setValue("cvc", digits, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              },
            })}
          />
        </GiftField>
      </div>

      <div className="flex flex-col gap-2">
        {!showCoupon ? (
          <button
            type="button"
            onClick={() => setShowCoupon(true)}
            className="w-fit text-left text-sm font-medium underline underline-offset-1 transition-colors hover:text-primary md:text-base"
          >
            {t("haveCoupon")}
          </button>
        ) : null}

        <div
          className={cn(
            "grid transition-all duration-300 ease-out",
            showCoupon ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <Input
              type="text"
              autoComplete="off"
              placeholder={t("couponeCode")}
              aria-label={t("couponeCode")}
              disabled={disabled || !showCoupon}
              {...register("couponCode")}
            />
          </div>
        </div>
      </div>

      <GiftField
        id="contractConsent"
        label=""
        error={errors.contractConsent?.message}
      >
        <Controller
          name="contractConsent"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="contractConsent"
              checked={Boolean(field.value)}
              onChange={(event) => field.onChange(event.target.checked)}
              disabled={disabled}
              label={
                <>
                  <Link
                    href="/on-bilgilendirme-formu"
                    className="text-primary underline-offset-2 hover:underline"
                    target="_blank"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {t("preInformationForm")}
                  </Link>
                  {` ${t("and")} `}
                  <Link
                    href="/mesafeli-satis-sozlesmesi"
                    className="text-primary underline-offset-2 hover:underline"
                    target="_blank"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {t("distanceContract")}
                  </Link>
                  {t("contractAcceptText")}
                </>
              }
            />
          )}
        />
      </GiftField>

      <div className="flex flex-col gap-1.5 px-1">
        <p className="text-left text-sm font-medium text-white/90">
          {t("cardTypeNotAllowedMessage")}
        </p>
        <p className="text-left text-sm font-medium text-white/90">
          {t("expireMessage")}
        </p>
        <p className="text-left text-sm font-medium text-white/90">
          {t("cancelSubscription")}{" "}
          <Link
            href="/iptal-et"
            className="text-sm font-medium text-primary underline-offset-2 hover:underline"
          >
            {t("distanceContract")}
          </Link>{" "}
          {t("cancelSubscriptionMessage")}
        </p>
      </div>

      {apiError ? (
        <p className="text-sm text-red-500" role="alert">
          {apiError}
        </p>
      ) : null}
    </div>
  );
}
