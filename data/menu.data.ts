import { PAGE } from '@/core/config/public-page.config';
import type { IMenuList } from '@/core/types/menu.types';

export const HISTORY_MENU_DATA: IMenuList[] = [
  {
    label: 'deposits',
    link: PAGE.HISTORY
  },
  {
    label: 'withdrawals',
    link: PAGE.HISTORY_WITHDRAW
  },
  {
    label: 'bets',
    link: PAGE.HISTORY_BETS
  },
  {
    label: 'coupons',
    link: PAGE.HISTORY_COUPONS
  }
];

export const ACCOUNT_MENU_DATA: IMenuList[] = [
  {
    label: 'account',
    link: PAGE.ACCOUNT
  },
  {
    label: 'security',
    link: PAGE.ACCOUNT_SECURITY
  }
];

export const DOCS_MENU_DATA: IMenuList[] = [
  {
    label: 'user_agreement',
    link: PAGE.USER_AGREEMENT
  },
  {
    label: 'privacy_policy',
    link: PAGE.PRIVACY_POLICY
  },
  {
    label: 'responsible_gaming_policy',
    link: PAGE.RESPONSIBLE_GAMING_POLICY
  },
  {
    label: 'anti_money_laundering',
    link: PAGE.ANTI_MONEY_LAUNDERING
  }
];
