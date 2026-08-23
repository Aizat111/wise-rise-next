"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";

type WeTheLivingBannerCtaProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function WeTheLivingBannerCta({
  href,
  children,
  className,
}: WeTheLivingBannerCtaProps) {
  return (
    <Button
      nativeButton={false}
      render={<Link href={href} />}
      className={cn(
        "h-11 px-5 text-sm font-bold tracking-wide uppercase text-primary-foreground",
        "transition-all duration-200 hover:bg-primary/80",
        "focus-visible:ring-2 focus-visible:ring-primary/50",
        "sm:h-12 sm:px-7 sm:text-base",
        className,
      )}
    >
      {children}
    </Button>
  );
}
