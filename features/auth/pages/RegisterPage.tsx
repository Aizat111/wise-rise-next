import { redirect } from "@/core/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

/** Legacy entry — redirects to the multi-step /kayit-ol flow */
export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  redirect({ href: "/kayit-ol", locale });
}
