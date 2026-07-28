'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useModalManager } from './useModal';
import { TYPES } from '@/core/api/rest-api/api-config';
import { useFetcher } from '@/core/api/rest-api/fetcher';
import storage from '@/shared/utils/storage';

export const useReferralCode = () => {
  const searchParams = useSearchParams();
  useFetcher(TYPES.REFERRAL_VISIT).render();
  const router = useRouter();
  const pathname = usePathname();
  const { openModal } = useModalManager();

  useEffect(() => {
    const refCode = searchParams?.get('ref');
    const clickIdFromQuery = searchParams?.get('id');
    if (refCode) {
      // Open register modal with referral code
      openModal('auth', 'register', {
        mode: 'register',
        referralCode: refCode
      });
      storage?.setItem('clickId', clickIdFromQuery || `${refCode}#${clickIdFromQuery}`);
      storage?.setItem('referralCode', refCode);
      storage?.setItem('fromReferral', 'true');
      // Clean up the URL by removing the ref parameter
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.delete('ref');
      const newUrl = params.toString() ? `?${params.toString()}` : '';
      router.replace(pathname + newUrl, { scroll: false });
    }
  }, [searchParams]);
};
