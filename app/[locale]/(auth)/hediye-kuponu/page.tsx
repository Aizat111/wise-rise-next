import { redirect } from "@/core/i18n/navigation";
import { GIFT_REDEEM_ROUTE } from "@/features/gift/constants";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HediyeKuponuRedirect({ params }: Props) {
  const { locale } = await params;
  redirect({ href: GIFT_REDEEM_ROUTE, locale });
}
