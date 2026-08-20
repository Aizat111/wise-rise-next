"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import {
  CertificateCard,
  CertificateCardSkeleton,
} from "@/shared/ui/cards";
import {
  CERTIFICATE_SKELETON_COUNT,
  CERTIFICATE_SLIDER_ITEM_WIDTH_CLASS,
  ContentSlider,
} from "@/shared/ui/sliders";
import { notify } from "@/shared/components/notify";

import { useMeQuery } from "@/features/auth/api/auth.queries";
import { useAppSelector } from "@/store/hooks";

import { useWatchedActivitiesQuery } from "../api/activity.queries";
import { mapWatchedClassroomsToCertificateCards } from "../api/certificate.utils";
import type {
  ActivitiesSectionProps,
  CertificateDialogSelection,
} from "../types";
import { CertificateDialog } from "./CertificateDialog";

export function CertificatesSection({ profileId }: ActivitiesSectionProps) {
  const t = useTranslations("activitiesPage");
  const storedUser = useAppSelector((state) => state.auth.user);
  const { data: me } = useMeQuery();
  const [selection, setSelection] = useState<CertificateDialogSelection | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, isError } = useWatchedActivitiesQuery(profileId);
  const fallbackUserId = me?.id ?? storedUser?.id ?? profileId;

  const items = useMemo(
    () => mapWatchedClassroomsToCertificateCards(data ?? [], fallbackUserId),
    [data, fallbackUserId],
  );

  useEffect(() => {
    if (!isError) return;
    notify.error(t("certificatesError"), { id: "activities-certificates-error" });
  }, [isError, t]);

  const handleOpen = (item: (typeof items)[number]) => {
    if (item.certificateId == null || item.userId == null) {
      notify.error(t("certificateDetailError"));
      return;
    }
    setSelection({
      userId: item.userId,
      certificateId: item.certificateId,
      courseName: item.courseName,
      categoryName: item.categoryName,
      teacherLogo: item.teacherLogo,
    });
    setDialogOpen(true);
  };

  return (
    <>
      <ContentSlider
        title={t("certificatesTitle")}
        items={items}
        isLoading={isLoading}
        showViewAll={false}
        emptyMessage={t("emptyCertificates")}
        skeletonCount={CERTIFICATE_SKELETON_COUNT}
        itemWidthClassName={CERTIFICATE_SLIDER_ITEM_WIDTH_CLASS}
        getItemKey={(item) => item.id}
        renderSkeleton={() => <CertificateCardSkeleton />}
        renderItem={(item) => (
          <CertificateCard
            image={item.image}
            teacherLogo={item.teacherLogo}
            courseName={item.courseName}
            categoryName={item.categoryName}
            onClick={() => handleOpen(item)}
          />
        )}
      />

      <CertificateDialog
        selection={selection}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
