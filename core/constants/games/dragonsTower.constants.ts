export type DragonsTowerDifficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'master';

export type DragonsTowerRowConfig = {
  columns: number;
  eggs: number;
};

export const DRAGONS_TOWER_DIFFICULTIES: DragonsTowerDifficulty[] = ['easy', 'medium', 'hard', 'expert', 'master'];

export const DRAGONS_TOWER_CONFIG = {
  rows: 9,
  maxColumns: 4,
  rowConfigs: {
    easy: { columns: 4, eggs: 3 },
    medium: { columns: 3, eggs: 2 },
    hard: { columns: 2, eggs: 1 },
    expert: { columns: 3, eggs: 1 },
    master: { columns: 4, eggs: 1 }
  } as Record<DragonsTowerDifficulty, DragonsTowerRowConfig>,
  rtp: 0.98,
  multipliers: {
    easy: [1.31, 1.74, 2.32, 3.1, 4.13, 5.51, 7.34, 9.79, 13.05],
    medium: [1.47, 2.21, 3.31, 4.96, 7.44, 11.16, 16.74, 25.12, 37.67],
    hard: [1.96, 3.92, 7.84, 15.68, 31.36, 62.72, 125.44, 250.88, 501.76],
    expert: [2.94, 8.82, 26.46, 79.38, 238.14, 714.42, 2143.26, 6429.78, 19289.34],
    master: [3.92, 15.68, 62.72, 250.88, 1003.52, 4014.08, 16056.32, 64225.28, 256901.12]
  },
  levelLimits: {
    easy: 9,
    medium: 9,
    hard: 6,
    expert: 4,
    master: 3
  } as Record<DragonsTowerDifficulty, number>
} as const;

export const DEFAULT_DRAGONS_TOWER_DIFFICULTY: DragonsTowerDifficulty = 'easy';

export const normalizeDragonsTowerDifficulty = (value?: string | null): DragonsTowerDifficulty => {
  if (!value) return DEFAULT_DRAGONS_TOWER_DIFFICULTY;
  const normalized = value.toLowerCase() as DragonsTowerDifficulty;
  return DRAGONS_TOWER_DIFFICULTIES.includes(normalized) ? normalized : DEFAULT_DRAGONS_TOWER_DIFFICULTY;
};

export const getDragonsTowerRowConfig = (difficulty?: string | DragonsTowerDifficulty | null) => {
  const normalized = normalizeDragonsTowerDifficulty(
    typeof difficulty === 'string' ? difficulty : DEFAULT_DRAGONS_TOWER_DIFFICULTY
  );
  return DRAGONS_TOWER_CONFIG.rowConfigs[normalized];
};

export const getDragonsTowerLevelLimit = (difficulty?: string | DragonsTowerDifficulty | null) => {
  const normalized = normalizeDragonsTowerDifficulty(
    typeof difficulty === 'string' ? difficulty : DEFAULT_DRAGONS_TOWER_DIFFICULTY
  );
  return DRAGONS_TOWER_CONFIG.levelLimits[normalized];
};
