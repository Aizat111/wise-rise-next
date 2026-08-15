"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { BUSINESS_FEATURES_GRID_CLASS } from "../constants";
import type {
  BusinessFeatureItem,
  BusinessFeatureTab,
  BusinessFeatureType,
} from "../types";
import { BusinessFeatureCard } from "./BusinessFeatureCard";
import { BusinessFeatureTabs } from "./BusinessFeatureTabs";

type BusinessFeaturesPanelProps = {
  tabs: readonly BusinessFeatureTab[];
  features: readonly BusinessFeatureItem[];
  defaultType: BusinessFeatureType;
  labelledBy?: string;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

export function BusinessFeaturesPanel({
  tabs,
  features,
  defaultType,
  labelledBy,
}: BusinessFeaturesPanelProps) {
  const panelId = useId();
  const reduceMotion = useReducedMotion();
  const [activeType, setActiveType] = useState<BusinessFeatureType>(defaultType);

  const visibleFeatures = useMemo(
    () => features.filter((feature) => feature.type === activeType),
    [activeType, features],
  );

  return (
    <div className="mt-8 sm:mt-10">
      <BusinessFeatureTabs
        tabs={tabs}
        activeType={activeType}
        onTypeChange={setActiveType}
        labelledBy={labelledBy}
        panelId={panelId}
      />

      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={`${panelId}-tab-${activeType}`}
        className="mt-10 sm:mt-12"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeType}
            className={BUSINESS_FEATURES_GRID_CLASS}
            initial={
              reduceMotion ? false : { opacity: 0, y: 10 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: easeOut }}
          >
            {visibleFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.28,
                  delay: reduceMotion ? 0 : index * 0.05,
                  ease: easeOut,
                }}
              >
                <BusinessFeatureCard feature={feature} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
