"use client";

import { LayoutGroup } from "framer-motion";

import { HOME_TABS } from "../constants";
import type { HomeTabId } from "../types";
import { HomeTabItem } from "./HomeTabItem";

type HomeTabsProps = {
  activeTab: HomeTabId;
  onTabChange: (tab: HomeTabId) => void;
};

export function HomeTabs({ activeTab, onTabChange }: HomeTabsProps) {
  return (
    <div className={`flex w-full justify-center px-4 py-4 sm:py-5 ${activeTab === "we-the-living" ? "bg-[##02472b]" : "bg-[#18171c]"}`}>
      <LayoutGroup id="home-tabs">
        <div
          role="tablist"
          aria-label="Ana sayfa içerik filtresi"
          className="grid w-[90%] grid-cols-3 gap-1 rounded-full bg-[#25262b] p-1 sm:w-[25%]  sm:max-w-[25%]"
        >
          {HOME_TABS.map((tab) => (
            <HomeTabItem
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onSelect={() => onTabChange(tab.id)}
            />
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
}
