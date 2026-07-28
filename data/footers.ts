import { PAGE } from '@/core/config/public-page.config';

export const usefulLinks = [
  { title: 'support', link: PAGE.SUPPORT, props: { prefetch: false, target: '_blank' } },
  { title: 'faqs', link: PAGE.FAQ, props: { prefetch: false, target: '_blank' } },
  { title: 'fairness', link: PAGE.FAIRNESS, props: { prefetch: false } },
  { title: 'docs', link: PAGE.DOCS, props: { prefetch: false, target: '_blank' } },
  { title: 'blog', link: PAGE.BLOGS, props: { prefetch: false, target: '_blank' } },
  {
    title: 'deposit_bonus',
    link: 'https://help.toshi.bet/en/articles/10017165-deposit-bonus-how-does-it-work',
    props: { prefetch: false, target: '_blank', rel: 'noopener noreferrer' }
  }
];

export const aboutUs = [
  { title: 'vip_program', link: PAGE.VIP, props: { prefetch: false } },
  { title: 'affiliatetext', link: PAGE.AFFILIATE, props: { prefetch: false } },
  { title: 'rewards.rewards', link: PAGE.REWARDS, props: { prefetch: false } },
  { title: 'terms_of_service', link: PAGE.USER_AGREEMENT, props: { prefetch: false } },
  { title: 'responsible_gambling.title', link: PAGE.RESPONSIBLE_GAMBLING, props: { prefetch: false } },
  { title: 'blog', link: PAGE.BLOGS, props: { prefetch: false } },
  { title: 'fairness', link: PAGE.FAIRNESS, props: { prefetch: false } }
  // { title: 'privacy_policy', link: PAGE.PRIVACY_POLICY, props: { prefetch: true } },
  // { title: 'anti_money_laundering', link: PAGE.ANTI_MONEY_LAUNDERING, props: { prefetch: true } }
];

export const communities = [
  {
    title: 'Discord',
    link: 'https://discord.gg/toshibet',
    props: { prefetch: false, target: '_blank', rel: 'noopener noreferrer' }
  },
  {
    title: 'Twitter / X',
    link: 'https://x.com/toshibet',
    props: { prefetch: false, target: '_blank', rel: 'noopener noreferrer' }
  },
  {
    title: 'Instagram',
    link: 'https://instagram.com/toshibetofficial',
    props: { prefetch: false, target: '_blank', rel: 'noopener noreferrer' }
  }
];

export const games = [
  { title: 'Slots', link: `${PAGE.CASINO}/slots`, props: { prefetch: false } },
  { title: 'Bonus Buys', link: `${PAGE.CASINO}/bonus-buy`, props: { prefetch: false } },
  { title: 'Challenges', link: `${PAGE.CASINO}/challenges`, props: { prefetch: false } },
  { title: 'Favourites', link: `${PAGE.CASINO}/favourites`, props: { prefetch: false } },
  { title: 'Providers', link: `${PAGE.PROVIDERS}`, props: { prefetch: false } },
  { title: 'Live Casino', link: `${PAGE.CASINO}/live-casino`, props: { prefetch: false } }
];

export const toshiDojo = [
  { title: 'Blackjack', link: PAGE.CASINO_GAME('blackjack'), props: { prefetch: false } },
  { title: 'Mines', link: PAGE.CASINO_GAME('mines'), props: { prefetch: false } },
  { title: 'Dice', link: PAGE.CASINO_GAME('dice'), props: { prefetch: false } },
  { title: 'Limbo', link: PAGE.CASINO_GAME('limbo'), props: { prefetch: false } },

  { title: 'Keno', link: PAGE.CASINO_GAME('keno'), props: { prefetch: false } }
];

export const currencies = [
  { title: 'Solana', link: '?modal=deposit&currency=SOL', props: { prefetch: false } },
  { title: 'Bitcoin', link: '?modal=deposit&currency=BTC', props: { prefetch: false } },
  { title: 'Ethereum', link: '?modal=deposit&currency=ETH', props: { prefetch: false } },
  { title: 'Litecoin', link: '?modal=deposit&currency=LTC', props: { prefetch: false } },
  { title: 'Tether', link: '?modal=deposit&currency=USDT', props: { prefetch: false } },
  { title: 'USDC', link: '?modal=deposit&currency=USDC', props: { prefetch: false } },
  { title: 'Dogecoin', link: '?modal=deposit&currency=DOGE', props: { prefetch: false } },
  { title: 'Ripple', link: '?modal=deposit&currency=XRP', props: { prefetch: false } },
  { title: 'Binance Coin', link: '?modal=deposit&currency=BNB', props: { prefetch: false } },
  { title: 'Avalanche', link: '?modal=deposit&currency=AVAX', props: { prefetch: false } },
  { title: 'TON', link: '?modal=deposit&currency=TON', props: { prefetch: false } }
];

export const cryptoIcons = [
  { symbol: '/assets/currencies/solana.svg', name: 'Solana', title: 'SOL', description: 'Solana' },
  { symbol: '/assets/svgs/crypto/btc.svg', name: 'Bitcoin', title: 'BTC', description: 'Bitcoin' },
  { symbol: '/assets/svgs/crypto/usdt.svg', name: 'Tether', title: 'USDT', description: 'Tether' },
  { symbol: '/assets/svgs/crypto/usdc.svg', name: 'USDC', title: 'USDC', description: 'USDC' },
  { symbol: '/assets/svgs/crypto/eth.svg', name: 'Ethereum', title: 'ETH', description: 'Ethereum' },
  { symbol: '/assets/svgs/crypto/doge.svg', name: 'Dogecoin', title: 'DOGE', description: 'Dogecoin' },
  { symbol: '/assets/currencies/xrp.svg', name: 'XRP', title: 'XRP', description: 'Ripple' },
  { symbol: '/assets/svgs/crypto/ltc.svg', name: 'Litecoin', title: 'LTC', description: 'Litecoin' }
  // { symbol: '/assets/svgs/crypto/bch.svg', name: 'Bitcoin Cash', title: 'BCH', description: 'Bitcoin Cash' }
];
