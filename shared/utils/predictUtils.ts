import type { CountdownCell } from '@/screens/world-cup/partials/CountdownRow';

export type PredictCountdownLabels = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const padCountdownPart = (value: number): string => String(value).padStart(2, '0');

export const buildPredictCountdownCells = (
  targetUnix: number,
  labels: PredictCountdownLabels,
  nowMs = Date.now()
): CountdownCell[] => {
  const remainingMs = Math.max(0, targetUnix * 1000 - nowMs);
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    { value: padCountdownPart(days), label: labels.days },
    { value: padCountdownPart(hours), label: labels.hours },
    { value: padCountdownPart(minutes), label: labels.minutes },
    { value: padCountdownPart(seconds), label: labels.seconds }
  ];
};

const getPredictRankSuffix = (rank: number): string => {
  if (rank % 100 >= 11 && rank % 100 <= 13) return 'th';
  if (rank % 10 === 1) return 'st';
  if (rank % 10 === 2) return 'nd';
  if (rank % 10 === 3) return 'rd';
  return 'th';
};

export const formatPredictRank = (rank: number): string => {
  const suffix = getPredictRankSuffix(rank);
  return `${rank.toLocaleString('en-US')}${suffix}`;
};

export const formatPredictRankParts = (rank: number): { value: string; suffix: string } => ({
  value: rank.toLocaleString('en-US'),
  suffix: getPredictRankSuffix(rank).toUpperCase()
});

export const formatPredictRankMovement = (movement: number): string =>
  movement > 0 ? `+${movement}` : String(movement);

export const buildPredictRoundSelectOptions = (totalRounds: number) =>
  Array.from({ length: totalRounds }, (_, index) => {
    const roundNo = index + 1;
    return { value: String(roundNo), label: `Round ${roundNo}` };
  });
