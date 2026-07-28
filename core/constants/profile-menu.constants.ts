import STORAGE_KEY from './storage.constants';
import { PAGE } from '@/core/config/public-page.config';
import type { ISidebarItem } from '@/core/types/sidebar.types';
import {
  Affiliate,
  History,
  Logout,
  Settings,
  Support,
  User,
  Vault,
  Vipside,
  Wallet
} from '@/shared/assets/profiledropdown';
import storage from '@/shared/utils/storage';

export const getProfileMenuData = (): ISidebarItem[] => {
  const withdrawCurrency = storage?.getItem(STORAGE_KEY.WITHDRAW_CURRENCY) || 'SOL';

  return [
    {
      icon: User,
      label: 'profile',
      link: PAGE.PROFILE
    },
    {
      icon: Vault,
      label: 'vault',
      action: {
        type: 'open_modal',
        modal: 'vault',
        modalType: 'deposit'
      }
    },
    {
      icon: Vipside,
      label: 'viptext',
      link: PAGE.VIP
    },
    {
      icon: Affiliate,
      label: 'affiliatetext',
      link: PAGE.AFFILIATE
    },
    {
      icon: History,
      label: 'history',
      link: PAGE.HISTORY
    },
    {
      icon: Wallet,
      label: 'withdrawals',
      action: {
        type: 'open_modal',
        modal: 'withdrawalCurrency',
        modalType: 'withdraw',
        modalProps: {
          title: 'withdraw',
          currency: withdrawCurrency
        }
      }
    },
    {
      icon: Settings,
      label: 'settings_text',
      link: PAGE.SETTINGS
    },
    {
      icon: Support,
      label: 'livesupport',
      onClick: () => {
        if (typeof window !== 'undefined') {
          window.Intercom?.('show');
        }
      }
    },
    {
      icon: Logout,
      label: 'logout',
      action: {
        type: 'open_modal',
        modal: 'logout'
      }
    }
  ];
};
