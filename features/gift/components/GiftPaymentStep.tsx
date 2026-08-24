"use client";

import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useTranslations } from "next-intl";

import type { MembershipPlan } from "@/core/types/plan.types";
import { LivePaymentCard } from "@/shared/ui/payment/LivePaymentCard";

import type { GiftFormValues } from "../utils/gift-schema";
import { GiftPaymentForm } from "./GiftPaymentForm";

type GiftPaymentStepProps = {
  selectedPlan: MembershipPlan;
  register: UseFormRegister<GiftFormValues>;
  control: Control<GiftFormValues>;
  setValue: UseFormSetValue<GiftFormValues>;
  watch: UseFormWatch<GiftFormValues>;
  errors: FieldErrors<GiftFormValues>;
  disabled?: boolean;
  apiError?: string | null;
};

export function GiftPaymentStep({
  selectedPlan,
  register,
  control,
  setValue,
  watch,
  errors,
  disabled,
  apiError,
}: GiftPaymentStepProps) {
  const t = useTranslations("giveGift");
  const cardNumber = watch("cardNumber");
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const expiry = watch("expiry");
  const cvc = watch("cvc");

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
      <div className="min-w-0">
        <LivePaymentCard
          values={{ cardNumber, firstName, lastName, expiry, cvc }}
          ariaLabel={t("paymentCardAlt")}
        />
      </div>
      <GiftPaymentForm
        selectedPlan={selectedPlan}
        register={register}
        control={control}
        setValue={setValue}
        watch={watch}
        errors={errors}
        disabled={disabled}
        apiError={apiError}
      />
    </div>
  );
}
