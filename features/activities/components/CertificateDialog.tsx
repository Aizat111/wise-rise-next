"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { ENDPOINTS } from "@/core/api/endpoints";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { certificateService } from "@/features/activities/api/certificate.service";
import { useCertificateDetailQuery } from "@/features/activities/api/certificate.queries";
import {
  getCertificateImageUrl,
  getCertificatePdfUrl,
  getCertificateShareUrl,
  isPdfBlob,
  triggerBlobDownload,
} from "@/features/activities/api/certificate.utils";
import type { CertificateDialogSelection } from "@/features/activities/types";
import { cn } from "@/lib/utils";
import { notify } from "@/shared/components/notify";
import {
  CertificateCard,
  EMPTY_CERTIFICATE_IMAGE,
} from "@/shared/ui/cards";
import { ShareMenu } from "@/shared/ui/share";
import { useAppSelector } from "@/store/hooks";
import Image from "@/shared/ui/Images/Image";

type CertificateDialogProps = {
  selection: CertificateDialogSelection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[\\/:*?"<>|]+/g, " ").trim();
  return cleaned || "certificate";
}

export function CertificateDialog({
  selection,
  open,
  onOpenChange,
}: CertificateDialogProps) {
  const t = useTranslations("activitiesPage");
  const [downloading, setDownloading] = useState(false);
  const activeProfile = useAppSelector((state) => state.profile.activeProfile);
  const profileId = activeProfile?.id;

  const { data, isLoading, isError, isFetching } = useCertificateDetailQuery(
    profileId,
    selection?.certificateId,
    open && selection != null,
  );


  useEffect(() => {
    if (!open || !isError) return;
    notify.error(t("certificateDetailError"), {
      id: "certificate-detail-error",
    });
  }, [isError, open, t]);

  const courseName = data?.classroom?.name ?? data?.name ?? selection?.courseName ?? "";
  const certificateImage =
    (data ? getCertificateImageUrl(data) : null) ?? EMPTY_CERTIFICATE_IMAGE;

  const shareUrl = useMemo(() => {
    if (!data) return "";
    return getCertificateShareUrl(data) ?? "";
  }, [data]);

  const handleDownload = () => {
    if (!selection || !data) return;

    const pdfUrl = getCertificatePdfUrl(data);

    if (!pdfUrl) {
      notify.error(t("pdfDownloadError"));
      return;
    }

    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const showLoading = isLoading || (isFetching && !data);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "gap-0 overflow-hidden p-0 sm:max-w-lg",
          "bg-zinc-950 text-white ring-white/10",
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{courseName || t("certificateDialogTitle")}</DialogTitle>
          <DialogDescription>{t("certificateDialogTitle")}</DialogDescription>
        </DialogHeader>

        <div className="px-5 pt-12 sm:px-6">
          {showLoading ? (
            <div
              className="w-full overflow-hidden rounded-xl"
              aria-busy
              aria-label={t("loading")}
            >
              <div className="aspect-2/3 w-full animate-pulse bg-white/10" />
              <div className="h-14 bg-surface" />
            </div>
          ) : (
            <Image src={certificateImage} alt={courseName} width={800} height={1200} />

          )}
        </div>

        <DialogFooter className="flex flex-row flex-wrap justify-end gap-2 p-5 sm:p-6">
          <Button
            type="button"
            variant="outline"
            disabled={showLoading || downloading || isError}
            onClick={() => {
              void handleDownload();
            }}
            className="h-auto border-white/20 bg-transparent px-4 py-2.5 text-sm text-white hover:bg-white/10 hover:text-white"
          >
            {downloading ? t("loading") : t("downloadPdf")}
          </Button>

          <ShareMenu
            shareUrl={shareUrl}
            shareTitle={courseName}
            disabled={showLoading || !shareUrl}
            copiedMessage={t("linkCopied")}
            copyErrorMessage={t("linkCopyError")}
            labels={{
              trigger: t("share"),
              linkedin: t("shareLinkedin"),
              whatsapp: t("shareWhatsapp"),
              facebook: t("shareFacebook"),
              x: t("shareTwitter"),
              copy: t("copy"),
            }}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
