"use client";

import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";
import { FreeCampaignDraftSync } from "@/features/auth/components/register/FreeCampaignDraftSync";
import { RegisterFlowProvider } from "@/features/auth/components/register/RegisterFlowContext";
import { Step1 } from "@/features/auth/components/register/Step1";
import { Step2 } from "@/features/auth/components/register/Step2";
import { Step3 } from "@/features/auth/components/register/Step3";
import { Step4 } from "@/features/auth/components/register/Step4";
import type { RegisterStep } from "@/features/auth/hooks/useRegisterDraft";
import type { FreeCampaignType } from "@/features/auth/lib/free-campaign";

type FreeCampaignRegisterPageProps = {
  campaignType: FreeCampaignType;
  companyName?: string;
  step: RegisterStep;
};

export default function FreeCampaignRegisterPage({
  campaignType,
  companyName,
  step,
}: FreeCampaignRegisterPageProps) {
  return (
    <RegisterFlowProvider
      campaignType={campaignType}
      companyName={companyName}
    >
      <FreeCampaignDraftSync
        campaignType={campaignType}
        companyName={companyName}
      />
      <AuthLayout solid={step === 4}>
        {step === 1 ? <Step1 /> : null}
        {step === 2 ? <Step2 /> : null}
        {step === 3 ? <Step3 /> : null}
        {step === 4 ? <Step4 /> : null}
      </AuthLayout>
    </RegisterFlowProvider>
  );
}
