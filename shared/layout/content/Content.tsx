'use client';

import cn from 'clsx';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import ClientContentWrapper from './ClientContentWrapper';
import { Header } from './header/Header';
import PageHeader from './page-header/PageHeader';
import { shouldUseFluidTopPadding } from '@/core/config/layout.config';
// import { Intercom } from '../intercom/Intercom';

import { RootState } from '@/core/redux-toolkit/store';
import useIsMobile from '@/shared/hooks/useIsMobile';

const Intercom = dynamic(() => import('../intercom/Intercom'), { loading: () => null });
const SearchDropdown = dynamic(() => import('@/shared/components/modal/search/SearchDropdown'), {
  loading: () => null
});
const Footer = dynamic(() => import('./footer/footer').then(m => m.Footer), {
  loading: () => null
});

export function Content({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const useFluidTopPadding = pathname ? shouldUseFluidTopPadding(pathname) : false;
  const isSportsbook = pathname?.includes('/sports/home');
  const isGame = pathname?.includes('/casino/game');
  const { theaterMode } = useSelector((state: RootState) => state.ui);
  const { isMobileLandscape } = useIsMobile();
  const isDesktopHeaderSearchOpen = useSelector((state: RootState) => state.ui.desktopHeaderSearchOpen);
  useEffect(() => {
    // Use requestAnimationFrame to ensure scroll happens after layout is stable
    const rafId = window.requestAnimationFrame(() => {
      const section = document.querySelector('.contents-container') as HTMLElement;
      if (section) {
        section.scrollTo({ top: 0, behavior: 'instant' });
      }
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  return (
    <div className="relative w-full h-svh !overflow-hidden">
      <ClientContentWrapper>
        <Header />
        <section
          className={cn(
            'relative pt-0 @[768px]:pt-2 bg-bg_content overflow-y-scroll overflow-x-hidden h-[calc(100%-70px)] no-scrollbar w-full lg:pb-0 contents-container',
            isSportsbook ? 'rounded-lg' : 'rounded-lg',
            isMobileLandscape ? 'pb-0' : 'pb-0',
            isDesktopHeaderSearchOpen && '!overflow-hidden'
          )}
        >
          <div
            className={cn(
              isSportsbook
                ? 'p-body  min-h-screen @[768px]:px-[3vw] px-0 landscape-mobile-padding relative @[768px]:pt-4 pt-0 '
                : '@mobg:p-body min-h-screen px-[3vw] landscape-mobile-padding relative',
              !isSportsbook && !isGame && (useFluidTopPadding ? 'pt-fluid-8' : 'pt-5'),
              isGame && 'mt-[3vw] @mobg:mt-0',
              !isSportsbook && theaterMode && 'px-[1vw]'
            )}
          >
            <div
              className={cn(
                'mx-auto pt-0 @[768px]:pt-0 h-auto',
                isSportsbook ? 'max-w-none pb-0 rounded-lg ' : 'pb-[40px]',
                !isSportsbook && (theaterMode ? 'max-w-[2000px]' : 'main-container ')
              )}
            >
              <PageHeader />
              <div>{children}</div>
            </div>
          </div>
          {isDesktopHeaderSearchOpen ? <SearchDropdown /> : null}
          <Footer />
          <Intercom />
        </section>
      </ClientContentWrapper>
    </div>
  );
}
