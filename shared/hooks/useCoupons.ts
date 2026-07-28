'use client';

import { GRAPHQL_TYPES } from '@/core/api/graphql/api-config';
import { useGraphWsFetcher } from '@/core/api/graphql/useGraphWsFetcher';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import type { RootState } from '@/core/redux-toolkit/store';
import type {
  MyCouponCountResponse,
  MyCouponHistoryResponse,
  MyCouponsResponse,
  RedeemCouponCodeResponse
} from '@/core/types/coupons.types';

export const useMyCoupons = (limit = 50, offset = 0) => {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.user);

  return useGraphWsFetcher<MyCouponsResponse>(GRAPHQL_TYPES.MY_COUPONS_QUERY).render(
    { limit, offset },
    { enabled: isAuthenticated }
  );
};

export const useMyCouponCount = () => {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.user);

  return useGraphWsFetcher<MyCouponCountResponse>(GRAPHQL_TYPES.MY_COUPON_COUNT_QUERY).render(undefined, {
    enabled: isAuthenticated
  });
};

export const useMyCouponHistory = (limit = 10, offset = 0) => {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.user);

  return useGraphWsFetcher<MyCouponHistoryResponse>(GRAPHQL_TYPES.MY_COUPON_HISTORY_QUERY).render(
    { limit, offset },
    { enabled: isAuthenticated }
  );
};

export const useRedeemCouponCode = () =>
  useGraphWsFetcher<RedeemCouponCodeResponse>(GRAPHQL_TYPES.REDEEM_COUPON_CODE_MUTATION).action();
