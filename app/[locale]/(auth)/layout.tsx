import type { Metadata } from "next";

import { NO_INDEX_PAGE } from "@/core/constants/seo.constants";

export const metadata: Metadata = {
  ...NO_INDEX_PAGE,
};

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function AuthLayout({ children }: Props) {
  return children;
}
