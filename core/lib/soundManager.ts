import { Howl } from 'howler';

import { ISoundConfig } from '@/types/sound.types';

class SoundManager {
  private sounds = new Map<string, Howl>();
  private globalVolume = 1;

  load(key: string, config: ISoundConfig) {
    if (this.sounds.has(key)) return;

    const sound = new Howl({
      src: [config.src],
      volume: config.volume ?? this.globalVolume,
      sprite: config.sprite,
      loop: config.loop ?? false,
      preload: true
    });

    this.sounds.set(key, sound);
  }

  play(key: string, sprite?: string) {
    const sound = this.sounds.get(key);
    if (!sound) return;
    if (sprite) {
      sound.play(sprite);
    } else {
      sound.play();
    }
  }

  stop(key: string) {
    this.sounds.get(key)?.stop();
  }

  pause(key: string) {
    this.sounds.get(key)?.pause();
  }

  setVolume(volume: number) {
    this.globalVolume = volume;
    this.sounds.forEach(s => s.volume(volume));
  }

  unload(key: string) {
    this.sounds.get(key)?.unload();
    this.sounds.delete(key);
  }
}

export const soundManager = new SoundManager();
