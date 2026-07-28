'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useModalManager } from './useModal';
import { setGameStats } from '@/core/redux-toolkit/slices/gameSlice';
import {
  closeChat,
  closeMobileSidebar,
  setConnectorGameReady,
  toggleChatPanel
} from '@/core/redux-toolkit/slices/uiSlice';
import { RootState } from '@/core/redux-toolkit/store';

const usePathnameChange = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { closeAllModal, openModal } = useModalManager();
  const { chatOpen } = useSelector((state: RootState) => state.ui);

  // Tracks the last pathname this hook observed. Used to distinguish a true
  // navigation from a no-op re-run of the [pathname] effect (e.g. when a
  // parent re-renders and React hands us the same string instance again, or
  // strict-mode double-invokes the effect on mount). Destructive side effects
  // like closeAllModal() must NOT fire on those no-op re-runs — that was the
  // root cause of #550 (login / other modals getting nuked ~100ms after the
  // user opened them on first visit).
  const previousPathnameRef = useRef<string | null>(null);
  // Separate ref for the connector-script loader effect: effect 1 updates
  // previousPathnameRef before effect 3 runs, so sharing a single ref between
  // them would make effect 3's guard always see prev === current. Keeping the
  // refs independent lets each effect make its own first-run/no-op decision.
  const previousConnectorPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    const previous = previousPathnameRef.current;
    previousPathnameRef.current = pathname;

    const lastSegment = pathname?.split('/').pop();

    // Segment-based modal OPENS always run so cold deep-links like
    // /deposit or /withdraw still pop the correct modal on first paint.
    if (lastSegment === 'deposit') {
      const currency = new URLSearchParams(window.location.search).get('currency');
      openModal('depositCurrency', 'deposit', { title: 'deposit', currency: currency || 'SOL' });
    }
    if (lastSegment === 'withdraw') {
      const currency = new URLSearchParams(window.location.search).get('currency');
      openModal('withdrawalCurrency', 'withdraw', { title: 'withdraw', currency: currency || 'SOL' });
    }
    if (lastSegment === 'streaks') {
      openModal('streaks', 'default');
    }
    if (lastSegment === 'game') {
      dispatch(setGameStats(lastSegment));
    }
    if (lastSegment === 'chat') {
      dispatch(toggleChatPanel());
    }

    // Destructive CLOSES (clobber all open modals, close the mobile sidebar,
    // close the chat panel) only run on a genuine navigation — never on first
    // mount, never on a no-op re-run with an unchanged pathname. Without this
    // gate, any re-render that re-fires the effect would wipe modals the user
    // just opened.
    if (previous === null || previous === pathname) return;
    closeAllModal();
    dispatch(closeMobileSidebar());
    if (lastSegment !== 'chat' && chatOpen) {
      dispatch(closeChat());
    }
  }, [pathname]);

  useEffect(() => {
    if (searchParams?.get('modal') === 'deposit') {
      const currency = searchParams.get('currency');
      openModal('depositCurrency', 'deposit', { title: 'deposit', currency: currency || 'SOL' });
    }
    if (searchParams?.get('modal') === 'withdraw') {
      const currency = searchParams.get('currency');
      openModal('withdrawalCurrency', 'withdraw', { title: 'withdraw', currency: currency || 'SOL' });
    }
    if (searchParams?.get('pw_token')) {
      openModal('changePassword', 'changePassword');
    }
  }, [searchParams]);

  useEffect(() => {
    // Skip no-op re-runs so the connector script isn't appended twice when
    // the effect fires with an unchanged pathname (strict-mode remount,
    // cosmetic re-render, etc.). Each duplicate <script> tag would race with
    // the others and leak the setConnectorGameReady dispatches.
    if (previousConnectorPathnameRef.current === pathname) return;
    previousConnectorPathnameRef.current = pathname;

    const loadConnector = async () => {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/toshi-connector.js';
        script.crossOrigin = 'anonymous';
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.body.appendChild(script);
      });

      dispatch(setConnectorGameReady(true));
    };

    // Match both /casino/game/... and /xx/casino/game/... (locale-prefixed routes)
    if (pathname && /^\/(([a-z]{2})\/)?casino\/game/.test(pathname)) loadConnector();
  }, [pathname]);

  return null;
};

export default usePathnameChange;
