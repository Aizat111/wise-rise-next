'use client';

import { Button } from '@investorcentretb/toshi-ui';
import cn from 'clsx';
import { useTranslations } from 'next-intl';
// import Rewards from './partials/Rewards';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BalanceComponent from './partials/Balance';
import Notifications from './partials/Notifications';
import Profile from './partials/Profile';
import SearchBtn from './partials/SearchBtn';
import { TYPES } from '@/core/api/rest-api/api-config';
import { useFetcher } from '@/core/api/rest-api/fetcher';
import { PAGE } from '@/core/config/public-page.config';
import STORAGE_KEY from '@/core/constants/storage.constants';
import { Link } from '@/core/i18n/navigation';
import { setNotifications } from '@/core/redux-toolkit/slices/notificationSlice';
import { closeMobileSidebar, toggleChatPanel } from '@/core/redux-toolkit/slices/uiSlice';
import type { RootState } from '@/core/redux-toolkit/store';
import { INotificationsResponse } from '@/core/types/user.types';
import { ToshiBetLogoBrandmark, ToshiBetLogoLarge, ToshiBetLogoTwodeck } from '@/shared/assets/branding';
import { Chat } from '@/shared/assets/footer';
import Wallet2Icon from '@/shared/assets/header/Wallet2';
import { useModalManager } from '@/shared/hooks/useModal';
import { Indicator } from '@/shared/ui/indicators/Indicator';
import storage from '@/shared/utils/storage';

const Rewards = dynamic(() => import('./partials/Rewards').then(mod => mod.default), {
  loading: () => <div className="w-4 h-4" />
});

const NotificationSocketGate = dynamic(() => import('./partials/NotificationSocketGate'), {
  loading: () => null
});

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { openModal } = useModalManager();
  const { unreadCount } = useSelector((state: RootState) => state.notifications);
  const t = useTranslations();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { render: getNotifications } = useFetcher<INotificationsResponse>(TYPES.GET_NOTIFICATIONS);
  const { data } = getNotifications({ limit: 50, offset: 0 }, { enabled: isAuthenticated });

  const handleOpenDeposit = () => {
    const params = new URLSearchParams();

    const depositCurrency = storage?.getItem(STORAGE_KEY.DEPOSIT_CURRENCY) || 'SOL';
    openModal('depositCurrency', 'deposit', { title: 'deposit', currency: depositCurrency || 'SOL' });
    params.set('modal', 'deposit');
    params.set('currency', depositCurrency);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (data && isAuthenticated) {
      dispatch(
        setNotifications({
          notifications: data.notifications || [],
          totalCount: data.totalCount || 0,
          unreadCount: data.unreadCount || 0,
          offset: 0
        })
      );
    }
  }, [data, isAuthenticated, dispatch]);

  return (
    <header
      className={cn(
        'md:bg-toshi_body bg-bg_color px-[3vw] mx-auto h-[70px] flex items-center justify-center relative left-0 top-0 z-[100] w-full @container after:content-[""] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-white/10 md:after:bg-[#060E20] md:after:h-[2px] flex-shrink-0'
      )}
    >
      {mounted && isAuthenticated ? <NotificationSocketGate /> : null}
      <div className="flex items-center max-w-[1200px] gap-3 justify-between w-full ">
        <div className="flex items-center -ml-0 justify-start w-full gap-4 ">
          <Link
            href={PAGE.HOME}
            onClick={() => dispatch(closeMobileSidebar())}
            className="flex min-w-[50px] justify-start items-start relative top-[0px]"
            aria-label="Toshi Bet logo"
            title="Toshi Bet logo"
          >
            <ToshiBetLogoBrandmark
              width={52}
              height={52}
              className="h-[60px] w-[60px] block @[360px]:hidden md:block md:@[500px]:hidden"
              aria-label="Toshi Bet Logo"
            />
            <ToshiBetLogoTwodeck className="min-w-[120.5px] md:-ml-5 md:min-w-[150px] h-[52px] hidden @[360px]:block md:hidden md:@[500px]:block md:@[768px]:hidden" />
            <ToshiBetLogoLarge
              className="h-[54px] @[768px]:w-[198px] min-w-[198px] -ml-2 w-[198px]  @[768px]:block hidden "
              suppressHydrationWarning
              aria-label="Toshi Bet Logo"
            />
          </Link>
        </div>
        {mounted && isAuthenticated && (
          <div className="hidden min-[500px]:flex items-center h-fit outline outline-1 outline-white10 md:outline-none md:bg-bg_color rounded-md">
            <div
              className="rounded-lg text-base px-3 @[768px]:px-4 text-nowrap whitespace-nowrap cursor-pointer"
              onClick={() => openModal('depositBonus', 'depositBonus')}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openModal('depositBonus', 'depositBonus');
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Open deposit bonus modal"
            >
              <BalanceComponent />
            </div>
            <Button
              intent="primary"
              mobileIcon={<Wallet2Icon className="size-6" viewBox="0 0 20 20" />}
              icon={<Wallet2Icon className="size-6" viewBox="0 0 20 20" />}
              onClick={handleOpenDeposit}
              hideTextInSize={900}
              appearance="glossy"
              className="block @[500px]:inline-flex @[768px]:hidden @[768px]:w-[120px]  rounded-l-none max-md:w-8 max-md:h-8 max-md:p-0 text-[17px] font-bold"
            >
              {t('deposit')}
            </Button>
            <Button
              intent="primary"
              onClick={handleOpenDeposit}
              appearance="glossy"
              className="hidden @[768px]:inline-flex show-text  lg:w-[91px] rounded-l-none max-md:w-8 max-md:h-8 max-md:p-0 text-[17px] font-bold"
            >
              {t('deposit')}
            </Button>
          </div>
        )}
        <div className="flex items-center justify-end w-full gap-4">
          {mounted && isAuthenticated ? (
            <>
              <div className="justify-end flex flex-row gap-2 w-full">
                <SearchBtn />
                {/* Mobile balance + deposit inside right group */}
                <div className="min-[500px]:hidden flex items-center h-fit outline outline-1 outline-white10 rounded-md">
                  <div className="rounded-lg text-base px-3 @[768px]:px-5 text-nowrap whitespace-nowrap">
                    <BalanceComponent />
                  </div>
                  <Button
                    intent="primary"
                    mobileIcon={<Wallet2Icon className="size-6" viewBox="0 0 20 20" />}
                    icon={<Wallet2Icon className="size-6" viewBox="0 0 20 20" />}
                    onClick={handleOpenDeposit}
                    hideTextInSize={900}
                    appearance="glossy"
                    className="block @[500px]:inline-flex @[768px]:hidden   rounded-l-none max-md:w-8 max-md:h-8 max-md:p-0 text-[17px] font-bold"
                  >
                    {t('deposit')}
                  </Button>
                  <Button
                    intent="primary"
                    onClick={handleOpenDeposit}
                    appearance="glossy"
                    className="hidden @[768px]:inline-flex show-text  lg:w-[91px] rounded-l-none max-md:w-8 max-md:h-8 max-md:p-0 text-[17px] font-bold"
                  >
                    {t('deposit')}
                  </Button>
                </div>
                <Rewards />
                <div className="relative @[786px]:flex hidden">
                  <Notifications />

                  {unreadCount > 0 && <Indicator variant="green" className=" max-sm:size-2 size-3" />}
                </div>
                <Profile />
                <Button
                  intent="gray"
                  appearance="3d"
                  className="w-10 h-10 md:flex hidden"
                  borderRadius="md"
                  onClick={() => dispatch(toggleChatPanel())}
                  icon={<Chat className="w-7 h-7" aria-label="Chat" />}
                ></Button>
              </div>
            </>
          ) : (
            <div className="flex flex-row gap-4">
              <SearchBtn />
              <div className="flex items-center justify-end gap-1.5 md:gap-2 ">
                <Button
                  intent="white"
                  onClick={() => openModal('auth', 'login', { mode: 'login' })}
                  appearance="outline"
                  borderRadius="md"
                  className="max-h-[32px] md:px-4 md:max-h-none py-2.5"
                >
                  {t('login')}
                </Button>
                <Button
                  intent="primary"
                  onClick={() => openModal('auth', 'register', { mode: 'register' })}
                  appearance="glossy"
                  borderRadius="md"
                  className="max-h-[32px] md:px-4 mad:py-0 md:max-h-none py-2.5"
                >
                  {t('register')}
                </Button>
              </div>
              <Button
                intent="gray"
                appearance="3d"
                className="w-10 h-10 md:flex hidden"
                borderRadius="md"
                onClick={() => dispatch(toggleChatPanel())}
                icon={<Chat className="w-7 h-7" aria-label="Chat" />}
              ></Button>
            </div>
          )}
        </div>
      </div>

      {/* <SearchDropdown onClose={() => {}} /> */}
    </header>
  );
}
