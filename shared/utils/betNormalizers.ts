// Utility to safely parse numbers
const num = (value: string) => {
  const n = parseFloat(value);
  return isNaN(n) ? 0 : n;
};

// Game-specific mapping configs
const gameNormalizers = {
  plinko: (p: any) => ({
    game_id: p.game_id,
    bet: num(p.bet),
    credits_won: num(p.win),
    multiplierValue: num(p.multiplier)
  }),
  hacksaw: (p: any) => ({
    bet: num(p.bet),
    credits_won: num(p.win)
  }),
  mines: (p: any) => ({
    bet: num(p.bet),
    credits_won: num(p.win)
  }),
  limbo: (p: any) => ({
    bet: num(p.bet),
    credits_won: num(p.win)
  }),
  keno: (p: any) => ({
    bet: num(p.bet),
    credits_won: num(p.win)
  }),
  towers: (p: any) => ({
    bet: num(p.bet),
    credits_won: num(p.win)
  }),
  hub88: (p: any) => ({
    bet: num(p.bet),
    credits_won: num(p.win)
  }),
  dice: (p: any) => ({
    bet: num(p.bet),
    credits_won: num(p.win)
  }),
  hilo: (p: any) => ({
    bet: num(p.bet),
    credits_won: num(p.win)
  }),
  videopoker: (p: any) => ({
    bet: num(p.bet),
    credits_won: num(p.win)
  }),
  wheel: (p: any) => ({
    bet: num(p.bet),
    credits_won: num(p.win),
    multiplierValue: num(p.data?.multiplier ?? p.multiplier)
  }),
  dojodash: (p: any) => ({
    bet: num(p.bet),
    credits_won: num(p.win)
  }),
  blackjack: (p: any) => ({
    bet: num(p.bet),
    credits_won: num(p.win)
  }),
  roulette: (p: any) => ({
    bet: num(p.bet),
    credits_won: num(p.win),
    multiplierValue: num(p.multiplierValue)
  }),
  baccarat: (p: any) => ({
    bet: num(p.bet),
    credits_won: num(p.win)
  })
};

// Main payload normalizer
export const normalizeBetPayload = (payload: any) => {
  const { gameType } = payload;
  const normalizer = gameNormalizers[gameType as keyof typeof gameNormalizers];

  if (!normalizer) {
    return {
      game_id: payload.game_id,
      bet: num(payload.bet),
      credits_won: num(payload.credits_won),
      multiplierValue: num(payload.multiplierValue),
      gameType
    };
  }

  return {
    ...normalizer(payload),
    gameType
  };
};
