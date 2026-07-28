import type { SwitchItem } from '@/shared/ui/switch';

export const loginItems: SwitchItem[] = [
  { id: 'login', label: 'login', value: 'login' },
  { id: 'register', label: 'register', value: 'register' }
];

export const modalDepositTypeItems: SwitchItem[] = [
  { id: 'deposit', label: 'deposit_modal.crypto_deposit', value: 'deposit' },
  { id: 'buycrypto', label: 'buycrypto', value: 'buycrypto' }
];

export const modalWithdrawalTypeItems: SwitchItem[] = [{ id: 'withdraw', label: 'withdraw', value: 'withdraw' }];

export const modalVaultTypeItems: SwitchItem[] = [
  { id: 'deposit', label: 'deposit', value: 'deposit' },
  { id: 'buycrypto', label: 'withdraw', value: 'withdraw' }
];

export const gameBetsTypeItems: SwitchItem[] = [
  { id: 'mybets', label: 'my_bets', value: 'mybets' },
  { id: 'allbets', label: 'all_bets', value: 'allbets' },
  { id: 'highrollers', label: 'high_rollers', value: 'highrollers' },
  { id: 'raceleaderboard', label: 'race_leaderboard', value: 'raceleaderboard' }
];

export const betTypeItems: SwitchItem[] = [
  { id: 'bet', label: 'bet', value: 'bet' },
  { id: 'fairness', label: 'fairness', value: 'fairness' }
];

export const autoPlayItems: SwitchItem[] = [
  { id: 'manual', label: 'manual', value: 'manual' },
  { id: 'auto', label: 'auto', value: 'auto' }
];

export const levelsItems: SwitchItem[] = [
  { id: 'easy', label: 'towers.easy', value: 'easy' },
  { id: 'medium', label: 'towers.medium', value: 'medium' },
  { id: 'hard', label: 'towers.hard', value: 'hard' }
];

export const gameDescriptionTypeItems: SwitchItem[] = [
  { id: 'description', label: 'description', value: 'description' },
  { id: 'big-wins', label: 'big_wins', value: 'big-wins' },
  { id: 'lucky_wins', label: 'lucky_wins', value: 'lucky_wins' },

  { id: 'challenges', label: 'challenges', value: 'challenges' }
];
