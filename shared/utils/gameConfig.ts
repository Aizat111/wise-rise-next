'use client';

import storage from './storage';
import { KenoGameConfig } from '@/core/types/keno.types';
import { MinesGameConfig } from '@/core/types/mines.types';
import { ToshiTowersGameConfig } from '@/core/types/toshi-towers.types';

const GAME_CONFIG_KEY = 'toshi_game_config';

export const getGameConfig = (): {
  blackjack?: any;
  keno?: KenoGameConfig;
  mines?: MinesGameConfig;
  toshiTowers?: ToshiTowersGameConfig;
  dojoDash?: any;
  dice?: any;
} | null => {
  try {
    const config = storage?.getItem(GAME_CONFIG_KEY);
    return config ? JSON.parse(config) : null;
  } catch (error) {
    console.error('Error getting game config:', error);
    return null;
  }
};

export const setGameConfig = (config: {
  keno?: KenoGameConfig;
  mines?: MinesGameConfig;
  toshiTowers?: ToshiTowersGameConfig;
  dojoDash?: any;
  dice?: any;
  limbo?: any;
  blackjack?: any;
}) => {
  try {
    const existingConfig = getGameConfig() || {};
    const newConfig = { ...existingConfig, ...config };
    storage?.setItem(GAME_CONFIG_KEY, JSON.stringify(newConfig));
  } catch (error) {
    console.error('Error setting game config:', error);
  }
};
