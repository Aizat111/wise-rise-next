import { lazy } from 'react';

const PlinkoTab = lazy(() => import('./partials/PlinkoTab'));
const MinesTab = lazy(() => import('./partials/MinesTab'));
const RouletteTab = lazy(() => import('./partials/RouletteTab'));
const TowersTab = lazy(() => import('./partials/TowersTab'));

const tabs = {
  plinko: PlinkoTab,
  mines: MinesTab,
  roulette: RouletteTab,
  towers: TowersTab
};

const FairnessSection = ({ slug }: { slug: string }) => {
  const Tab = tabs[slug as keyof typeof tabs];
  return <Tab />;
};

export default FairnessSection;
