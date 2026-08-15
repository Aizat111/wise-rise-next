import { getTranslations } from "next-intl/server";

import { Link } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";

import type { InformationBreadcrumbProps } from "../types";

export async function InformationBreadcrumb({
  current,
  homeLabel,
  className,
}: InformationBreadcrumbProps) {
  const t = await getTranslations("information");
  const home = homeLabel ?? t("home");

  return (
    <nav aria-label="Breadcrumb" className={cn("mt-3 sm:mt-4", className)}>
      <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-white/70 sm:justify-start sm:text-base">
        <li>
          <Link
            href="/"
            className="text-base font-semibold transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            {home}
          </Link>
        </li>
        <li aria-hidden="true" className="select-none text-white/50">
          /
        </li>
        <li>
          <span aria-current="page" className="text-primary">
            {current}
          </span>
        </li>
      </ol>
    </nav>
  );
}
