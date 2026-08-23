"use client";

import type { DisplayMembershipPlans } from "@/core/types/plan.types";

import { useHomeTab } from "../hooks/useHomeTab";
import { DefaultHome } from "./default";
import { HomeTabs } from "./HomeTabs";
import { WeTheLivingHome } from "./we-the-living";

type HomePageProps = {
  membershipPlans: DisplayMembershipPlans;
};

/**
 * Home shell: tab state + which homepage tree to render.
 * Content lives in DefaultHome / WeTheLivingHome — keep this file thin.
 */
export function HomePage({ membershipPlans }: HomePageProps) {
  const { activeHomeTab, setHomeTab } = useHomeTab();

  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] flex-1 flex-col overflow-hidden">
      <HomeTabs activeTab={activeHomeTab} onTabChange={setHomeTab} />

      {activeHomeTab === "we-the-living" ? (
        <WeTheLivingHome membershipPlans={membershipPlans} />
      ) : (
        <DefaultHome mode={activeHomeTab} membershipPlans={membershipPlans} />
      )}
    </div>
  );
}
