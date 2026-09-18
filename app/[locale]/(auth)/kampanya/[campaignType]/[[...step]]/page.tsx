import type { Metadata } from "next";
import { notFound } from "next/navigation";

import FreeCampaignRegisterPage from "@/features/auth/pages/FreeCampaignRegisterPage";
import {
  decodeCompanyName,
  getFreeCampaignPublicRoutes,
  isFreeCampaignType,
  parseFreeCampaignStepSegment,
} from "@/features/auth/lib/free-campaign";
import { buildPageMetadata } from "@/shared/seo/generateMetadata";

type Props = {
  params: Promise<{
    locale: string;
    campaignType: string;
    step?: string[];
  }>;
  searchParams: Promise<{
    company?: string | string[];
  }>;
};

function firstSearchValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { campaignType, step } = await params;
  const query = await searchParams;
  const companyName = decodeCompanyName(firstSearchValue(query.company));
  const registerStep = parseFreeCampaignStepSegment(step);
  const canonical =
    isFreeCampaignType(campaignType) && registerStep
      ? getFreeCampaignPublicRoutes(campaignType, companyName)[registerStep]
      : `/${campaignType}`;

  return buildPageMetadata({
    title: "Hesap Oluştur",
    description:
      "Wise&Rise'a üye ol, Türkiye'nin en iyilerinden öğrenmeye başla.",
    canonical,
    noIndex: true,
  });
}

export default async function Page({ params, searchParams }: Props) {
  const { campaignType, step } = await params;
  const query = await searchParams;

  if (!isFreeCampaignType(campaignType)) {
    notFound();
  }

  const registerStep = parseFreeCampaignStepSegment(step);
  if (!registerStep) {
    notFound();
  }

  return (
    <FreeCampaignRegisterPage
      campaignType={campaignType}
      companyName={decodeCompanyName(firstSearchValue(query.company))}
      step={registerStep}
    />
  );
}
