"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import type {
  DisplayMembershipPlans,
  MembershipPlan,
  PlanPeriod,
} from "@/core/types/plan.types";
import { getAuthErrorMessage } from "@/features/auth/api/auth.mutations";
import { cn } from "@/lib/utils";
import { notify } from "@/shared/components/notify";
import { digitsOnly, parseExpiry } from "@/shared/utils/card";

import { useBuyGiftMutation } from "../api/gift.mutations";
import {
  DEFAULT_COUNTRY_CODE,
  GIFT_FORM_ID,
  installmentForPeriod,
} from "../constants";
import {
  combineScheduleDateTime,
  formatGiftDateTime,
} from "../utils/format-gift-date";
import {
  createGiftSchema,
  GIFT_STEP1_FIELDS,
  type GiftFormValues,
} from "../utils/gift-schema";
import { normalizePhoneNumber } from "../utils/phone";
import { GiftCardPreview } from "./GiftCardPreview";
import { GiftInformationForm } from "./GiftInformationForm";
import { GiftPaymentStep } from "./GiftPaymentStep";
import { GiftPlanCard } from "./GiftPlanCard";

type GiftPageClientProps = {
  plans: DisplayMembershipPlans;
};

export function GiftPageClient({ plans }: GiftPageClientProps) {
  const t = useTranslations("giveGift");
  const tCommon = useTranslations("common");
  const reduceMotion = useReducedMotion();
  const buyGift = useBuyGiftMutation();
  const [step, setStep] = useState<1 | 2>(1);
  const [apiError, setApiError] = useState<string | null>(null);

  const defaultPeriod: PlanPeriod = plans.yearly
    ? "Yearly"
    : plans.monthly
      ? "Monthly"
      : "Yearly";

  const schema = useMemo(() => createGiftSchema(t), [t]);
  const resolver = useMemo(() => standardSchemaResolver(schema), [schema]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<GiftFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver,
    defaultValues: {
      period: defaultPeriod,
      senderName: "",
      senderSurname: "",
      senderEmail: "",
      countryCode: DEFAULT_COUNTRY_CODE,
      phoneNumber: "",
      receiverName: "",
      receiverSurname: "",
      receiverEmail: "",
      giftNote: "",
      isSchedule: false,
      sendDate: "",
      sendTime: "",
      firstName: "",
      lastName: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
      couponCode: "",
      contractConsent: false,
    },
  });

  const period = watch("period");
  const senderName = watch("senderName");
  const senderSurname = watch("senderSurname");
  const giftNote = watch("giftNote");

  const selectedPlan: MembershipPlan | null =
    period === "Yearly" ? plans.yearly : plans.monthly;

  const isLoading = isSubmitting || buyGift.isPending;

  const handleContinue = async () => {
    const valid = await trigger([...GIFT_STEP1_FIELDS]);
    if (!valid) return;
    if (!selectedPlan) {
      notify.error(t("planUnavailable"));
      return;
    }
    setApiError(null);
    setStep(2);
  };

  const onPay = handleSubmit(async (values) => {
    if (isLoading || !selectedPlan) return;

    setApiError(null);
    const { month, year } = parseExpiry(values.expiry);
    const date = values.isSchedule
      ? combineScheduleDateTime(values.sendDate, values.sendTime)
      : formatGiftDateTime(new Date());

    try {
      await buyGift.mutateAsync({
        card_number: digitsOnly(values.cardNumber),
        cvc: values.cvc,
        expiration_month: month,
        expiration_year: year,
        cardholder_name: values.firstName.trim(),
        cardholder_surname: values.lastName.trim(),
        sender_name: values.senderName.trim(),
        sender_surname: values.senderSurname.trim(),
        sender_email: values.senderEmail.trim(),
        country_code: values.countryCode,
        phone_number: normalizePhoneNumber(values.phoneNumber),
        receiver_name: values.receiverName.trim(),
        receiver_surname: values.receiverSurname.trim(),
        receiver_email: values.receiverEmail.trim(),
        gift_note: values.giftNote.trim(),
        is_schedule: values.isSchedule,
        date,
        plan_id: selectedPlan.id,
        installment: installmentForPeriod(selectedPlan.period),
        coupon_code: values.couponCode?.trim() ?? "",
        recaptcha_token: null,
      });

      notify.success(t("giftSendSuccess"));
      const currentPeriod = getValues("period");
      reset({
        period: currentPeriod,
        senderName: "",
        senderSurname: "",
        senderEmail: "",
        countryCode: DEFAULT_COUNTRY_CODE,
        phoneNumber: "",
        receiverName: "",
        receiverSurname: "",
        receiverEmail: "",
        giftNote: "",
        isSchedule: false,
        sendDate: "",
        sendTime: "",
        firstName: "",
        lastName: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
        couponCode: "",
        contractConsent: false,
      });
      setStep(1);
    } catch (error) {
      const message = getAuthErrorMessage(error, t("payError"));
      setApiError(message);
      notify.error(message);
    }
  });

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as const };

  return (
    <form
      id={GIFT_FORM_ID}
      onSubmit={onPay}
      noValidate
      className="flex w-full min-w-0 flex-col gap-8 overflow-x-hidden"
    >
      <GiftPlanCard
        plans={plans}
        selectedPeriod={period}
        onPeriodChange={(next) =>
          setValue("period", next, { shouldDirty: true, shouldValidate: true })
        }
      />

      <AnimatePresence mode="wait" initial={false}>
        {step === 1 ? (
          <motion.div
            key="gift-step-1"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={transition}
            className="grid min-w-0 grid-cols-1 gap-8 md:grid-cols-2 md:items-start"
          >
            <GiftCardPreview
              note={giftNote}
              senderName={senderName}
              senderSurname={senderSurname}
            />
            <div className="flex min-w-0 flex-col gap-6">
              <GiftInformationForm
                register={register}
                watch={watch}
                setValue={setValue}
                errors={errors}
              />
              <Button
                type="button"
                nativeButton
                disabled={isLoading || !selectedPlan}
                onClick={() => void handleContinue()}
                className="h-11 w-full text-sm font-semibold sm:h-12 sm:text-base"
              >
                {t("continue")}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="gift-step-2"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={transition}
            className="flex min-w-0 flex-col gap-6"
          >
            {selectedPlan ? (
              <GiftPaymentStep
                selectedPlan={selectedPlan}
                register={register}
                control={control}
                setValue={setValue}
                watch={watch}
                errors={errors}
                disabled={isLoading}
                apiError={apiError}
              />
            ) : null}

            <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                nativeButton
                variant="outline"
                disabled={isLoading}
                onClick={() => {
                  setApiError(null);
                  setStep(1);
                }}
                className={cn(
                  "h-11 w-full text-sm font-semibold sm:h-12 sm:flex-1 sm:text-base",
                )}
              >
                {tCommon("back")}
              </Button>
              <Button
                type="submit"
                nativeButton
                disabled={isLoading || !selectedPlan}
                className="h-11 w-full text-sm font-semibold sm:h-12 sm:flex-1 sm:text-base"
              >
                {isLoading ? t("processing") : t("pay")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
