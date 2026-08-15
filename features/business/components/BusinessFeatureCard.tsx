import Image from "@/shared/ui/Images/Image";

import { BUSINESS_FEATURE_ICON_SIZE } from "../constants";
import type { BusinessFeatureCardProps } from "../types";

export function BusinessFeatureCard({ feature }: BusinessFeatureCardProps) {
  return (
    <article className="flex flex-col items-start text-left">
      <Image
        src={feature.img}
        alt=""
        width={BUSINESS_FEATURE_ICON_SIZE}
        height={BUSINESS_FEATURE_ICON_SIZE}
        className="size-10 object-contain"
        aria-hidden
      />
      <h3 className="mt-4 text-base font-semibold tracking-tight text-white sm:text-lg">
        {feature.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/65 sm:text-base">
        {feature.text}
      </p>
    </article>
  );
}
