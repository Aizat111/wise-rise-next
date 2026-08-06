"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notify } from "@/shared/components/notify/store/notify.store";

import type { ShareDropdownProps } from "../types";

type SharePlatform = {
  id: string;
  labelKey:
    | "shareWhatsapp"
    | "shareFacebook"
    | "shareTwitter"
    | "shareLinkedin";
  href: (url: string, title: string) => string;
};

const SHARE_PLATFORMS: SharePlatform[] = [
  {
    id: "whatsapp",
    labelKey: "shareWhatsapp",
    href: (url) => `https://wa.me/?text=${encodeURIComponent(url)}`,
  },
  {
    id: "facebook",
    labelKey: "shareFacebook",
    href: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "twitter",
    labelKey: "shareTwitter",
    href: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: "linkedin",
    labelKey: "shareLinkedin",
    href: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
];

export function ShareDropdown({
  shareUrl,
  shareTitle = "",
}: ShareDropdownProps) {
  const t = useTranslations("course");
  const tLessons = useTranslations("lessonsDetail");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      notify.success(t("linkCopied"));
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      notify.error(t("linkCopyError"));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-auto gap-2 border-white/20 bg-transparent px-4 py-2.5 text-sm text-white hover:bg-white/10 hover:text-white"
          />
        }
      >
        <Share2 className="size-4" aria-hidden />
        {tLessons("share")}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-48 border-white/10 bg-zinc-900 text-white"
      >
        {SHARE_PLATFORMS.map((platform) => (
          <DropdownMenuItem
            key={platform.id}
            className="cursor-pointer focus:bg-white/10 focus:text-white"
            onClick={() => {
              window.open(
                platform.href(shareUrl, shareTitle),
                "_blank",
                "noopener,noreferrer",
              );
            }}
          >
            {t(platform.labelKey)}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className="cursor-pointer focus:bg-white/10 focus:text-white"
          onClick={() => {
            void handleCopy();
          }}
        >
          {copied ? (
            <Check className="size-4 text-emerald-400" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          {t("copyLink")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
