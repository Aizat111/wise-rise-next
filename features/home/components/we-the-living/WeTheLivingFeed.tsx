"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";

import type { DisplayMembershipPlans } from "@/core/types/plan.types";
import { notify } from "@/shared/components/notify";
import { useAppSelector } from "@/store/hooks";

import { useHomeFeedQuery } from "../../api/home.queries";
import {
  composeWeTheLivingHomeSections,
  interleaveWeTheLivingBanners,
} from "../../api/home.utils";
import {
  WE_THE_LIVING_FEED_SKELETON_COUNT,
  WE_THE_LIVING_PLATFORM,
  getWeTheLivingHomeBanners,
} from "./constants";
import type { WeTheLivingHomeSection } from "./types";
import { WeTheLivingImageBanner } from "./WeTheLivingImageBanner";
import { WeTheLivingMembershipBanner } from "./WeTheLivingMembershipBanner";
import { WeTheLivingSimpleBanner } from "./WeTheLivingSimpleBanner";
import { WeTheLivingSlider } from "./WeTheLivingSlider";

type WeTheLivingFeedProps = {
  membershipPlans: DisplayMembershipPlans;
};

function WeTheLivingBannerView({
  section,
  membershipPlans,
}: {
  section: Extract<WeTheLivingHomeSection, { kind: "banner" }>;
  membershipPlans: DisplayMembershipPlans;
}) {
  const t = useTranslations("weTheLiving.banner.simple");

  switch (section.variant) {
    case "simple": {
      const copy =
        section.itemKey === "item1"
          ? {
            title: t("item2.title"),
            subtitle: t("item2.subtitle"),
            imageAlt: t("item2.imageAlt"),

          }
          : {
            title: t("item1.title"),
            subtitle: t("item1.subtitle"),
            imageAlt: t("item1.imageAlt"),
          };

      return (
        <WeTheLivingSimpleBanner
          image={section.image}
          title={copy.title}
          subtitle={copy.subtitle}
          imageAlt={copy.imageAlt}
        />
      );
    }
    case "image":
      return <WeTheLivingImageBanner />;
    case "membership":
      return (
        <WeTheLivingMembershipBanner
          monthlyPlan={membershipPlans.monthly}
          yearlyPlan={membershipPlans.yearly}
        />
      );

    default:
      return null;
  }
}

function WeTheLivingHomeSectionView({
  section,
  membershipPlans,
  isLoading = false,
}: {
  section: WeTheLivingHomeSection;
  membershipPlans: DisplayMembershipPlans;
  isLoading?: boolean;
}) {
  switch (section.kind) {
    case "slider":
      return (
        <WeTheLivingSlider
          title={section.title}
          items={section.items}
          isLoading={isLoading}
        />
      );
    case "banner":
      return (
        <WeTheLivingBannerView
          section={section}
          membershipPlans={membershipPlans}
        />
      );
    default:
      return null;
  }
}

function WeTheLivingFeedSkeleton({
  membershipPlans,
  banners,
}: {
  membershipPlans: DisplayMembershipPlans;
  banners: ReturnType<typeof getWeTheLivingHomeBanners>;
}) {
  const sections = useMemo(
    () =>
      interleaveWeTheLivingBanners(
        Array.from({ length: WE_THE_LIVING_FEED_SKELETON_COUNT }, (_, index) => ({
          kind: "slider" as const,
          id: `wtl-feed-skeleton-${index}`,
          title: "",
          items: [],
        })),
        banners,
      ),
    [banners],
  );

  return (
    <>
      {sections.map((section) => (
        <WeTheLivingHomeSectionView
          key={section.id}
          section={section}
          membershipPlans={membershipPlans}
          isLoading={section.kind === "slider"}
        />
      ))}
    </>
  );
}

export function WeTheLivingFeed({ membershipPlans }: WeTheLivingFeedProps) {
  const t = useTranslations("home.weTheLiving");
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const banners = useMemo(
    () => getWeTheLivingHomeBanners(isAuthenticated),
    [isAuthenticated],
  );
  const { data, isLoading, isError, isFetching } = useHomeFeedQuery(
    WE_THE_LIVING_PLATFORM,
  );

  const sections = useMemo(
    () =>
      isError
        ? interleaveWeTheLivingBanners([], banners)
        : composeWeTheLivingHomeSections(data?.lists ?? [], banners),
    [banners, data?.lists, isError],
  );

  useEffect(() => {
    if (!isError) return;
    notify.error(t("coursesLoadError"), { id: "wtl-home-feed-error" });
  }, [isError, t]);

  if (isLoading || (isFetching && !data)) {
    return (
      <WeTheLivingFeedSkeleton
        membershipPlans={membershipPlans}
        banners={banners}
      />
    );
  }

  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => (
        <WeTheLivingHomeSectionView
          key={section.id}
          section={section}
          membershipPlans={membershipPlans}
        />
      ))}
    </>
  );
}
