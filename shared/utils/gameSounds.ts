import { ISoundConfig } from '@/types/sound.types';

export const SHARED_SOUNDS: Record<string, ISoundConfig> = {
  click: {
    src: '/assets/sounds/click1.wav',
    volume: 0.35
  },
  changeMode: {
    src: '/assets/sounds/changeMode.mp3',
    volume: 0.35
  }
};

export const BLACKJACK_SOUNDS: Record<string, ISoundConfig> = {
  ...SHARED_SOUNDS,
  cardFlip: {
    src: '/assets/games/blackjack/card2.wav',
    volume: 0.35
  }
};

export const ROULETTE_SOUNDS: Record<string, ISoundConfig> = {
  ...SHARED_SOUNDS,
  spin: {
    src: '/assets/sounds/roulette/spin.mp3',
    volume: 0.35
  },
  bounce: {
    src: '/assets/sounds/roulette/bounce.mp3',
    volume: 0.35
  },
  win: {
    src: '/assets/sounds/roulette/win.mp3',
    volume: 0.35
  }
};

export const BACCARAT_SOUNDS: Record<string, ISoundConfig> = {
  ...SHARED_SOUNDS,
  cardFlip: {
    src: '/assets/games/blackjack/card2.wav',
    volume: 0.35
  }
};

export const DICE_SOUNDS: Record<string, ISoundConfig> = {
  ...SHARED_SOUNDS,
  kenoSound: {
    src: '/assets/games/keno/sfx/kenoClickSound.mp3',
    volume: 0.35
  },
  kenoRevealSound: {
    src: '/assets/games/keno/sfx/tick2.mp3',
    volume: 0.35
  }
};

// Plinko, Limbo, Keno-style (click, changeMode + keno sounds)
const KENO_STYLE_SOUNDS: Record<string, ISoundConfig> = {
  ...SHARED_SOUNDS,
  kenoSound: {
    src: '/assets/games/keno/sfx/kenoClickSound.mp3',
    volume: 0.35
  },
  kenoRevealSound: {
    src: '/assets/games/keno/sfx/tick2.mp3',
    volume: 0.35
  },
  kenoWinSound: {
    src: '/assets/games/keno/sfx/winSound.mp3',
    volume: 0.35
  }
};

export const PLINKO_SOUNDS: Record<string, ISoundConfig> = { ...KENO_STYLE_SOUNDS };

export const KENO_SOUNDS: Record<string, ISoundConfig> = { ...KENO_STYLE_SOUNDS };

export const LIMBO_SOUNDS: Record<string, ISoundConfig> = {
  ...SHARED_SOUNDS,
  kenoSound: {
    src: '/assets/games/keno/sfx/kenoClickSound.mp3',
    volume: 0.35
  },
  kenoRevealSound: {
    src: '/assets/games/keno/sfx/tick2.mp3',
    volume: 0.35
  }
};

export const MINES_SOUNDS: Record<string, ISoundConfig> = {
  ...KENO_STYLE_SOUNDS,
  minesSound: {
    src: '/assets/games/keno/sfx/kenoClickSound.mp3',
    volume: 0.35
  }
};

export const TOSHI_TOWERS_SOUNDS: Record<string, ISoundConfig> = {
  ...SHARED_SOUNDS,
  towersSound: {
    src: '/assets/sounds/tile.mp3',
    volume: 0.35
  },
  towersWinSound: {
    src: '/assets/sounds/success1.mp3',
    volume: 0.35
  },
  towersLoseSound: {
    src: '/assets/sounds/fail1.mp3',
    volume: 0.35
  }
};

export const VIDEO_POKER_SOUNDS: Record<string, ISoundConfig> = {
  ...SHARED_SOUNDS,
  cardFlip: {
    src: '/assets/games/blackjack/card2.wav',
    volume: 0.35
  }
};

export const DEPORT_DASH_SOUNDS: Record<string, ISoundConfig> = {
  ...SHARED_SOUNDS,
  bgm: {
    src: '/assets/games/deport-dash/audio/DJ-Eezy-Ice-Ice-Baby-Instrumenta-[AudioTrimmer.com].ogg',
    volume: 0.35,
    loop: true
  }
};
