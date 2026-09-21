"use client";

import { useEffect } from "react";

import { useRegisterDraft } from "@/features/auth/hooks/useRegisterDraft";
import {
  isPlanIdForCampaign,
  type FreeCampaignType,
} from "@/features/auth/lib/free-campaign";

type FreeCampaignDraftSyncProps = {
  campaignType: FreeCampaignType;
  companyName?: string | null;
};

/** Keeps the shared register draft aligned with the campaign URL. */
export function FreeCampaignDraftSync({
  campaignType,
  companyName,
}: FreeCampaignDraftSyncProps) {
  const { ready, updateDraft } = useRegisterDraft();
  const referrer = companyName?.trim() || null;

  useEffect(() => {
    if (!ready) return;

    updateDraft((prev) => {
      const campaignChanged = prev.campaignType !== campaignType;
      const planStillValid =
        !campaignChanged || isPlanIdForCampaign(prev.planId, campaignType);
      const nextPlanId = planStillValid ? prev.planId : null;

      return {
        ...prev,
        campaignType,
        referrer,
        giftCode: null,
        couponCode: null,
        planId: nextPlanId,
        planPeriod: nextPlanId
          ? prev.planPeriod
          : campaignType === "freeyear"
            ? "Yearly"
            : prev.planPeriod,
        planPrice: nextPlanId ? prev.planPrice : null,
        planName: nextPlanId ? prev.planName : null,
        step: nextPlanId || prev.step !== 4 ? prev.step : 3,
      };
    });
  }, [campaignType, ready, referrer, updateDraft]);

  return null;
}
