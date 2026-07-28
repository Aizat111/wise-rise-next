import { useEffect } from 'react';

import { soundManager } from '@/core/lib/soundManager';
import { ISoundConfig } from '@/core/types/sound.types';

type TSoundsMap = Record<string, ISoundConfig>;

export const useSounds = (sounds: TSoundsMap) => {
  useEffect(() => {
    Object.entries(sounds).forEach(([key, config]) => {
      soundManager.load(key, config);
    });

    return () => {
      Object.keys(sounds).forEach(key => {
        soundManager.unload(key);
      });
    };
  }, []);

  return {
    play: (key: string, sprite?: string) => soundManager.play(key, sprite),

    stop: (key: string) => soundManager.stop(key),

    pause: (key: string) => soundManager.pause(key),

    setVolume: (volume: number) => soundManager.setVolume(volume)
  };
};
