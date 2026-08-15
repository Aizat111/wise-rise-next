import { cn } from "@/lib/utils";

import type { BusinessFeaturesProps } from "../types";
import { BusinessFeaturesPanel } from "./BusinessFeaturesPanel";

export function BusinessFeatures({
  eyebrow,
  title,
  tabs,
  features,
  defaultType = 1,
  headingId = "business-features-heading",
  className,
}: BusinessFeaturesProps) {
  return (
    <section
      className={cn("my-8 sm:my-10 lg:my-12", className)}
      aria-labelledby={headingId}
    >
      <header className="mb-6 text-center sm:mb-8 lg:mb-10">
        <p className="my-2 text-sm font-semibold uppercase text-primary sm:text-lg">
          {eyebrow}
        </p>
        <h2
          id={headingId}
          className="text-xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl"
        >
          {title}
        </h2>
      </header>

      <BusinessFeaturesPanel
        tabs={tabs}
        features={features}
        defaultType={defaultType}
        labelledBy={headingId}
      />
    </section>
  );
}
