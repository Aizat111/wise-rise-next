import { COLORS } from '@/core/constants/colors.constants';
import { BET_TYPES, ROULETTE_COLORS } from '@/core/constants/games/roulette.constants';

// Helper function to get numbers for a bet type
const getNumbersForBet = (type: string, index: number): number[] => {
  switch (type) {
    case BET_TYPES.COLUMN: {
      return Array.from({ length: 12 }, (_, i) => {
        const colValue = (i + 1) * 3;
        return colValue - (2 - index);
      });
    }
    case BET_TYPES.DOZEN: {
      const start = index * 12 + 1;
      return Array.from({ length: 12 }, (_, i) => start + i);
    }
    case BET_TYPES.HALF: {
      const halfStart = index * 18 + 1;
      return Array.from({ length: 18 }, (_, i) => halfStart + i);
    }
    case BET_TYPES.PARITY:
      return Array.from({ length: 36 }, (_, i) => i + 1).filter(
        num => (index === 0 && num % 2 === 1) || (index === 1 && num % 2 === 0)
      );
    case BET_TYPES.COLOR:
      return Array.from({ length: 36 }, (_, i) => i + 1).filter(
        num => ROULETTE_COLORS[num as keyof typeof ROULETTE_COLORS] === (index === 0 ? 'red' : 'black')
      );
    default:
      return [];
  }
};

const formatChipValue = (amount: number): string => {
  const units = [
    { value: 1_000_000_000, suffix: 'B' },
    { value: 1_000_000, suffix: 'M' },
    { value: 1_000, suffix: 'K' }
  ];

  for (const { value, suffix } of units) {
    if (amount >= value) {
      const formatted = `${Math.floor(amount / value)}${suffix}`;
      return amount % value === 0 ? formatted : `${formatted}+`;
    }
  }

  return amount.toLocaleString('en-US');
};

const formatChipValueForColor = (amount: number): string => {
  if (amount >= 100_000_000) return COLORS.chip['100M'];
  if (amount >= 10_000_000) return COLORS.chip['10M'];
  if (amount >= 1_000_000) return COLORS.chip['1M'];
  if (amount >= 100_000) return COLORS.chip['100K'];
  if (amount >= 10_000) return COLORS.chip['10K'];
  if (amount >= 1_000) return COLORS.chip['1K'];
  if (amount >= 100) return COLORS.chip[100];
  if (amount >= 10) return COLORS.chip[10];

  return COLORS.chip[1];
};

const isNumberHighlighted = (number: number, hoveredBet: { type: string; index: number }): boolean => {
  if (!hoveredBet) return false;
  const numbers = getNumbersForBet(hoveredBet.type, hoveredBet.index);
  return numbers.includes(number);
};

export { formatChipValue, formatChipValueForColor, getNumbersForBet, isNumberHighlighted };
