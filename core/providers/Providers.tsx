"use client";

import { ReactNode } from "react";

import { NotifyContainer } from "@/shared/components/notify";
import { SurveyGuard } from "@/features/survey/components/SurveyGuard";

import QueryProvider from "./QueryProvider";
import ReduxProvider from "./ReduxProvider";

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <SurveyGuard />
        {children}
        <NotifyContainer />
      </QueryProvider>
    </ReduxProvider>
  );
}