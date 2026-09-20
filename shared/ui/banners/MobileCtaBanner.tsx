"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "@/core/i18n/navigation";
import { isAuthFlowPath } from "@/features/auth/lib/is-auth-flow-path";
import { useDisplayPlansQuery } from "@/features/plans/api/plan.queries";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";

import { PLAN_LIST_PRICES } from "./constants";
import { toSafePrice } from "./format-plan-price";
import { GuestRegisterCta } from "./GuestCta";

const BANNER_PAD_CLASS =
  "px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]";

function formatLira(price: number, locale: string) {
  const intlLocale = locale === "az" ? "az-AZ" : "tr-TR";
  return `${new Intl.NumberFormat(intlLocale, {
    maximumFractionDigits: 0,
  }).format(price)}₺`;
}

function MobileCtaCopy() {
  const t = useTranslations("banners.mobileCta");
  const locale = useLocale();
  const { data, isLoading, isError } = useDisplayPlansQuery();

  const listPrice = PLAN_LIST_PRICES.monthly;
  const salePrice = isError ? null : toSafePrice(data?.monthly?.price);
  const hasSalePrice = salePrice != null && salePrice !== listPrice;
  const displayedPrice = salePrice ?? listPrice;

  if (isLoading) {
    return <Skeleton className="h-8 w-full max-w-56 bg-white/10" aria-hidden />;
  }

  return (
    <p className="min-w-0 flex-1 text-left text-lg font-semibold leading-snug text-white/85">
      {t.rich("copy", {
        listPrice: () =>
          hasSalePrice ? (
            <span className="mr-1 font-medium text-white/45 line-through">
              {formatLira(listPrice, locale)}
            </span>
          ) : null,
        salePrice: () => (
          <span className="font-semibold text-white">
            {formatLira(displayedPrice, locale)}
          </span>
        ),
      })}
    </p>
  );
}

function MobileCtaBannerView() {
  const t = useTranslations("banners.mobileCta");

  return (
    <>
      <div className={cn("md:hidden", BANNER_PAD_CLASS)} aria-hidden>
        <div className="h-10" />
      </div>

      <aside
        className={cn(
          "fixed right-0 bottom-0 left-0 z-40 bg-black md:hidden",
          "border-t border-white/10 shadow-[0_-12px_32px_rgba(0,0,0,0.45)]",
          BANNER_PAD_CLASS,
        )}
        aria-label={t("cta")}
      >
        <div className="flex items-center gap-3">
          <MobileCtaCopy />
          <GuestRegisterCta
            label={t("cta")}
            className="h-10 px-4 text-sm sm:h-10 sm:px-4 sm:text-xs"
          />
        </div>
      </aside>
    </>
  );
}

export function MobileCtaBanner() {
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const pathname = usePathname();
  const isAuthPage = isAuthFlowPath(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shouldShow = mounted && !isAuthenticated && !isAuthPage;

  if (!shouldShow) return null;

  return <MobileCtaBannerView />;
}
