"use client";

import { cn } from "@/lib/utils";
import Image from "@/shared/ui/Images/Image";

import { BaseCard } from "./BaseCard";
import { EMPTY_CERTIFICATE_IMAGE } from "./constants";
import type { CertificateCardProps } from "./types";

/**
 * Certificate card: empty-certificate artwork, teacher logo overlay, and a surface info bar below.
 */
export function CertificateCard({
  image = EMPTY_CERTIFICATE_IMAGE,
  teacherLogo,
  courseName,
  categoryName,
  onClick,
  className,
}: CertificateCardProps) {
  return (
    <BaseCard
      onClick={onClick}
      aria-label={courseName}
      className={cn("aspect-auto h-auto", className)}
      contentClassName="static inset-auto flex flex-col"
    >
      <div className="relative w-full">
        <Image
          src={image || EMPTY_CERTIFICATE_IMAGE}
          alt={courseName}
          width={400}
          height={600}
          sizes="(max-width: 768px) 50vw, 20vw"
          className="h-auto w-full"
        />

        {teacherLogo ? (
          <div className="absolute inset-x-0 top-[10%] z-10 flex justify-center px-5">
            <div className="relative h-12 w-[68%] sm:h-14">
              <Image
                src={teacherLogo}
                alt=""
                fill
                sizes="(max-width: 768px) 40vw, 14vw"
                className="object-contain object-center"
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="bg-surface px-2.5 py-2 sm:px-3 sm:py-2.5">
        <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-white sm:text-sm">
          {courseName}
        </h3>
        {categoryName ? (
          <p className="mt-0.5 truncate text-[11px] text-white/60 sm:text-xs">
            {categoryName}
          </p>
        ) : null}
      </div>
    </BaseCard>
  );
}
