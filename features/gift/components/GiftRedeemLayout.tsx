import type { ReactNode } from "react";

import Image from "@/shared/ui/Images/Image";

import { GIFT_REDEEM_BACKGROUND } from "../constants";

type GiftRedeemLayoutProps = {
  children: ReactNode;
  backgroundAlt: string;
};

export function GiftRedeemLayout({
  children,
  backgroundAlt,
}: GiftRedeemLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Image
        src={GIFT_REDEEM_BACKGROUND}
        className="h-full w-full object-cover object-center"
        fill
        priority
        alt={backgroundAlt}
      />
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-r
          from-black from-0%
          via-black via-[100%]
          to-transparent to-100%
          md:via-black/90 md:via-[24%]
          md:to-transparent md:to-[48%]
        "
      />
      <div className="relative z-10 flex min-h-screen w-full items-start justify-center px-5 py-50 sm:px-8 md:w-[38%] md:py-12 md:items-center md:justify-start md:px-10 lg:px-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
