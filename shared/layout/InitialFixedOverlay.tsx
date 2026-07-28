'use client';

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { TYPES } from '@/core/api/rest-api/api-config';
import { useFetcher } from '@/core/api/rest-api/fetcher';
import type { RootState } from '@/core/redux-toolkit/store';

export default function InitialFixedOverlay() {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const meQuery = useFetcher(TYPES.ME).render(undefined, { enabled: isAuthenticated });
  const restrictionQuery = useFetcher(TYPES.CHECK_GEO_RESTRICTION).render();
  const liveWinsDailyQuery = useFetcher(TYPES.GET_LIVE_WINS).render([{}, ['daily']]);

  const isInitialLoading =
    (isAuthenticated && meQuery.isLoading) || restrictionQuery.isLoading || liveWinsDailyQuery.isLoading;

  // Controller: hide the SSR overlay once initial checks complete (do not re-show after dismissal)
  const dismissedRef = useRef(false);
  useEffect(() => {
    const el = document.getElementById('initial-overlay-ssr');
    if (!el) return;
    if (!isInitialLoading) {
      dismissedRef.current = true;
      el.style.display = 'none';
    } else if (!dismissedRef.current) {
      el.style.display = '';
    }
  }, [isInitialLoading]);

  return null;
}
