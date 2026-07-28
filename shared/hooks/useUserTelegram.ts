'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { TYPES } from '@/core/api/rest-api/api-config';
import { useFetcher } from '@/core/api/rest-api/fetcher';
import { clearUserTelegram, setUserTelegram } from '@/core/redux-toolkit/slices/userTelegramSlice';

export function useUserTelegram() {
  const { data, isLoading, isSuccess, refetch, error } = useFetcher<any>(TYPES.CHECK_TELEGRAM).render();
  const dispatch = useDispatch();
  useEffect(() => {
    if (error) {
      dispatch(clearUserTelegram());
    }
    if (isSuccess) {
      dispatch(setUserTelegram(data));
    } else {
      dispatch(clearUserTelegram());
    }
  }, [isSuccess, data, error]);

  return {
    telegramProfile: error ? null : data,
    isLoading,
    isSuccess,
    refetch
  };
}
