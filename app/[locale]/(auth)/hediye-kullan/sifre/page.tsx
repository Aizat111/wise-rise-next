import { redirect } from "@/core/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GiftRegisterPasswordRedirect({ params }: Props) {
  const { locale } = await params;
  redirect({ href: "/kayit-ol/sifre-olustur", locale });
}
