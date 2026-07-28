"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Link } from "@/core/i18n/navigation";
import {
  getAuthErrorMessage,
  useRegisterStep4Mutation,
} from "@/features/auth/api/auth.mutations";
import type { RegisterDraft } from "@/features/auth/hooks/useRegisterDraft";
import { cn } from "@/lib/utils";

import { StickyContinueButton } from "./StickyContinueButton";

const FORM_ID = "register-payment-form";

function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatCardNumber(digits: string) {
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function createPaymentSchema(
  t: ReturnType<typeof useTranslations<"register.step4">>,
) {
  return z.object({
    firstName: z
      .string()
      .min(1, t("nameRequired"))
      .min(2, t("nameMinLength"))
      .max(50, t("nameMaxLength")),
    lastName: z
      .string()
      .min(1, t("surnameRequired"))
      .min(2, t("surnameMinLength"))
      .max(50, t("surnameMaxLength")),
    cardNumber: z
      .string()
      .min(1, t("cardNumberRequired"))
      .regex(/^\d{16}$/, t("cardNumberInvalid")),
    expiry: z
      .string()
      .min(1, t("cardDateRequired"))
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, t("cardDateInvalid")),
    cvc: z
      .string()
      .min(1, t("cardCodeRequired"))
      .regex(/^\d{3,4}$/, t("cardCodeInvalid")),
    couponCode: z.string().optional(),
    contractConsent: z.boolean().refine((value) => value === true, {
      message: t("contractRequired"),
    }),
  });
}

export type PaymentFormValues = z.infer<ReturnType<typeof createPaymentSchema>>;

type PaymentFormProps = {
  draft: RegisterDraft;
  onSuccess: () => void;
  className?: string;
};

/** Payment form — POST /register/4/steps/{id} */
export function PaymentForm({ draft, onSuccess, className }: PaymentFormProps) {
  const t = useTranslations("register.step4");
  const tCommon = useTranslations("common");
  const registerStep4 = useRegisterStep4Mutation();
  const [apiError, setApiError] = useState<string | null>(null);
  const [showCoupon, setShowCoupon] = useState(false);

  const schema = useMemo(() => createPaymentSchema(t), [t]);
  const resolver = useMemo(() => standardSchemaResolver(schema), [schema]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<PaymentFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver,
    defaultValues: {
      firstName: "",
      lastName: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
      couponCode: "",
      contractConsent: false,
    },
  });

  const isLoading = registerStep4.isPending || isSubmitting;
  const isDisabled = isLoading || !isValid;

  const periodLabel =
    draft.planPeriod === "Yearly" ? tCommon("yearly") : tCommon("monthly");
  const planPriceLabel =
    draft.planPrice != null ? formatPrice(draft.planPrice) : "—";

  const onSubmit = async (values: PaymentFormValues) => {
    setApiError(null);

    if (!draft.registrationId || !draft.planId) {
      setApiError(t("checkoutError"));
      return;
    }

    const [month, year] = values.expiry.split("/");

    try {
      await registerStep4.mutateAsync({
        id: draft.registrationId,
        data: {
          card_number: values.cardNumber,
          expiration_month: month,
          expiration_year: `20${year}`,
          cvc: values.cvc,
          cardholder_name: values.firstName.trim(),
          cardholder_surname: values.lastName.trim(),
          coupone_code: values.couponCode?.trim() || undefined,
        },
      });
      onSuccess();
    } catch (error) {
      setApiError(getAuthErrorMessage(error, t("checkoutError")));
    }
  };

  return (
    <div className={cn("flex min-w-2xl flex-col gap-3  items-center justify-center", className)}>

      <p className="text-sm font-medium text-white text-center">{t("cardPlan")}: {periodLabel} {planPriceLabel}</p>



      <form
        id={FORM_ID}
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
        noValidate
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="flex min-w-0 flex-col gap-1.5">
            <Input
              type="text"
              autoComplete="cc-given-name"
              placeholder={t("namePlaceholder")}
              aria-label={t("name")}
              aria-invalid={Boolean(errors.firstName)}
              disabled={isLoading}
              {...register("firstName")}
            />
            {errors.firstName?.message ? (
              <p className="text-sm text-red-500" role="alert">
                {errors.firstName.message}
              </p>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-col gap-1.5">
            <Input
              type="text"
              autoComplete="cc-family-name"
              placeholder={t("surnamePlaceholder")}
              aria-label={t("surname")}
              aria-invalid={Boolean(errors.lastName)}
              disabled={isLoading}
              {...register("lastName")}
            />
            {errors.lastName?.message ? (
              <p className="text-sm text-red-500" role="alert">
                {errors.lastName.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex w-full flex-col gap-1.5">
          <Controller
            name="cardNumber"
            control={control}
            render={({ field }) => (
              <Input
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="0000-0000-0000-0000"
                aria-label={t("cardNumber")}
                aria-invalid={Boolean(errors.cardNumber)}
                disabled={isLoading}
                maxLength={19}
                value={formatCardNumber(field.value ?? "")}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                  field.onChange(digits);
                }}
              />
            )}
          />
          {errors.cardNumber?.message ? (
            <p className="text-sm text-red-500" role="alert">
              {errors.cardNumber.message}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex min-w-0 flex-col gap-1.5">
            <Input
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder={t("cardDatePlaceholder")}
              aria-label={t("cardDate")}
              aria-invalid={Boolean(errors.expiry)}
              disabled={isLoading}
              maxLength={5}
              {...register("expiry", {
                onChange: (e) => {
                  const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
                  const formatted =
                    raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
                  setValue("expiry", formatted, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                },
              })}
            />
            {errors.expiry?.message ? (
              <p className="text-sm text-red-500" role="alert">
                {errors.expiry.message}
              </p>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-col gap-1.5">
            <Input
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder={"***"}
              aria-label={t("cardCode")}
              aria-invalid={Boolean(errors.cvc)}
              disabled={isLoading}
              maxLength={4}
              {...register("cvc", {
                onChange: (e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setValue("cvc", digits, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                },
              })}
            />
            {errors.cvc?.message ? (
              <p className="text-sm text-red-500" role="alert">
                {errors.cvc.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {!showCoupon ? (
            <button
              type="button"
              onClick={() => setShowCoupon(true)}
              className="w-fit text-left text-sm md:text-base underline font-medium  underline-offset-1 transition-colors hover:text-primary"
            >
              {t("haveCoupon")}
            </button>
          ) : null}

          <div
            className={cn(
              "grid transition-all duration-300 ease-out",
              showCoupon
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <div className="pt-0.5">
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder={t("couponeCode")}
                  aria-label={t("couponeCode")}
                  disabled={isLoading || !showCoupon}
                  {...register("couponCode")}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Controller
            name="contractConsent"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={Boolean(field.value)}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={isLoading}
                label={
                  <>
                    <Link
                      href="/on-bilgilendirme-formu"
                      className="text-primary underline-offset-2 hover:underline"
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t("preInformationForm")}
                    </Link>
                    {` ${t("and")} `}
                    <Link
                      href="/mesafeli-satis-sozlesmesi"
                      className="text-primary underline-offset-2 hover:underline"
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t("distanceContract")}
                    </Link>
                    {t("contractAcceptText")}
                  </>
                }
              />
            )}
          />
          {errors.contractConsent?.message ? (
            <p className="text-sm text-red-500" role="alert">
              {errors.contractConsent.message}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5 px-5">
          <p className="text-sm font-medium text-white/90 text-left">
            {t("cardTypeNotAllowedMessage")}
          </p>
        </div>
        <div className="flex flex-col gap-1.5 px-5">
          <p className="text-sm font-medium text-white/90 text-left">
            {t("expireMessage")}
          </p>
        </div>
        <div className=" gap-1.5 px-5">
          <p className="text-sm font-medium text-white/90 text-left">
            {t("cancelSubscription")}

            <Link href="/iptal-et" className="text-sm font-medium text-primary underline-offset-2 hover:underline">{' '}{t("distanceContract")}  </Link>
            {' '} {t("cancelSubscriptionMessage")}</p>
        </div>

        {apiError ? (
          <p className="text-sm text-red-500" role="alert">
            {apiError}
          </p>
        ) : null}

        <div className="h-8" />

        <StickyContinueButton
          formId={FORM_ID}
          label={t("payAndDiscoverNow")}
          loadingLabel={t("processing")}
          loading={isLoading}
          disabled={isDisabled}
        />
      </form>
    </div>
  );
}
