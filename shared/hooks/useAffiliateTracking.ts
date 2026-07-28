'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const SCALEO_CLICK_ID_KEY = 'scaleo_cid';

export const useAffiliateTracking = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const cid = searchParams?.get('cid');
    if (cid) {
      localStorage.setItem(SCALEO_CLICK_ID_KEY, cid);
    }
  }, [searchParams]);

  const getClickId = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(SCALEO_CLICK_ID_KEY);
  };

  const clearClickId = () => {
    localStorage.removeItem(SCALEO_CLICK_ID_KEY);
  };

  return { getClickId, clearClickId };
};
