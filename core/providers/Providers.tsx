"use client";

import { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import ReduxProvider from "./ReduxProvider";

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <ReduxProvider>
      <QueryProvider>{children}</QueryProvider>
    </ReduxProvider>
  );
}