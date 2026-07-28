import { COLORS } from '../colors.constants';

import { WheelRisk } from '@/core/types/wheel.types';

export const WHEEL_SECTIONS = [10, 20, 30, 40, 50] as const;

export const WHEEL_PAYOUTS: Record<number, Record<WheelRisk, number[]>> = {
  10: {
    low: [1.5, 1.2, 1.2, 1.2, 0, 1.2, 1.2, 1.2, 1.2, 0],
    medium: [0, 1.9, 0, 1.5, 0, 2, 0, 1.5, 0, 3],
    high: [0, 0, 0, 0, 0, 0, 0, 0, 0, 9.9]
  },
  20: {
    low: [1.5, 1.2, 1.2, 1.2, 0, 1.2, 1.2, 1.2, 1.2, 0, 1.5, 1.2, 1.2, 1.2, 0, 1.2, 1.2, 1.2, 1.2, 0],
    medium: [1.5, 0, 2, 0, 2, 0, 2, 0, 1.5, 0, 3, 0, 1.8, 0, 2, 0, 2, 0, 2, 0],
    high: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19.8]
  },
  30: {
    low: [
      1.5, 1.2, 1.2, 1.2, 0, 1.2, 1.2, 1.2, 1.2, 0, 1.5, 1.2, 1.2, 1.2, 0, 1.2, 1.2, 1.2, 1.2, 0, 1.5, 1.2, 1.2, 1.2, 0,
      1.2, 1.2, 1.2, 1.2, 0
    ],
    medium: [1.5, 0, 1.5, 0, 2, 0, 1.5, 0, 2, 0, 2, 0, 1.5, 0, 3, 0, 1.5, 0, 2, 0, 2, 0, 1.7, 0, 4, 0, 1.5, 0, 2, 0],
    high: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29.7]
  },
  40: {
    low: [
      1.5, 1.2, 1.2, 1.2, 0, 1.2, 1.2, 1.2, 1.2, 0, 1.5, 1.2, 1.2, 1.2, 0, 1.2, 1.2, 1.2, 1.2, 0, 1.5, 1.2, 1.2, 1.2, 0,
      1.2, 1.2, 1.2, 1.2, 0, 1.5, 1.2, 1.2, 1.2, 0, 1.2, 1.2, 1.2, 1.2, 0
    ],
    medium: [
      2, 0, 3, 0, 2, 0, 1.5, 0, 3, 0, 1.5, 0, 1.5, 0, 2, 0, 1.5, 0, 3, 0, 1.5, 0, 2, 0, 2, 0, 1.6, 0, 2, 0, 1.5, 0, 3,
      0, 1.5, 0, 2, 0, 1.5, 0
    ],
    high: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 39.6
    ]
  },
  50: {
    low: [
      1.5, 1.2, 1.2, 1.2, 0, 1.2, 1.2, 1.2, 1.2, 0, 1.5, 1.2, 1.2, 1.2, 0, 1.2, 1.2, 1.2, 1.2, 0, 1.5, 1.2, 1.2, 1.2, 0,
      1.2, 1.2, 1.2, 1.2, 0, 1.5, 1.2, 1.2, 1.2, 0, 1.2, 1.2, 1.2, 1.2, 0, 1.5, 1.2, 1.2, 1.2, 0, 1.2, 1.2, 1.2, 1.2, 0
    ],
    medium: [
      2, 0, 1.5, 0, 2, 0, 1.5, 0, 3, 0, 1.5, 0, 1.5, 0, 2, 0, 1.5, 0, 3, 0, 1.5, 0, 2, 0, 1.5, 0, 2, 0, 2, 0, 1.5, 0, 3,
      0, 1.5, 0, 2, 0, 1.5, 0, 1.5, 0, 5, 0, 1.5, 0, 2, 0, 1.5, 0
    ],
    high: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 49.5
    ]
  }
};

export const WHEEL_RISKS: WheelRisk[] = ['low', 'medium', 'high'];

export const getMultiplierColor = (value: number) => {
  if (value === 0) return COLORS.wheel_multiplier.gray;
  if (value >= 9) return COLORS.wheel_multiplier.red;
  if (value >= 5) return COLORS.wheel_multiplier.yellow;
  if (value >= 3) return COLORS.wheel_multiplier.orange;
  if (value >= 2) return COLORS.wheel_multiplier.green;
  if (value >= 1.6) return COLORS.wheel_multiplier.white;
  if (value >= 1.5) return COLORS.wheel_multiplier.blue;

  if (value >= 1.2) return COLORS.wheel_multiplier.purple;
  return COLORS.wheel_multiplier.white;
};

export const WHEEL_SPIN_DURATION_MS = 1200;
