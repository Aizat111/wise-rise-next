"use client";

import Image from "@/shared/ui/Images/Image";
import { Link } from "@/core/i18n/navigation";

type HeaderLogoProps = {
  className?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
};

export function HeaderLogo({
  className,
  width = 180,
  height = 50,
  onClick,
}: HeaderLogoProps) {
  return (
    <Link href="/" className={className ?? "shrink-0"} onClick={onClick}>
      <Image
        src="/logo/wise&rise.png"
        alt="Wise & Rise"
        width={width}
        height={height}
        priority
      />
    </Link>
  );
}
