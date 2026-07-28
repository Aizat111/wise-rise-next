export const links = {
  //[image used in the available prizes page, image used in the box roll]
  freeSportBet5: '/assets/games/coupon-cases/placeholder.png',
  freeSpins5: '/assets/games/coupon-cases/hacksaww.png',
  coupon: '/assets/games/coupon-cases/coupon.png',
  toshiGold1k: '/assets/games/coupon-cases/gold.png',
  toshiGold10k: '/assets/games/coupon-cases/gold.png',
  toshiSilver1k: '/assets/games/coupon-cases/toshiSilver.png',
  toshiSilver10k: '/assets/games/coupon-cases/toshiSilver.png',
  freeSpins1: '/assets/games/coupon-cases/hacksaww.png',
  freeSportBet1: '/assets/games/coupon-cases/placeholder.png',

  freeSportBet: '/assets/games/coupon-cases/placeholder.png',
  freeSpins: '/assets/games/coupon-cases/hacksaww.png',
  emptyBox: '/assets/games/coupon-cases/emptyBox.png',
  toshiGold: '/assets/games/coupon-cases/gold.png'
};

export type CaseChance = {
  name: string;
  title: string;
  chance: number;
  category: string;
  value: string;
  property?: string;
  amount?: number;
  code?: string;
  nbRounds?: number;
};

export type Case = {
  id: number;
  name: string;
  title: string;
  category: string;
  value: string;
};

export const chances = {
  easy: [
    {
      name: 'freeSpins',
      title: 'Hacksaw Free Spins',
      value: '0.20',
      amount: 0.2,
      chance: 0.003,
      category: 'Casino',
      nbRounds: 50,
      property: 'free_spin'
    },
    {
      name: 'freeSpins',
      title: 'Hacksaw Free Spins',
      value: '0.20',
      amount: 0.2,
      chance: 0.03,
      category: 'Casino',
      nbRounds: 5,
      property: 'free_spin'
    },

    {
      name: 'freeSpins',
      title: 'Hacksaw Free Spins',
      value: '0.20',
      amount: 0.2,
      chance: 0.08,
      category: 'Casino',
      nbRounds: 3,
      property: 'free_spin'
    },
    {
      name: 'toshiGold',
      title: 'Toshi Gold',
      value: '2,500',
      amount: 2500,
      chance: 0.1,
      category: 'Casino',
      property: 'toshi_gold'
    },

    {
      name: 'toshiGold',
      title: 'Toshi Gold',
      value: '1,000',
      amount: 1000,
      chance: 0.2,
      category: 'Casino',
      property: 'toshi_gold'
    },

    {
      name: 'toshiGold',
      title: 'Toshi Gold',
      value: '100',
      amount: 100,
      chance: 0.4,
      category: 'Casino',
      property: 'toshi_gold'
    },

    {
      name: 'emptyBox',
      title: 'Empty Box',
      value: '0',
      chance: 0.187,
      category: 'Casino',
      property: 'empty_box'
    }
  ]
};
