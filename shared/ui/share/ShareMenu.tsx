"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notify } from "@/shared/components/notify";
import {
  buildFacebookShareUrl,
  buildLinkedInShareUrl,
  buildWhatsAppShareUrl,
  buildXShareUrl,
  openShareWindow,
} from "@/shared/utils/share";

import {
  FacebookShareIcon,
  LinkedInShareIcon,
  WhatsAppShareIcon,
  XShareIcon,
} from "./icons";

export type ShareMenuLabels = {
  trigger: string;
  linkedin: string;
  whatsapp: string;
  facebook: string;
  x: string;
  copy: string;
};

export type ShareMenuProps = {
  shareUrl: string;
  shareTitle?: string;
  labels: ShareMenuLabels;
  copiedMessage: string;
  copyErrorMessage: string;
  disabled?: boolean;
};

export function ShareMenu({
  shareUrl,
  shareTitle = "",
  labels,
  copiedMessage,
  copyErrorMessage,
  disabled = false,
}: ShareMenuProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      notify.success(copiedMessage);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      notify.error(copyErrorMessage);
    }
  };

  const platforms = [
    {
      id: "linkedin",
      label: labels.linkedin,
      href: buildLinkedInShareUrl(shareUrl),
      Icon: LinkedInShareIcon,
    },
    {
      id: "whatsapp",
      label: labels.whatsapp,
      href: buildWhatsAppShareUrl(shareUrl),
      Icon: WhatsAppShareIcon,
    },
    {
      id: "facebook",
      label: labels.facebook,
      href: buildFacebookShareUrl(shareUrl),
      Icon: FacebookShareIcon,
    },
    {
      id: "x",
      label: labels.x,
      href: buildXShareUrl(shareUrl, shareTitle),
      Icon: XShareIcon,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled || !shareUrl}
            className="h-auto gap-2 border-white/20 bg-transparent px-4 py-2.5 text-sm text-white hover:bg-white/10 hover:text-white"
          />
        }
      >
        <Share2 className="size-4" aria-hidden />
        {labels.trigger}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="end"
        className="min-w-48 border-white/10 bg-zinc-900 text-white"
      >
        {platforms.map((platform) => {
          const Icon = platform.Icon;
          return (
            <DropdownMenuItem
              key={platform.id}
              className="cursor-pointer focus:bg-white/10 focus:text-white"
              onClick={() => openShareWindow(platform.href)}
            >
              <Icon className="size-4" aria-hidden />
              {platform.label}
            </DropdownMenuItem>
          );
        })}
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
          {labels.copy}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
