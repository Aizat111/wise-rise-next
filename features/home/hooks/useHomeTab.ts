"use client";

import { useCallback, useState } from "react";

import { DEFAULT_HOME_TAB } from "../constants";
import type { HomeTabId } from "../types";

type UseHomeTabOptions = {
  initialTab?: HomeTabId;
  onChange?: (tab: HomeTabId) => void;
};

export function useHomeTab(options: UseHomeTabOptions = {}) {
  const { initialTab = DEFAULT_HOME_TAB, onChange } = options;
  const [activeHomeTab, setActiveHomeTab] = useState<HomeTabId>(initialTab);

  const setHomeTab = useCallback(
    (tab: HomeTabId) => {
      setActiveHomeTab(tab);
      onChange?.(tab);
    },
    [onChange],
  );

  return {
    activeHomeTab,
    setHomeTab,
  };
}
