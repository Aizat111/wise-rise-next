'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useModalManager } from './useModal';
import storage from '@/shared/utils/storage';

export const useSponsoredInvite = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { openModal } = useModalManager();

  useEffect(() => {
    const sponsorCode = searchParams?.get('sponsor');
    if (sponsorCode) {
      storage?.setItem('sponsoredInviteCode', sponsorCode);

      openModal('auth', 'register', {
        mode: 'register'
      });

      const params = new URLSearchParams(searchParams?.toString() || '');
      params.delete('sponsor');
      const newUrl = params.toString() ? `?${params.toString()}` : '';
      router.replace(pathname + newUrl, { scroll: false });
    }
  }, [searchParams]);
};
