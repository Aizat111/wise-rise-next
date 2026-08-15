import type { ReactNode } from "react";

export type BusinessFeatureType = 1 | 2;

export type BusinessFeatureItem = {
  id: number;
  type: BusinessFeatureType;
  title: string;
  text: string;
  img: string;
};

export type BusinessFeatureTab = {
  type: BusinessFeatureType;
  label: string;
};

export type BusinessFeaturesProps = {
  eyebrow: string;
  title: string;
  tabs: readonly BusinessFeatureTab[];
  features: readonly BusinessFeatureItem[];
  defaultType?: BusinessFeatureType;
  headingId?: string;
  className?: string;
};

export type BusinessFeatureCardProps = {
  feature: BusinessFeatureItem;
};

export type BusinessFeatureTabsProps = {
  tabs: readonly BusinessFeatureTab[];
  activeType: BusinessFeatureType;
  onTypeChange: (type: BusinessFeatureType) => void;
  labelledBy?: string;
  panelId: string;
};

export type BusinessReferenceLogo = {
  src: string;
  name: string;
};

export type BusinessReferencesProps = {
  title: string;
  logos: readonly BusinessReferenceLogo[];
  className?: string;
};

export type BusinessShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  referencesTitle: string;
};
