"use client";

import { useHomeTab } from "../hooks/useHomeTab";
import { DefaultHome } from "./default";
import { HomeTabs } from "./HomeTabs";
import { WeTheLivingHome } from "./we-the-living";

/**
 * Home shell: tab state + which homepage tree to render.
 * Content lives in DefaultHome / WeTheLivingHome — keep this file thin.
 */
export function HomePage() {
  const { activeHomeTab, setHomeTab } = useHomeTab();

  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] flex-1 flex-col overflow-hidden">
      <HomeTabs activeTab={activeHomeTab} onTabChange={setHomeTab} />

      {activeHomeTab === "we-the-living" ? (
        <WeTheLivingHome />
      ) : (
        <DefaultHome mode={activeHomeTab} />
      )}
    </div>
  );
}
