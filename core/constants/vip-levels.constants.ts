import { COLORS } from './colors.constants';

export const VIP_LEVEL_IMAGES = {
  0: 'https://static.toshi.bet/profiles/level_0.png?w=450&fit=min&auto=format',
  1: 'https://static.toshi.bet/profiles/level_1.png?w=450&fit=min&auto=format',
  5: 'https://static.toshi.bet/profiles/level_5.png?w=450&fit=min&auto=format',
  10: 'https://static.toshi.bet/profiles/level_10.png?w=450&fit=min&auto=format',
  15: 'https://static.toshi.bet/profiles/level_15.png?w=450&fit=min&auto=format',
  20: 'https://static.toshi.bet/profiles/level_20.png?w=450&fit=min&auto=format',
  22: 'https://static.toshi.bet/profiles/level_22.png?w=450&fit=min&auto=format',
  24: 'https://static.toshi.bet/profiles/level_24.png?w=450&fit=min&auto=format',
  25: 'https://static.toshi.bet/profiles/level_25.png?w=450&fit=min&auto=format',
  28: 'https://static.toshi.bet/profiles/level_28.png?w=450&fit=min&auto=format',
  30: 'https://static.toshi.bet/profiles/level_30.png?w=450&fit=min&auto=format',
  35: 'https://static.toshi.bet/profiles/level_35.png?w=450&fit=min&auto=format'
} as const;

export type VipLevel = keyof typeof VIP_LEVEL_IMAGES;

// Global color mapping for VIP levels (closest match logic same as images)
export const VIP_LEVEL_COLORS = {
  0: '#7B7B7B',
  1: '#7B7B7B',
  5: '#B2A903',
  10: '#008EFA',
  15: '#FF6100',
  20: '#FF0000',
  25: '#049C8F',
  30: '#004BB4',
  35: '#640A00',
  40: '#282828'
} as const;

// Global color mapping for VIP levels (closest match logic same as images)
export const VIP_LEVEL_BORDER_COLORS = {
  0: 'avatar_outline/25',
  1: 'avatar_outline/25',
  5: 'avatar_outline/25',
  10: 'avatar_outline/25',
  15: 'avatar_outline/25',
  20: 'linear-gradient(300deg, #A8A8A6 15.87%, #3B3030 48.67%, #F9F8F6 64.17%, #D4D4D4 75.79%, #7F7F7F 88.5%)',
  25: 'linear-gradient(300deg, #A8A8A6 15.87%, #3B3030 48.67%, #F9F8F6 64.17%, #D4D4D4 75.79%, #7F7F7F 88.5%)',
  30: 'linear-gradient(135deg, #8C421D 15.43%, #FBE67B 38.47%, #FCFBE7 53.36%, #F7D14E 69.97%, #D4A041 86.26%)',
  35: 'linear-gradient(135deg, #8C421D 15.43%, #FBE67B 38.47%, #FCFBE7 53.36%, #F7D14E 69.97%, #D4A041 86.26%)',
  40: 'linear-gradient(135deg, #8C421D 15.43%, #FBE67B 38.47%, #FCFBE7 53.36%, #F7D14E 69.97%, #D4A041 86.26%)'
} as const;

export type VipLevelColorKey = keyof typeof VIP_LEVEL_COLORS;

export const getVipLevelColor = (level: number): string => {
  const availableLevels = Object.keys(VIP_LEVEL_COLORS)
    .map(Number)
    .sort((a, b) => a - b);

  let closestLevel = availableLevels[0];
  for (const availableLevel of availableLevels) {
    if (availableLevel <= level) {
      closestLevel = availableLevel;
    } else {
      break;
    }
  }

  return VIP_LEVEL_COLORS[closestLevel as VipLevelColorKey];
};

export type VipLevelBorderKey = keyof typeof VIP_LEVEL_BORDER_COLORS;

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const bigint = parseInt(cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const getVipLevelBorderColor = (level: number): string => {
  const availableLevels = Object.keys(VIP_LEVEL_BORDER_COLORS)
    .map(Number)
    .sort((a, b) => a - b);

  let closestLevel = availableLevels[0];
  for (const availableLevel of availableLevels) {
    if (availableLevel <= level) {
      closestLevel = availableLevel;
    } else {
      break;
    }
  }
  const token = VIP_LEVEL_BORDER_COLORS[closestLevel as VipLevelBorderKey] as unknown as string;
  // If token is a direct CSS gradient, return as-is
  if (typeof token === 'string' && token.startsWith('linear-gradient')) {
    return token;
  }
  // Support "<token>/<opacityPercent>" form, e.g. "avatar_outline/25"
  if (token.includes('/')) {
    const [base, opacityStr] = token.split('/');
    const baseColor = (COLORS as Record<string, any>)[base] as string | undefined;
    const alpha = Math.max(0, Math.min(100, Number(opacityStr || 100))) / 100;
    if (baseColor && baseColor.startsWith('#')) {
      return hexToRgba(baseColor, alpha);
    }
  }
  // Fallback to CSS var if direct token
  return `var(--color-${token})`;
};

// Helper function to get the closest available level image
export const getVipLevelImage = (level: number): string => {
  const availableLevels = Object.keys(VIP_LEVEL_IMAGES)
    .map(Number)
    .sort((a, b) => a - b);

  // Find the closest level that's less than or equal to the requested level
  let closestLevel = availableLevels[0];
  for (const availableLevel of availableLevels) {
    if (availableLevel <= level) {
      closestLevel = availableLevel;
    } else {
      break;
    }
  }

  return VIP_LEVEL_IMAGES[closestLevel as VipLevel];
};

// Helper function to get all available levels
export const getAvailableVipLevels = (): number[] => {
  return Object.keys(VIP_LEVEL_IMAGES)
    .map(Number)
    .sort((a, b) => a - b);
};
