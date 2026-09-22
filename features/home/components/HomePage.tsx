"use client";

import type { Category } from "@/core/api/types";
import type { Hero } from "@/core/types/hero.types";
import type { HomeFeed } from "@/core/types/home.types";
import type { DisplayMembershipPlans } from "@/core/types/plan.types";

import { useHomeTab } from "../hooks/useHomeTab";
import { DefaultHome } from "./default";
import { HomeTabs } from "./HomeTabs";
import { WeTheLivingHome } from "./we-the-living";

type HomePageProps = {
  membershipPlans: DisplayMembershipPlans;
  categories?: Category[];
  initialPlatform?: string;
  initialHeroes?: Hero[];
  initialFeed?: HomeFeed | null;
};

/**
 * Home shell: tab state + which homepage tree to render.
 * Content lives in DefaultHome / WeTheLivingHome — keep this file thin.
 */
export function HomePage({
  membershipPlans,
  categories,
  initialPlatform,
  initialHeroes,
  initialFeed,
}: HomePageProps) {
  const { activeHomeTab, setHomeTab } = useHomeTab();

  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] flex-1 flex-col overflow-hidden">
      <HomeTabs activeTab={activeHomeTab} onTabChange={setHomeTab} />

      {activeHomeTab === "we-the-living" ? (
        <WeTheLivingHome membershipPlans={membershipPlans} />
      ) : (
        <DefaultHome
          key={activeHomeTab}
          mode={activeHomeTab}
          membershipPlans={membershipPlans}
          categories={categories}
          initialPlatform={initialPlatform}
          initialHeroes={initialHeroes}
          initialFeed={initialFeed}
        />
      )}
    </div>
  );
}
