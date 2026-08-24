"use client";

import type { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Radio } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input";

import type { GiftFormValues } from "../utils/gift-schema";
import { todayInputValue } from "../utils/format-gift-date";
import { GiftField } from "./GiftField";

type GiftScheduleFieldsProps = {
  register: UseFormRegister<GiftFormValues>;
  watch: UseFormWatch<GiftFormValues>;
  setValue: UseFormSetValue<GiftFormValues>;
  dateError?: string;
  timeError?: string;
};

export function GiftScheduleFields({
  register,
  watch,
  setValue,
  dateError,
  timeError,
}: GiftScheduleFieldsProps) {
  const t = useTranslations("giveGift");
  const isSchedule = watch("isSchedule");

  return (
    <fieldset className="flex min-w-0 flex-col gap-3">
      <legend className="sr-only">{t("scheduleLegend")}</legend>
      <div className="flex justify-center gap-3">
        <Radio
          checked={!isSchedule}
          onChange={() => {
            setValue("isSchedule", false, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          label={t("sendNow")}
        />

        <Radio
          checked={isSchedule}
          onChange={() => {
            setValue("isSchedule", true, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          label={t("scheduleSend")}
        />
      </div>
      {isSchedule ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <GiftField id="sendDate" label={t("sendDate")} error={dateError}>
            <Input
              id="sendDate"
              type="date"
              min={todayInputValue()}
              aria-invalid={Boolean(dateError)}
              aria-describedby={dateError ? "sendDate-error" : undefined}
              {...register("sendDate")}
            />
          </GiftField>
          <GiftField id="sendTime" label={t("sendTime")} error={timeError}>
            <Input
              id="sendTime"
              type="time"
              aria-invalid={Boolean(timeError)}
              aria-describedby={timeError ? "sendTime-error" : undefined}
              {...register("sendTime")}
            />
          </GiftField>
        </div>
      ) : null}
    </fieldset>
  );
}
