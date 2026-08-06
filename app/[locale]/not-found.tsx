import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/core/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  const tHome = useTranslations("home");

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-5 text-center">
      <h1 className="font-heading text-3xl font-semibold text-white">
        {t("title")}
      </h1>
      <p className="text-sm text-white/65">{t("description")}</p>
      <Button
        className="bg-primary text-white hover:bg-primary/90"
        render={<Link href="/" />}
      >
        {tHome("home")}
      </Button>
    </div>
  );
}
