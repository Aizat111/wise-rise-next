'use client';

import dynamic from 'next/dynamic';
import { type PropsWithChildren } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import MiniGameCollapsed from '../partials/card/MiniGameCollapsed';
// import MiniGameModalWrap from '../partials/game/MiniGameModalWrap';
import ModalManager from '../components/modal/ModalManager';

import { cn } from '@/core/lib/utils';
import { closeSidebar } from '@/core/redux-toolkit/slices/uiSlice';
import type { RootState } from '@/core/redux-toolkit/store';
import { useWindowSize } from '@/shared/hooks/useWindowSize';

import styles from './Layout.module.scss';

const RestrictionModal = dynamic(() => import('../components/modal/restriction/RestrictionModal'));
const LiveStatsModal = dynamic(() => import('../components/modal/live-stats/LiveStatsModal'));
const MiniGameCollapsed = dynamic(() => import('../components/card/MiniGameCollapsed'));
const MiniGameModalWrap = dynamic(() => import('../components/game/MiniGameModalWrap'));

export function ClientLayoutWrapper({ children }: PropsWithChildren<unknown>) {
  const dispatch = useDispatch();
  const { sidebarOpen, chatOpen } = useSelector((state: RootState) => state.ui);
  const { width } = useWindowSize();
  return (
    <main
      className={cn(
        'flex w-full relative !overflow-hidden',
        styles.initialSidebar,
        sidebarOpen ? styles.showedSidebar : styles.hidedSidebar,
        chatOpen ? styles.showedChatPanel : styles.hidedChatPanel
      )}
    >
      {children}
      {width ? (
        <div
          aria-hidden="true"
          onClick={() => {
            dispatch(closeSidebar());
          }}
          className={cn('absolute inset-0 bg-bg_color/70  z-[1598]', (width > 1200 || !sidebarOpen) && 'hidden')}
        />
      ) : null}
      <MiniGameModalWrap />
      <MiniGameCollapsed />
      <RestrictionModal />
      <LiveStatsModal />
      <ModalManager />
    </main>
  );
}
