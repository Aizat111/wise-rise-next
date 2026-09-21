"use client";

import { useParams } from "next/navigation";
import { createContext, useContext, useMemo, type ReactNode } from "react";

import { usePathname } from "@/core/i18n/navigation";
import { useRegisterDraft } from "@/features/auth/hooks/useRegisterDraft";
import {
  getFreeCampaignPublicRoutes,
  type FreeCampaignType,
} from "@/features/auth/lib/free-campaign";
import {
  getRegisterRoutes,
  REGISTER_ROUTES_WITHOUT_COUPON,
  resolveRegistrationCoupon,
  type RegisterRoutes,
} from "@/features/auth/lib/register-coupon";

export type { RegisterRoutes };

export type RegisterFlowContextValue = {
  campaignType: FreeCampaignType | null;
  companyName: string | null;
  routes: RegisterRoutes;
  isFreeCampaign: boolean;
};

const DEFAULT_REGISTER_FLOW: RegisterFlowContextValue = {
  campaignType: null,
  companyName: null,
  routes: REGISTER_ROUTES_WITHOUT_COUPON,
  isFreeCampaign: false,
};

const RegisterFlowContext =
  createContext<RegisterFlowContextValue>(DEFAULT_REGISTER_FLOW);

type RegisterFlowProviderProps = {
  campaignType: FreeCampaignType;
  companyName?: string | null;
  children: ReactNode;
};

export function RegisterFlowProvider({
  campaignType,
  companyName,
  children,
}: RegisterFlowProviderProps) {
  const trimmedCompany = companyName?.trim() || null;

  return (
    <RegisterFlowContext.Provider
      value={{
        campaignType,
        companyName: trimmedCompany,
        routes: getFreeCampaignPublicRoutes(campaignType, trimmedCompany),
        isFreeCampaign: true,
      }}
    >
      {children}
    </RegisterFlowContext.Provider>
  );
}

function readCouponParam(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" ? raw : null;
}

/** URL coupon for the normal register flow, then the draft on later steps. */
export function useRegistrationCouponCode() {
  const flow = useContext(RegisterFlowContext);
  const pathname = usePathname();
  const params = useParams();
  const { draft } = useRegisterDraft();

  return resolveRegistrationCoupon({
    pathname,
    couponParam: readCouponParam(params.couponCode),
    draftCoupon: draft.couponCode,
    isFreeCampaign: flow.isFreeCampaign,
  });
}

export function useRegisterFlow() {
  const flow = useContext(RegisterFlowContext);
  const couponCode = useRegistrationCouponCode();

  return useMemo(() => {
    if (flow.isFreeCampaign) return flow;
    return {
      ...flow,
      routes: getRegisterRoutes(couponCode),
    };
  }, [couponCode, flow]);
}
