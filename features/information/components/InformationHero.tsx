import { cn } from "@/lib/utils";

import { INFORMATION_HERO_BG } from "../constants";
import type { InformationHeroProps } from "../types";
import { InformationBreadcrumb } from "./InformationBreadcrumb";
import { InformationContainer } from "./InformationContainer";
import { Separator } from "@/components/ui/separator";

export async function InformationHero({
  title,
  breadcrumbCurrent,
  homeLabel,
  className,
}: InformationHeroProps) {
  return (
    <header
      className={cn("relative isolate w-full", className)}
      style={{ backgroundColor: INFORMATION_HERO_BG }}
    >
      <div className="flex min-h-[160px] w-full items-center sm:min-h-[200px] lg:min-h-[240px]">
        <InformationContainer className="w-full py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl xl:text-5xl">
              {title}
            </h1>
            <div className="mt-3 mb-1 h-1.5 w-40 bg-primary/80 md:hidden" />
            <InformationBreadcrumb
              current={breadcrumbCurrent}
              homeLabel={homeLabel}
            />
          </div>
        </InformationContainer>
      </div>
    </header>
  );
}
