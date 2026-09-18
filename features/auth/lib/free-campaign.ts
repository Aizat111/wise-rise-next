import type { IRegisterStep3Request } from "@/core/types/auth.types";
import type { PlanPeriod } from "@/core/types/plan.types";
import { DEFAULT_LOCALE } from "@/core/config/domain-locale.config";

export const FREE_CAMPAIGN_TYPES = ["freemonth", "freeyear"] as const;
export type FreeCampaignType = (typeof FREE_CAMPAIGN_TYPES)[number];

export const FREE_CAMPAIGN_INTERNAL_PREFIX = "/kampanya";

export const FREE_CAMPAIGN_PLAN_IDS = {
  freemonth: {
    Monthly: "980d3664-8b1d-4a27-b9e1-fcb7494d45f4",
    Yearly: "51a79a72-4eed-48e1-954c-58a77920509e",
  },
  freeyear: {
    Yearly: "16ebd834-bd7e-49c3-a25d-6b68e9387044",
  },
} as const;

const CAMPAIGN_PLAN_ID_SET = new Set<string>([
  FREE_CAMPAIGN_PLAN_IDS.freemonth.Monthly,
  FREE_CAMPAIGN_PLAN_IDS.freemonth.Yearly,
  FREE_CAMPAIGN_PLAN_IDS.freeyear.Yearly,
]);

export const FREE_CAMPAIGN_STEP_SEGMENTS = {
  2: "sifre-olustur",
  3: "plan-sec",
  4: "odeme",
} as const;

export type FreeCampaignPublicRoutes = {
  1: string;
  2: string;
  3: string;
  4: string;
};

export type ParsedFreeCampaignPath = {
  localePrefix: string;
  campaignType: FreeCampaignType;
  companyName?: string;
  stepSegment?: string;
};

const FREE_CAMPAIGN_PATH_RE =
  /^\/(freemonth|freeyear)(?:-([^/]+))?(\/(sifre-olustur|plan-sec|odeme))?\/?$/;

export function isFreeCampaignType(
  value: string | null | undefined,
): value is FreeCampaignType {
  return value === "freemonth" || value === "freeyear";
}

export function decodeCompanyName(
  value: string | null | undefined,
): string | undefined {
  if (value == null) return undefined;

  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    decoded = value;
  }

  const trimmed = decoded.trim();
  return trimmed ? trimmed : undefined;
}

function splitLocalePrefix(pathname: string): {
  localePrefix: string;
  rest: string;
} {
  if (pathname === "/az" || pathname.startsWith("/az/")) {
    return { localePrefix: "/az", rest: pathname.slice(3) || "/" };
  }
  return { localePrefix: "", rest: pathname };
}

export function parseFreeCampaignPathname(
  pathname: string,
): ParsedFreeCampaignPath | null {
  const { localePrefix, rest } = splitLocalePrefix(pathname);
  const match = rest.match(FREE_CAMPAIGN_PATH_RE);
  if (!match) return null;

  const campaignType = match[1];
  if (!isFreeCampaignType(campaignType)) return null;

  return {
    localePrefix,
    campaignType,
    companyName: decodeCompanyName(match[2]),
    stepSegment: match[4] || undefined,
  };
}

export function toInternalCampaignPathname(
  parsed: ParsedFreeCampaignPath,
): string {
  const step = parsed.stepSegment ? `/${parsed.stepSegment}` : "";
  const localePrefix = parsed.localePrefix || `/${DEFAULT_LOCALE}`;
  return `${localePrefix}${FREE_CAMPAIGN_INTERNAL_PREFIX}/${parsed.campaignType}${step}`;
}

export function parseFreeCampaignStepSegment(
  step?: string[] | undefined,
): 1 | 2 | 3 | 4 | null {
  if (!step || step.length === 0) return 1;
  if (step.length !== 1) return null;

  const [segment] = step;
  if (segment === FREE_CAMPAIGN_STEP_SEGMENTS[2]) return 2;
  if (segment === FREE_CAMPAIGN_STEP_SEGMENTS[3]) return 3;
  if (segment === FREE_CAMPAIGN_STEP_SEGMENTS[4]) return 4;
  return null;
}

export function getFreeCampaignPublicRoutes(
  campaignType: FreeCampaignType,
  companyName?: string | null,
): FreeCampaignPublicRoutes {
  const trimmed = companyName?.trim();
  const base = trimmed
    ? `/${campaignType}-${encodeURIComponent(trimmed)}`
    : `/${campaignType}`;

  return {
    1: base,
    2: `${base}/${FREE_CAMPAIGN_STEP_SEGMENTS[2]}`,
    3: `${base}/${FREE_CAMPAIGN_STEP_SEGMENTS[3]}`,
    4: `${base}/${FREE_CAMPAIGN_STEP_SEGMENTS[4]}`,
  };
}

export function getCampaignPlanId(
  campaignType: FreeCampaignType,
  period: PlanPeriod,
): string | null {
  if (campaignType === "freemonth") {
    return FREE_CAMPAIGN_PLAN_IDS.freemonth[period];
  }
  if (period !== "Yearly") return null;
  return FREE_CAMPAIGN_PLAN_IDS.freeyear.Yearly;
}

export function isCampaignPlanId(planId: string | null | undefined): boolean {
  if (!planId) return false;
  return CAMPAIGN_PLAN_ID_SET.has(planId);
}

export function isPlanIdForCampaign(
  planId: string | null | undefined,
  campaignType: FreeCampaignType,
): boolean {
  if (!planId) return false;
  if (campaignType === "freemonth") {
    return (
      planId === FREE_CAMPAIGN_PLAN_IDS.freemonth.Monthly ||
      planId === FREE_CAMPAIGN_PLAN_IDS.freemonth.Yearly
    );
  }
  return planId === FREE_CAMPAIGN_PLAN_IDS.freeyear.Yearly;
}

export function getPeriodForCampaignPlanId(
  planId: string | null | undefined,
): PlanPeriod | null {
  if (!planId) return null;
  if (planId === FREE_CAMPAIGN_PLAN_IDS.freemonth.Monthly) return "Monthly";
  if (
    planId === FREE_CAMPAIGN_PLAN_IDS.freemonth.Yearly ||
    planId === FREE_CAMPAIGN_PLAN_IDS.freeyear.Yearly
  ) {
    return "Yearly";
  }
  return null;
}

export function buildRegisterStep3Data(
  planId: string,
  referrer?: string | null,
): IRegisterStep3Request {
  const trimmed = referrer?.trim();
  if (trimmed) {
    return { plan_id: planId, referrer: trimmed };
  }
  return { plan_id: planId };
}

export function isFreeCampaignPathname(pathname: string): boolean {
  if (parseFreeCampaignPathname(pathname)) return true;
  return (
    pathname === FREE_CAMPAIGN_INTERNAL_PREFIX ||
    pathname.startsWith(`${FREE_CAMPAIGN_INTERNAL_PREFIX}/`)
  );
}
