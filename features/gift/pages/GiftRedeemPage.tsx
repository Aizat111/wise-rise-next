"use client";

import { useTranslations } from "next-intl";

import { GiftRedeemForm } from "../components/GiftRedeemForm";
import { GiftRedeemLayout } from "../components/GiftRedeemLayout";

export function GiftRedeemPage() {
  const t = useTranslations("useGift");

  return (
    <GiftRedeemLayout backgroundAlt={t("backgroundAlt")}>
      <GiftRedeemForm />
    </GiftRedeemLayout>
  );
}
