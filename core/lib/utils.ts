import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { notify } from "./notify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatOrdinal(value: number): string {
  const abs = Math.abs(Math.trunc(value));
  const mod100 = abs % 100;
  if (mod100 >= 11 && mod100 <= 13) {
    return `${abs}th`;
  }
  switch (abs % 10) {
    case 1:
      return `${abs}st`;
    case 2:
      return `${abs}nd`;
    case 3:
      return `${abs}rd`;
    default:
      return `${abs}th`;
  }
}

// Common card styles
export const cardStyles = {
  base: "bg-toshi-secondary border border-toshi-dark-60 rounded-lg p-6",
  hover:
    "hover:bg-toshi-accent hover:border-toshi-primary transition-all duration-200",
  interactive:
    "cursor-pointer hover:scale-105 transition-transform duration-200",
};

export const formatCurrency = (value: number) => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const handleShare = async (
  text: string,
  description: string,
  url: string,
  imageUrl?: string,
) => {
  if (!navigator.share) {
    notify("error", "error.error", "error.error");
    return;
  }

  try {
    if (imageUrl) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const ext = blob.type.split("/")[1] || "jpg";
      const file = new File([blob], `share.${ext}`, { type: blob.type });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: text,
          text: description,
          files: [file],
        });
        return;
      }
    }

    await navigator.share({ title: text, text: description, url });
  } catch (err) {
    console.log("Share iptal edildi veya hata:", err);
  }
};
