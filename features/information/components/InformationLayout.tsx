import { cn } from "@/lib/utils";

import type { InformationLayoutProps } from "../types";
import { InformationContainer } from "./InformationContainer";
import { InformationHero } from "./InformationHero";

/**
 * Shared chrome for all footer / legal information pages.
 * Site Header & Footer come from `app/[locale]/layout.tsx`.
 */
export async function InformationLayout({
  title,
  breadcrumbCurrent,
  homeLabel,
  children,
  className,
  contentClassName,
}: InformationLayoutProps) {
  return (
    <div className={cn("bg-background text-foreground", className)}>
      <InformationHero
        title={title}
        breadcrumbCurrent={breadcrumbCurrent ?? title}
        homeLabel={homeLabel}
      />
      <InformationContainer
        as="section"
        className={cn("py-8 sm:py-10 lg:py-14", contentClassName)}
      >
        {children}
      </InformationContainer>
    </div>
  );
}
