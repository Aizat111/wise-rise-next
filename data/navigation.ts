import { ElementType } from 'react';

import { PAGE } from '@/core/config/public-page.config';
import { openModal } from '@/core/redux-toolkit/slices/modalSlice';
import { store } from '@/core/redux-toolkit/store';
import type { ISidebarItem } from '@/core/types/sidebar.types';

export const SIDEBAR_DATA: ISidebarItem[] = [
  {
    icon: 'asset/sidebar/Gold',
    label: 'farming_dashboard',
    link: PAGE.FARMING
  },
  {
    icon: 'asset/sidebar/Casino',
    label: 'casino',
    link: PAGE.CASINO,
    children: [
      {
        icon: 'asset/navigationbar/Dojo',
        label: 'toshi_dojo',
        link: PAGE.TOSHI_DOJO
      },
      {
        icon: 'asset/navigationbar/Newreleases',
        label: 'new_releases',
        link: PAGE.NEW_RELEASES
      },
      {
        icon: 'asset/navigationbar/Slotssidebar',
        label: 'slots',
        link: PAGE.SLOTS
      },
      {
        icon: 'asset/navigationbar/Bonusbuys',
        label: 'bonus_buyer',
        link: PAGE.BONUS_BUY
      },
      {
        icon: 'asset/navigationbar/Livecasino',
        label: 'live',
        link: PAGE.LIVE_CASINO
      },
      {
        icon: 'asset/navigationbar/Challenges',
        label: 'challenges',
        link: PAGE.CHALLENGES
      },
      {
        icon: 'asset/navigationbar/Favourites',
        label: 'favourites',
        link: PAGE.FAVORITES
      },
      {
        icon: 'asset/navigationbar/Recently',
        label: 'recently_played',
        link: PAGE.RECENTLY_PLAYED
      },
      {
        icon: 'asset/navigationbar/Providers',
        label: 'providers',
        link: PAGE.PROVIDERS
      }
    ]
  },
  {
    icon: 'asset/sidebar/Sports',
    label: 'sports',
    link: PAGE.SPORTS
  },
  {
    icon: 'asset/sidebar/Lms',
    label: 'last_man_standing_sidebar',
    link: PAGE.LAST_MAN_STANDING
  },
  {
    icon: 'asset/sidebar/Football',
    label: 'world_cup_hub_sidebar',
    link: PAGE.WORLD_CUP
  },
  {
    icon: 'asset/sidebar/Football',
    label: 'predict_sidebar',
    link: PAGE.PREDICT
  },
  {
    icon: 'asset/sidebar/Rewards',
    label: 'rewards.rewards',
    link: PAGE.REWARDS,
    isBottomBorder: true
  },
  {
    // Streaks — opens the StreaksModal imperatively without changing the
    // URL. Mirrors the raw-onClick pattern used by `livesupport` above.
    // Deep-link entry via /streaks still works (see StreaksModal +
    // ModalManager.handleCloseModal); this sidebar entry preserves the
    // current page context so the close-handler returns the user where
    // they were rather than routing them to HOME.
    icon: 'asset/sidebar/Streaks',
    label: 'streaks_sidebar',
    onClick: () => {
      store.dispatch(openModal({ modalName: 'streaks', type: 'default', props: {} }));
    }
  },
  {
    icon: 'asset/sidebar/Raffle',
    label: 'raffle_title',
    link: PAGE.RAFFLE
  },
  {
    icon: 'asset/sidebar/Affiliate',
    label: 'affiliatetext',
    link: PAGE.AFFILIATE
  },
  {
    icon: 'asset/sidebar/Vipside',
    label: 'viptext',
    link: PAGE.VIP
  },
  {
    icon: 'asset/sidebar/Language',
    label: 'language',
    isBottomBorder: true,
    children: [
      {
        language: 'tr',
        label: 'Türkçe',
        icon: 'asset/sidebar/Language'
      },
      {
        language: 'az',
        label: 'Azərbaycan',
        icon: 'asset/sidebar/Language'
      }
    ]
  },
  {
    icon: 'asset/sidebar/Support',
    label: 'livesupport',
    onClick: () => {
      if (typeof window !== 'undefined') {
        window.Intercom?.('show');
      }
    }
  },
  {
    icon: 'asset/sidebar/Blog',
    label: 'blog',
    link: PAGE.BLOGS
  }
];

export const MOBILE_SIDEBAR_DATA: ISidebarItem[] = [
  {
    icon: 'asset/sidebar/Gold',
    label: 'farming_dashboard',
    link: PAGE.FARMING
  },
  {
    icon: 'asset/sidebar/Casino',
    label: 'casino',
    link: PAGE.CASINO,
    children: [
      {
        icon: 'asset/navigationbar/Dojo',
        label: 'toshi_dojo',
        link: PAGE.CASINO
      },
      {
        icon: 'asset/navigationbar/Newreleases',
        label: 'new_releases',
        link: PAGE.NEW_RELEASES
      },
      {
        icon: 'asset/navigationbar/Slotssidebar',
        label: 'slots',
        link: PAGE.SLOTS
      },
      {
        icon: 'asset/navigationbar/Bonusbuys',
        label: 'bonus_buyer',
        link: PAGE.BONUS_BUY
      },
      {
        icon: 'asset/navigationbar/Livecasino',
        label: 'live',
        link: PAGE.LIVE_CASINO
      },
      {
        icon: 'asset/navigationbar/Challenges',
        label: 'challenges',
        link: PAGE.CHALLENGES
      },
      {
        icon: 'asset/navigationbar/Favourites',
        label: 'favourites',
        link: PAGE.FAVORITES
      },
      {
        icon: 'asset/navigationbar/Recently',
        label: 'recently_played',
        link: PAGE.RECENTLY_PLAYED
      },
      {
        icon: 'asset/navigationbar/Providers',
        label: 'providers',
        link: PAGE.PROVIDERS
      }
    ]
  },
  {
    icon: 'asset/sidebar/Sports',
    label: 'sports',
    link: PAGE.SPORTS
  },
  {
    icon: 'asset/sidebar/Lms',
    label: 'last_man_standing_sidebar_mobile',
    link: PAGE.LAST_MAN_STANDING
  },
  {
    icon: 'asset/sidebar/Football',
    label: 'world_cup_hub_sidebar',
    link: PAGE.WORLD_CUP
  },
  {
    icon: 'asset/sidebar/Football',
    label: 'predict_sidebar',
    link: PAGE.PREDICT
  },
  {
    icon: 'asset/sidebar/Rewards',
    label: 'rewards.rewards',
    link: PAGE.REWARDS,
    isBottomBorder: true
  },
  {
    // Streaks — mirrors SIDEBAR_DATA. Opens the StreaksModal imperatively
    // via store.dispatch so the URL stays put and the close-handler
    // returns the user to the page they were on.
    icon: 'asset/sidebar/Streaks',
    label: 'streaks_sidebar',
    onClick: () => {
      store.dispatch(openModal({ modalName: 'streaks', type: 'default', props: {} }));
    }
  },
  {
    icon: 'asset/sidebar/Raffle',
    label: 'raffle_title',
    link: PAGE.RAFFLE
  },
  {
    icon: 'asset/sidebar/Affiliate',
    label: 'affiliatetext',
    link: PAGE.AFFILIATE
  },
  {
    icon: 'asset/sidebar/Vipside',
    label: 'viptext',
    link: PAGE.VIP
  },
  {
    icon: 'asset/sidebar/Language',
    label: 'language',
    isBottomBorder: true,
    children: [
      {
        language: 'tr',
        label: 'Türkçe',
        icon: 'asset/sidebar/Language'
      },
      {
        language: 'az',
        label: 'Azərbaycan',
        icon: 'asset/sidebar/Language'
      }
    ]
  },
  {
    icon: 'asset/sidebar/Support',
    label: 'livesupport',
    onClick: () => {
      if (typeof window !== 'undefined') {
        window.Intercom?.('show');
      }
    }
  },
  {
    icon: 'asset/sidebar/Blog',
    label: 'blog',
    link: PAGE.BLOGS
  }
];

export const SIDEBAR_DATA_CASINO: ISidebarItem[] = [
  {
    icon: 'asset/sidebar/Casino',
    label: 'casino',
    link: PAGE.CASINO
  },
  {
    icon: 'asset/sidebar/Sports',
    label: 'sports',
    link: PAGE.SPORTS
  },
  {
    icon: 'asset/sidebar/Lms',
    label: 'last_man_standing_sidebar',
    link: PAGE.LAST_MAN_STANDING
  },
  {
    icon: 'asset/sidebar/Football',
    label: 'world_cup_hub_sidebar',
    link: PAGE.WORLD_CUP
  }
];

export const getBottomNavigationData = (depositCurrency: string = 'SOL'): ISidebarItem[] => {
  return [
    {
      icon: 'asset/footer/Browse',
      label: 'browser',
      action: {
        type: 'open_modal',
        modal: 'depositCurrency',
        modalProps: {
          title: 'deposit',
          currency: 'SOL'
        }
      }
    },
    {
      icon: 'asset/footer/Casino',
      label: 'casino',
      link: PAGE.CASINO
    },
    {
      icon: 'asset/footer/Wallet',
      label: 'deposit',
      link: `?modal=deposit&currency=${depositCurrency}`
    },
    {
      icon: 'asset/footer/Sports',
      label: 'sports',
      link: PAGE.SPORTS
    },
    {
      icon: 'asset/footer/Chat',
      label: 'chats',
      link: PAGE.CHATS
    }
  ];
};

export const CASINO_HOME_NAVIGATION_DATA: {
  id: string;
  title: string;
  isActiveUrl: string;
  icon?: ElementType | string;
}[] = [
  { id: '', title: 'lobby', isActiveUrl: '', icon: 'asset/sidebar/Casino' },
  { id: 'toshis-dojo', title: 'toshi_dojo', isActiveUrl: 'toshis-dojo', icon: 'asset/navigationbar/Dojo' },
  { id: 'slots', title: 'slots', isActiveUrl: 'slots', icon: 'asset/navigationbar/Slotssidebar' },
  { id: 'live-casino', title: 'live_casino', isActiveUrl: 'live-casino', icon: 'asset/navigationbar/Livecasino' },
  { id: 'bonus-buy', title: 'bonus_buys', isActiveUrl: 'bonus-buy', icon: 'asset/navigationbar/Bonusbuys' },
  { id: 'providers', title: 'providers', isActiveUrl: 'providers', icon: 'asset/navigationbar/Providers' }
];

export const CASINO_NAVIGATION_DATA: { id: string; title: string; isActiveUrl: string; icon?: ElementType | string }[] =
  [
    // { id: 'deposit', title: 'deposit', isActiveUrl: 'deposit' },
    { id: 'new-releases', title: 'new_releases', isActiveUrl: 'new-releases', icon: 'asset/navigationbar/Newreleases' },
    { id: 'toshis-dojo', title: 'toshi_dojo', isActiveUrl: 'toshis-dojo', icon: 'asset/navigationbar/Dojo' },
    { id: 'slots', title: 'slots', isActiveUrl: 'slots', icon: 'asset/navigationbar/Slotssidebar' },
    { id: 'bonus-buy', title: 'bonus_buys', isActiveUrl: 'bonus-buy', icon: 'asset/navigationbar/Bonusbuys' },
    { id: 'live-casino', title: 'live_casino', isActiveUrl: 'live-casino', icon: 'asset/navigationbar/Livecasino' },
    // { id: 'challenges', title: 'challenges', isActiveUrl: 'challenges' },
    { id: 'favourites', title: 'favourites', isActiveUrl: 'favourites', icon: 'asset/navigationbar/Favourites' },
    { id: 'providers', title: 'providers', isActiveUrl: 'providers', icon: 'asset/navigationbar/Providers' }
  ];

export const HOME_NAVIGATION_DATA: { id: string; title: string; isActiveUrl: string; icon?: ElementType | string }[] = [
  // { id: 'deposit', title: 'deposit', isActiveUrl: 'deposit' },
  { id: 'home', title: 'home_text', isActiveUrl: '', icon: 'asset/sidebar/Casino' },
  { id: 'new-releases', title: 'new_releases', isActiveUrl: 'new_releases', icon: 'asset/navigationbar/Newreleases' },
  { id: 'toshis-dojo', title: 'toshi_dojo', isActiveUrl: 'toshis-dojo', icon: 'asset/navigationbar/Dojo' },
  { id: 'slots', title: 'slots', isActiveUrl: 'slots', icon: 'asset/navigationbar/Slotssidebar' },
  { id: 'bonus-buy', title: 'bonus_buys', isActiveUrl: 'bonus-buy', icon: 'asset/navigationbar/Bonusbuys' },
  { id: 'live-casino', title: 'live_casino', isActiveUrl: 'live-casino', icon: 'asset/navigationbar/Livecasino' },
  // { id: 'challenges', title: 'challenges', isActiveUrl: 'challenges' },
  { id: 'favourites', title: 'favourites', isActiveUrl: 'favourites', icon: 'asset/navigationbar/Favourites' },
  { id: 'providers', title: 'providers', isActiveUrl: 'providers', icon: 'asset/navigationbar/Providers' }
];
