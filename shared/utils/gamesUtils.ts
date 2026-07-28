import {
  BALL_RADIUS,
  MULTIPLIERS_COLORS,
  MULTIPLIERS_VALUES,
  OBSTACLE_OFFSET_X,
  OBSTACLE_OFFSET_Y,
  OBSTACLE_RADIUS,
  PORTAL_POSITIONS
} from '@/core/constants/plinko.constants';
import { providers } from '@/data/providers';
import { Multiplier, Obstacle, ValhallaPortal } from '@/screens/games/plinko/partials/plinkoClasses';
import { Card } from '@/types/blackjack.type';

// Helper function to create obstacles
export const createObstacles = (
  obstacles: Obstacle[],
  multipliersAmount: number,
  offsetY: number,
  ctx: CanvasRenderingContext2D
) => {
  for (let row = 3; row < multipliersAmount; row++) {
    for (let col = 0; col < row; col++) {
      const x = OBSTACLE_OFFSET_X * col - ((row - 1) * OBSTACLE_OFFSET_X) / 2 - BALL_RADIUS / 2 + 4;
      const y = (row - 3) * OBSTACLE_OFFSET_Y - offsetY - BALL_RADIUS / 2 + 30;

      obstacles.push(new Obstacle(x, y, OBSTACLE_RADIUS, ctx));
    }
  }
};

// Helper function to create multipliers
export const createMultipliers = (
  multipliers: Multiplier[],
  multipliersAmount: number,
  offsetY: number,
  ctx: CanvasRenderingContext2D,
  form: any,
  updateStatePlinko: () => void
) => {
  for (let i = 0; i < multipliersAmount - 2; i++) {
    const x = i * OBSTACLE_OFFSET_X - (multipliersAmount - 2) * (OBSTACLE_OFFSET_X / 2) + 17;
    const y = offsetY - 30;
    const value = MULTIPLIERS_VALUES[form.risk][form.rows][form.valhallaLevel][i];
    const colors = MULTIPLIERS_COLORS[form.rows][i];

    multipliers.push(new Multiplier(x, y, value, i, ctx, colors.bg, colors.shadow, updateStatePlinko));
  }
};

// Helper function to create Valhalla portals
export const createValhallaPortals = (
  valhallaPortals: ValhallaPortal[],
  offsetY: number,
  ctx: CanvasRenderingContext2D,
  form: any,
  ValhallaPortalImgRef: any
) => {
  const portalPositions = PORTAL_POSITIONS[form.valhallaLevel]?.[form.rows];
  if (!portalPositions) return;

  const PORTAL_OFFSET_X = -40;

  portalPositions.forEach((position, index) => {
    const [row, col] = position;
    const y = (row - 1) * OBSTACLE_OFFSET_Y - offsetY - BALL_RADIUS / 2 - 5;
    const x = 40 * (col - 1) - (row * 40 + PORTAL_OFFSET_X) / 2;

    valhallaPortals.push(new ValhallaPortal(x, y, index, ctx, ValhallaPortalImgRef.current));
  });
};

export const calculateGameMultiplierMines = (revealedTilesCount: number, mineCount: number) => {
  if (revealedTilesCount < 1) return 1;

  const houseEdge = 0.01;

  const totalTiles = 25;
  let successProbability = 1;
  for (let i = 0; i < revealedTilesCount; i++) {
    successProbability *= (totalTiles - mineCount - i) / (totalTiles - i);
  }

  const idealMultiplier = 1 / successProbability;
  const adjustedMultiplier = idealMultiplier * (1 - houseEdge);

  return +adjustedMultiplier.toFixed(2);
};

export async function calculateHMAC(serverSeed: string, clientSeed: string, nonce: string, game: string) {
  if (!serverSeed || !clientSeed || !nonce || isNaN(parseInt(nonce))) {
    throw new Error('All fields are required and nonce must be a valid number');
  }

  const key = new TextEncoder().encode(serverSeed);
  const message = `${clientSeed}:${nonce}:0`;
  const msgBuffer = new TextEncoder().encode(message);

  const cryptoKey = await window.crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign'
  ]);

  const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, msgBuffer);
  const hashArray = Array.from(new Uint8Array(signature));
  const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const byteArray = hashArray.map(b => b.toString(16).padStart(2, '0')).join(' ');
  const decimalArray = hashArray.map(b => b.toString(10)).join(' ');

  // Byte to Number hesaplama
  const firstFourBytes = hashArray.slice(0, 4);
  const calculations = firstFourBytes.map((byte, index) => {
    const divisor = Math.pow(256, index + 1);
    const value = byte / divisor;
    return { byte, value, divisor };
  });
  const sum = calculations.reduce((acc, calc) => acc + calc.value, 0);
  const multiplierPerGame: { [key: string]: number } = {
    Limbo: 16777216, // Örnekte 16777216 kullanıldı
    Dice: 10001,
    Mines: 10001,
    ToshiTowers: 24,
    DojoDash: 16777216,
    Keno: 40,
    Roulette: 37
  };
  const multiplier = multiplierPerGame[game?.replaceAll(' ', '')] || 10001;
  const multiplied = sum * multiplier;
  const numberResult = Math.floor(multiplied);

  // Raw to Edged (sadece Limbo için)
  let rawToEdged: number | null = null;
  if (game === 'Limbo') {
    rawToEdged = (16777216 / (numberResult + 1)) * (1 - 0.01);
  }
  if (game === 'Mines') {
    rawToEdged = (25 / (numberResult + 1)) * (1 - 0.01);
  }
  if (game === 'Toshi Towers') {
    rawToEdged = (3 / (numberResult + 1)) * (1 - 0.01);
  }
  if (game === 'Keno') {
    rawToEdged = (40 / (numberResult + 1)) * (1 - 0.01);
  }
  if (game === 'Plinko') {
    rawToEdged = (16 / (numberResult + 1)) * (1 - 0.01);
  }
  if (game === 'Blackjack') {
    rawToEdged = (52 / (numberResult + 1)) * (1 - 0.01);
  }
  if (game === 'Dojo Dash') {
    rawToEdged = (16777216 / (numberResult + 1)) * (1 - 0.01);
  }
  if (game === 'Roulette') {
    rawToEdged = (37 / (numberResult + 1)) * (1 - 0.01);
  }

  return {
    hex,
    byteArray,
    decimalArray,
    byteToNumber: {
      calculations,
      sum,
      multiplied,
      numberResult,
      rawToEdged
    }
  };
}

// bytesToFloat: 4 byte'ı [0, 1) aralığında float'a çevirir
export function bytesToFloat(bytes: number[]): number {
  const intValue = (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
  return (intValue >>> 0) / Math.pow(2, 32);
}

// generateRandomFloats: Oyun tipine göre float'lar üretir
export async function generateRandomFloats(
  input: { serverSeed: string; clientSeed: string; nonce: string },
  gameType: string,
  risk: string = 'easy',
  rowsCount: number = 8,
  coinflipMode: 'manual' | 'auto'
) {
  const { serverSeed, clientSeed, nonce } = input;

  if (!serverSeed || typeof serverSeed !== 'string') {
    throw new Error('serverSeed must be a non-empty string');
  }
  if (!clientSeed || typeof clientSeed !== 'string') {
    throw new Error('clientSeed must be a non-empty string');
  }
  if (!nonce || isNaN(parseInt(nonce))) {
    throw new Error('nonce must be a valid number');
  }

  // Oyun tipine göre count belirle
  const countMap: { [key: string]: number } = {
    Dice: 1,
    Limbo: 1,
    Mines: 24,
    ToshiTowers: 8 * (risk === 'medium' ? 2 : 3),
    DojoDodge: 15,
    Keno: 10,
    Plinko: rowsCount,
    Blackjack: 52,
    Coinflip: coinflipMode === 'manual' ? 10 * 20 : 20
  };

  const count = countMap[gameType?.replaceAll(' ', '')] || 1;
  let currentCursor = 0;
  let cursorMax = 0;
  const floats: number[] = [];
  const calculations: any[] = [];

  while (floats.length < count) {
    const key = new TextEncoder().encode(serverSeed);
    const message = `${clientSeed}:${nonce}:${Math.floor(currentCursor / 8)}`;
    const msgBuffer = new TextEncoder().encode(message);

    const cryptoKey = await window.crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, [
      'sign'
    ]);

    const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, msgBuffer);
    const hashArray = Array.from(new Uint8Array(signature));
    const bytes = hashArray;

    const step = {
      cursor: currentCursor,
      message,
      hex: hashArray.map(b => b.toString(16).padStart(2, '0')).join(''),
      bytes: bytes.map(b => b.toString(10)),
      floats: []
    };

    for (let i = 0; i < bytes.length && floats.length < count; i += 4) {
      const byteGroup = bytes.slice(i, i + 4).map(b => b || 0);
      if (byteGroup.length === 4) {
        const floatValue = bytesToFloat(byteGroup);
        floats.push(floatValue);
        step.floats.push({ byteGroup, floatValue } as never);
      }
    }

    calculations.push(step);
    currentCursor += 8;
    cursorMax = Math.max(cursorMax, currentCursor - 1);
  }

  return { floats, cursorMax, calculations };
}

export const formatHeader = (title: string) => {
  return title.charAt(0).toUpperCase() + title.slice(1).replace(/-/g, ' ');
};

export const getZIndex = (id: string) => {
  if (!id) return 200;
  const parsedId = parseInt(id);
  // Her modal için benzersiz z-index değeri
  return 200 + parsedId * 10;
};

/**
 * Normalizes a string to be URL-safe by replacing spaces and dots with hyphens
 */
export const normalizeSlug = (text: string): string => {
  if (!text) return '';
  return text.toLowerCase().replaceAll(' ', '-').replaceAll('.', '-');
};

export const getGamelinkName = (game: string, provider?: string) => {
  if (provider && provider !== "Toshi's Dojo") {
    const providerSlug = normalizeSlug(provider);
    const gameSlug = normalizeSlug(game);
    return `${providerSlug}-${gameSlug}`;
  }
  return normalizeSlug(game);
};

/** URL segment may list multiple games joined with `&` (e.g. `slug=game1%26game2`). */
export const parseEncodedGameSlugList = (str: string): string[] => {
  try {
    return decodeURIComponent(str)
      .split('&')
      .map(item => item.trim())
      .filter(Boolean);
  } catch {
    return str ? [str] : [];
  }
};

export const parseGameFromSlug = (slug: string) => {
  if (!slug) {
    return { gameName: '', providerName: undefined };
  }

  const hasHyphens = slug.includes('-');
  const parts = hasHyphens ? slug.split('-') : slug.split(' ');

  if (providers && providers.length > 0) {
    const prefixCandidates = providers.flatMap(provider => {
      const prefixes = new Set<string>();

      if (provider.slug) {
        prefixes.add(provider.slug);
      }
      if (provider.filter) {
        prefixes.add(normalizeSlug(provider.filter));
      }
      if (provider.name) {
        prefixes.add(normalizeSlug(provider.name.trim()));
      }

      return [...prefixes].map(prefix => ({ provider, prefix }));
    });

    prefixCandidates.sort((a, b) => b.prefix.length - a.prefix.length);

    for (const { provider, prefix } of prefixCandidates) {
      const providerSlugParts = prefix.split('-');

      if (parts.length > providerSlugParts.length) {
        const matchesProvider = providerSlugParts.every(
          (part, index) => part?.toLowerCase() === parts[index]?.toLowerCase()
        );

        if (matchesProvider) {
          const remainingParts = parts.slice(providerSlugParts.length);
          const gameSlug = remainingParts.join('-');
          const gameNameOnly = gameSlug.replace(/-/g, ' ').trim();
          return {
            gameName: gameNameOnly,
            providerName: provider.filter || provider.name?.trim() || provider.slug
          };
        }
      }
    }
  }
  // No provider match found, treat entire slug as game name (for Toshi's Dojo games)
  // If it has hyphens, replace them with spaces; otherwise, use as is
  return {
    gameName: slug,
    providerName: undefined
  };
};

export const capitalizeGameName = (str: string) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getGameTitle = (game: string) => {
  return game?.charAt(0).toUpperCase() + game?.slice(1).replace(/-/g, ' ');
};

export const calculateBlackjackValue = async (cards: any): Promise<any> => {
  let totalValue = 0;
  let aces = 0;

  for (const card of cards) {
    const rank = card[1]; // rank is now string: 'A', '2', '3', ..., 'K'
    let value: number;

    if (rank === 'A') {
      aces += 1;
      continue;
    } else if (rank === 'J' || rank === 'Q' || rank === 'K') {
      value = 10;
    } else {
      value = parseInt(rank, 10);
    }
    await wait(250);

    totalValue += value;
  }

  let results = [totalValue];
  for (let i = 0; i < aces; i++) {
    const newPossibilities = [];
    for (const value of results) {
      newPossibilities.push(value + 1);
      newPossibilities.push(value + 11);
    }
    results = newPossibilities;
  }

  results = [...new Set(results)].filter(value => value <= 21);

  if (results.length === 0) {
    results.push(totalValue + aces);
  }

  return results;
};

export const formatGameType = (type: string) => {
  const mappings: Record<string, string> = {
    'Nolimit City': 'nolimit',
    'Pragmatic Play': 'pragmatic',
    'Pragmatic Play Live': 'pragmatic',
    'Push Gaming': 'push',
    BGaming: 'bgaming',
    '3Oaks': '3-oaks',
    AvatarUX: 'avatarux',
    BetsyGames: 'betsygames',
    GameArt: 'gameart',
    Gamomat: 'gamomat',
    PGSoft: 'pgsoft',
    'Red Rake Gaming': 'redrakegaming',
    Wazdan: 'wazdan',
    Popiplay: 'popiplay',
    Fantasma: 'fantasma',
    Live88: 'live88',
    OneTouch: 'onetouch',
    'Jade Rabbit': 'jaderabbit',
    'Evolution Gaming': 'evolution',
    hacksaw: 'hacksaw',
    'backseat gaming': 'backseatgaming',
    bullshark: 'bullsharkgames',
    '155.io': '155svg'
  };
  return mappings[type] || type.toLowerCase().replace(/\s+/g, '');
};

export const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

export const playFlip = (audioHandler: any) => {
  audioHandler.current.playSound('cardFlip');
};

export const addHoleCardIfMissing = (dealerCards: Card[]): Card[] => {
  const hasHole = dealerCards.some(c => c.isReversed);
  if (!hasHole) {
    dealerCards.push({ isReversed: true } as Card);
  }
  return dealerCards;
};
