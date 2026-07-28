'use client';

import type { ComponentType } from 'react';

// Footer icons
import FooterBrowse from '@/shared/assets/footer/Browse';
import FooterCasino from '@/shared/assets/footer/Casino';
import FooterChat from '@/shared/assets/footer/Chat';
import FooterSports from '@/shared/assets/footer/Sports';
import FooterWallet from '@/shared/assets/footer/Wallet';
// Navigation bar icons
import NavigationBonusbuys from '@/shared/assets/navigationbar/Bonusbuys';
import NavigationChallenges from '@/shared/assets/navigationbar/Challenges';
import NavigationDojo from '@/shared/assets/navigationbar/Dojo';
import NavigationFavourites from '@/shared/assets/navigationbar/Favourites';
import NavigationLivecasino from '@/shared/assets/navigationbar/Livecasino';
import NavigationNewreleases from '@/shared/assets/navigationbar/Newreleases';
import NavigationProviders from '@/shared/assets/navigationbar/Providers';
import NavigationRecently from '@/shared/assets/navigationbar/Recently';
import NavigationSlotssidebar from '@/shared/assets/navigationbar/Slotssidebar';
// Statically import all icons so they render on the initial HTML (no client pop-in)
// Sidebar icons
import SidebarAffiliate from '@/shared/assets/sidebar/Affiliate';
import SidebarBlog from '@/shared/assets/sidebar/Blog';
import SidebarBonusbuys from '@/shared/assets/sidebar/Bonusbuys';
import SidebarCasino from '@/shared/assets/sidebar/Casino';
import SidebarChallenges from '@/shared/assets/sidebar/Challenges';
import SidebarDojo from '@/shared/assets/sidebar/Dojo';
import SidebarFavourites from '@/shared/assets/sidebar/Favourites';
import SidebarFootball from '@/shared/assets/sidebar/Football';
import SidebarGold from '@/shared/assets/sidebar/Gold';
import SidebarLanguage from '@/shared/assets/sidebar/Language';
import SidebarLivecasino from '@/shared/assets/sidebar/Livecasino';
import SidebarLms from '@/shared/assets/sidebar/Lms';
import SidebarNewreleases from '@/shared/assets/sidebar/Newreleases';
import SidebarProviders from '@/shared/assets/sidebar/Providers';
import SidebarRaffle from '@/shared/assets/sidebar/Raffle';
import SidebarRewards from '@/shared/assets/sidebar/Rewards';
import SidebarSlotssidebar from '@/shared/assets/sidebar/Slotssidebar';
import SidebarSports from '@/shared/assets/sidebar/Sports';
import SidebarStreaks from '@/shared/assets/sidebar/Streaks';
import SidebarSupport from '@/shared/assets/sidebar/Support';
import SidebarVipside from '@/shared/assets/sidebar/Vipside';

export type AppIconName = `asset/sidebar/${string}` | `asset/navigationbar/${string}` | `asset/footer/${string}`;

type IconProps = { className?: string };

const Placeholder = ({ className }: IconProps) => (
  <span className={className} aria-hidden="true" style={{ display: 'inline-block' }} />
);

// Note: import *individual* files (not barrel indexes) to avoid pulling all icons into one chunk.
const ICONS: Record<string, ComponentType<IconProps>> = {
  // sidebar
  'asset/sidebar/Gold': SidebarGold,
  'asset/sidebar/Casino': SidebarCasino,
  'asset/sidebar/Football': SidebarFootball,
  'asset/sidebar/Sports': SidebarSports,
  'asset/sidebar/Rewards': SidebarRewards,
  'asset/sidebar/Raffle': SidebarRaffle,
  'asset/sidebar/Affiliate': SidebarAffiliate,
  'asset/sidebar/Vipside': SidebarVipside,
  'asset/sidebar/Language': SidebarLanguage,
  'asset/sidebar/Support': SidebarSupport,
  'asset/sidebar/Dojo': SidebarDojo,
  'asset/sidebar/Newreleases': SidebarNewreleases,
  'asset/sidebar/Slotssidebar': SidebarSlotssidebar,
  'asset/sidebar/Bonusbuys': SidebarBonusbuys,
  'asset/sidebar/Livecasino': SidebarLivecasino,
  'asset/sidebar/Challenges': SidebarChallenges,
  'asset/sidebar/Favourites': SidebarFavourites,
  'asset/sidebar/Recently': NavigationRecently,
  'asset/sidebar/Providers': SidebarProviders,
  'asset/sidebar/Lms': SidebarLms,
  'asset/sidebar/Blog': SidebarBlog,
  'asset/sidebar/Streaks': SidebarStreaks,

  // navigationbar
  'asset/navigationbar/Dojo': NavigationDojo,
  'asset/navigationbar/Newreleases': NavigationNewreleases,
  'asset/navigationbar/Slotssidebar': NavigationSlotssidebar,
  'asset/navigationbar/Bonusbuys': NavigationBonusbuys,
  'asset/navigationbar/Livecasino': NavigationLivecasino,
  'asset/navigationbar/Challenges': NavigationChallenges,
  'asset/navigationbar/Favourites': NavigationFavourites,
  'asset/navigationbar/Recently': NavigationRecently,
  'asset/navigationbar/Providers': NavigationProviders,

  // footer
  'asset/footer/Browse': FooterBrowse,
  'asset/footer/Casino': FooterCasino,
  'asset/footer/Wallet': FooterWallet,
  'asset/footer/Sports': FooterSports,
  'asset/footer/Chat': FooterChat
};

export function AppIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name];
  if (!Icon) return <Placeholder className={className} />;
  return <Icon className={className} />;
}
