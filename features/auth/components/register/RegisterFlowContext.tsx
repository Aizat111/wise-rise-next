"use client";

import { createContext, useContext, type ReactNode } from "react";

import { REGISTER_ROUTES } from "@/features/auth/hooks/useRegisterDraft";
import {
  getFreeCampaignPublicRoutes,
  type FreeCampaignType,
} from "@/features/auth/lib/free-campaign";

export type RegisterRoutes = {
  1: string;
  2: string;
  3: string;
  4: string;
};

export type RegisterFlowContextValue = {
  campaignType: FreeCampaignType | null;
  companyName: string | null;
  routes: RegisterRoutes;
  isFreeCampaign: boolean;
};

const DEFAULT_REGISTER_FLOW: RegisterFlowContextValue = {
  campaignType: null,
  companyName: null,
  routes: REGISTER_ROUTES,
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

export function useRegisterFlow() {
  return useContext(RegisterFlowContext);
}
