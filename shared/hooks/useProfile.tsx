'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { TYPES } from '@/core/api/rest-api/api-config';
import { useFetcher } from '@/core/api/rest-api/fetcher';
import { CountryCode } from '@/core/constants/country-flags.constants';
import { setBalance } from '@/core/redux-toolkit/slices/balanceSlice';
import { openRestrictionModal, setCountryCode } from '@/core/redux-toolkit/slices/uiSlice';
import { clearUser, setUser } from '@/core/redux-toolkit/slices/userSlice';
import type { RootState } from '@/core/redux-toolkit/store';
import type { ICheckRestrictionResponse, IUser } from '@/core/types/user.types';

export function useProfile() {
  const { accessToken } = useSelector((state: RootState) => state.user);
  const { data, isLoading, isSuccess, isError, refetch } = useFetcher<IUser>(TYPES.ME).render(undefined, {
    enabled: !!accessToken,
    refetchOnMount: 'always',
    staleTime: 0,
    gcTime: 0
  });
  const { data: restrictionData } = useFetcher<ICheckRestrictionResponse>(TYPES.CHECK_GEO_RESTRICTION).render();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
      dispatch(setBalance(data.balance));
    } else if (isError) {
      dispatch(clearUser());
    }
  }, [isSuccess, isError, data]);

  useEffect(() => {
    if (accessToken) {
      refetch();
    }
  }, [accessToken]);

  useEffect(() => {
    if (restrictionData && restrictionData.blocked) {
      dispatch(openRestrictionModal());
      dispatch(setCountryCode(restrictionData.country_code as CountryCode));
    }
  }, [restrictionData]);

  return {
    profile: data,
    isLoading,
    isSuccess,
    refetch
  };
}
