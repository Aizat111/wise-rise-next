import {
  DRAGONS_TOWER_CONFIG,
  DragonsTowerDifficulty,
  normalizeDragonsTowerDifficulty
} from '@/core/constants/games/dragonsTower.constants';
import { IBetHistory } from '@/core/types/user.types';

const formatWinAmount = (amount: number, shouldFormatWithDecimals = true) => {
  if (amount >= 1000000) {
    const value = amount / 1000000;
    return (shouldFormatWithDecimals ? value.toFixed(2) : Math.floor(value).toString()) + 'M';
  } else if (amount >= 100000) {
    const value = amount / 1000;
    return (shouldFormatWithDecimals ? value.toFixed(2) : Math.floor(value).toString()) + 'K';
  } else {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: shouldFormatWithDecimals ? 2 : 0,
      maximumFractionDigits: shouldFormatWithDecimals ? 2 : 0
    });
  }
};

export const formatNumber = (num: number, locale?: string, options?: Intl.NumberFormatOptions) =>
  num?.toLocaleString(locale || undefined, {
    ...options,
    minimumFractionDigits: options?.minimumFractionDigits || 2,
    maximumFractionDigits: options?.maximumFractionDigits || 2
  });
export const formatNumberWithDecimals = (num: number) => new Intl.NumberFormat('en-US').format(num);
export const formatNumberWithCommas = (num: number) =>
  num < 1000000
    ? new Intl.NumberFormat('en-US').format(num)
    : new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 2
      }).format(num);

const worth = (bet: IBetHistory) => {
  const creditsWorth =
    bet?.result === 'WIN'
      ? parseFloat(bet?.credits_won) + parseFloat(bet?.credits_spent)
      : -1 * parseFloat(bet?.credits_spent) - parseFloat(bet?.freebets_spent || '0');
  const freebetsWorth =
    bet?.result === 'WIN'
      ? bet?.freebets_won !== null
        ? parseFloat(bet?.freebets_won || '0')
        : 0
      : bet?.freebets_spent !== null
        ? -1 * parseFloat(bet?.freebets_spent || '0')
        : 0;
  if (bet?.game_name === 'Royal Drop') {
    console.log(bet?.multiplier);
    if (Number(bet?.multiplier) > 0) {
      return creditsWorth * -1 * Number(bet?.multiplier);
    }
  }
  return creditsWorth + freebetsWorth;
};

const multiplier = (multiplier: string) => {
  return multiplier ? parseFloat(multiplier).toFixed(2) : '0.00';
};

const resolveDragonsTowerDifficulty = (
  towersRisk: string | { value?: string } | null | undefined
): DragonsTowerDifficulty => {
  if (typeof towersRisk === 'string') {
    return normalizeDragonsTowerDifficulty(towersRisk);
  }
  if (towersRisk && typeof towersRisk === 'object' && 'value' in towersRisk) {
    return normalizeDragonsTowerDifficulty((towersRisk as { value?: string })?.value ?? '');
  }
  return normalizeDragonsTowerDifficulty();
};

const towersGetRowCashout = (
  towersRisk: string | { value?: string } | null | undefined,
  amount: number,
  row: number,
  autoPlay: 'auto' | 'manual'
) => {
  const riskKey = resolveDragonsTowerDifficulty(towersRisk);
  // Guard invalid row
  if (row < 1) return 0;
  // Use explicit multipliers from config (Row 1 = bottom = arr[0], Row 9 = top = arr[8])
  const arr = DRAGONS_TOWER_CONFIG.multipliers?.[riskKey as keyof typeof DRAGONS_TOWER_CONFIG.multipliers];
  if (!Array.isArray(arr) || (arr as number[]).length === 0) return 0;
  // Caller passes row 1..9: row 1 = first tile (top), row 9 = last tile (bottom). Data is indexed from bottom.
  const clampedRow = Math.min(Math.max(row, 1), arr.length);
  const arrIndexFromBottom = arr.length - clampedRow; // row 9 → index 0 (1.96), row 1 → index 8 (501.76)
  const multiplier = arr[arrIndexFromBottom] ?? arr[arr.length - 1];
  const formattedMultiplier = Number(multiplier);

  if (autoPlay === 'auto') {
    return formattedMultiplier;
  }
  if (amount <= 0) return 0;
  return amount * formattedMultiplier;
};

const towersFormatValue = (value: number) => {
  return parseFloat(String(value))
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const uuidv4 = () => {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: string) =>
    (+c ^ (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)
  );
};

const formatMultiplier = (multiplier: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(multiplier);
};

// Adaptive multiplier formatting: >100 => no decimals, else 2 decimals
const formatMultiplierAdaptive = (value: number): string => {
  const noDecimals = value > 100;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: noDecimals ? 0 : 2,
    maximumFractionDigits: noDecimals ? 0 : 2
  }).format(value);
};

const generateIdempotencyKey = () => {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

// Parses a user-supplied amount string and returns a finite positive number,
// or `null` if the value is empty, non-numeric, NaN, Infinity, or <= 0.
// Use this instead of `parseFloat` / `Number(x)` whenever a form value will be
// sent to the API as a monetary amount.
const safeParsePositiveAmount = (raw: unknown): number | null => {
  if (raw === null || raw === undefined) return null;
  const trimmed = String(raw).trim();
  if (trimmed === '') return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
};

export {
  formatMultiplier,
  formatMultiplierAdaptive,
  formatWinAmount,
  generateIdempotencyKey,
  multiplier,
  safeParsePositiveAmount,
  towersFormatValue,
  towersGetRowCashout,
  uuidv4,
  worth
};
