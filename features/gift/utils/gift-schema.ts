import type { useTranslations } from "next-intl";
import { z } from "zod";

import { digitsOnly } from "@/shared/utils/card";

import { isValidPhoneNumber } from "./phone";

export function createGiftSchema(
  t: ReturnType<typeof useTranslations<"giveGift">>,
) {
  return z
    .object({
      period: z.enum(["Monthly", "Yearly"]),
      senderName: z
        .string()
        .trim()
        .min(1, t("senderNameRequired"))
        .min(2, t("nameMinLength"))
        .max(50, t("nameMaxLength")),
      senderSurname: z
        .string()
        .trim()
        .min(1, t("senderSurnameRequired"))
        .min(2, t("nameMinLength"))
        .max(50, t("nameMaxLength")),
      senderEmail: z
        .string()
        .trim()
        .min(1, t("senderEmailRequired"))
        .email(t("emailInvalid")),
      countryCode: z.number(),
      phoneNumber: z.string().min(1, t("senderPhoneRequired")),
      receiverName: z
        .string()
        .trim()
        .min(1, t("receiverNameRequired"))
        .min(2, t("nameMinLength"))
        .max(50, t("nameMaxLength")),
      receiverSurname: z
        .string()
        .trim()
        .min(1, t("receiverSurnameRequired"))
        .min(2, t("nameMinLength"))
        .max(50, t("nameMaxLength")),
      receiverEmail: z
        .string()
        .trim()
        .min(1, t("receiverEmailRequired"))
        .email(t("emailInvalid")),
      giftNote: z
        .string()
        .trim()
        .min(1, t("giftNoteRequired"))
        .max(280, t("giftNoteMaxLength")),
      isSchedule: z.boolean(),
      sendDate: z.string(),
      sendTime: z.string(),
      firstName: z
        .string()
        .trim()
        .min(1, t("cardNameRequired"))
        .min(2, t("nameMinLength"))
        .max(50, t("nameMaxLength")),
      lastName: z
        .string()
        .trim()
        .min(1, t("cardSurnameRequired"))
        .min(2, t("nameMinLength"))
        .max(50, t("nameMaxLength")),
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
    })
    .superRefine((values, ctx) => {
      if (!isValidPhoneNumber(values.phoneNumber, values.countryCode)) {
        ctx.addIssue({
          code: "custom",
          path: ["phoneNumber"],
          message: t("senderPhoneInvalid"),
        });
      }

      if (values.isSchedule) {
        if (!values.sendDate) {
          ctx.addIssue({
            code: "custom",
            path: ["sendDate"],
            message: t("sendDateRequired"),
          });
        }
        if (!values.sendTime) {
          ctx.addIssue({
            code: "custom",
            path: ["sendTime"],
            message: t("sendTimeRequired"),
          });
        }
        if (values.sendDate && values.sendTime) {
          const scheduled = new Date(`${values.sendDate}T${values.sendTime}`);
          if (Number.isNaN(scheduled.getTime()) || scheduled.getTime() <= Date.now()) {
            ctx.addIssue({
              code: "custom",
              path: ["sendDate"],
              message: t("sendDateInvalid"),
            });
          }
        }
      }
    });
}

export type GiftFormValues = z.infer<ReturnType<typeof createGiftSchema>>;

export const GIFT_STEP1_FIELDS = [
  "senderName",
  "senderSurname",
  "senderEmail",
  "countryCode",
  "phoneNumber",
  "receiverName",
  "receiverSurname",
  "receiverEmail",
  "giftNote",
  "isSchedule",
  "sendDate",
  "sendTime",
  "period",
] as const satisfies readonly (keyof GiftFormValues)[];

export function sanitizeCardNumber(value: string): string {
  return digitsOnly(value).slice(0, 16);
}
