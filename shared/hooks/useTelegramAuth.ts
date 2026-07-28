import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setTokens } from '@/core/redux-toolkit/slices/userSlice';

export function useTelegramAuth() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const telegram = searchParams?.get('telegram');
    if (telegram) {
      const accessToken = searchParams?.get('accessToken');
      const refreshToken = searchParams?.get('refreshToken');
      if (accessToken && refreshToken) {
        dispatch(setTokens({ accessToken, refreshToken }));
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#tgAuthResult=')) {
      const telegramData = hash.replace('#tgAuthResult=', '');
      const decodedData = encodeURIComponent(telegramData);
      window.location.href = `https://user.toshi.bet/login/telegramCallback?telegram=${decodedData}`;
    }
  }, [searchParams]);
}
