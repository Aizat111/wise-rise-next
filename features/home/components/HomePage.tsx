"use client";

import { useHomeTab } from "../hooks/useHomeTab";
import { HomeTabs } from "./HomeTabs";
import { HomeThemeWrapper } from "./HomeThemeWrapper";

export function HomePage() {
  const { activeHomeTab, setHomeTab } = useHomeTab();

  return (
    <HomeThemeWrapper activeTab={activeHomeTab}>
      <HomeTabs activeTab={activeHomeTab} onTabChange={setHomeTab} />

      {/* Content sections will be added per activeHomeTab */}
      <div className="flex flex-1 flex-col" aria-live="polite" />
    </HomeThemeWrapper>
  );
}
