import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { TYPES } from '@/core/api/rest-api/api-config';
import { useFetcher } from '@/core/api/rest-api/fetcher';
import { notify } from '@/core/lib/notify';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { updateRakeboostState } from '@/core/redux-toolkit/slices/rakeboostSlice';
import { IGetRakebackBoostStatusResponse } from '@/core/types/rewards';

export const useRakebackBoost = () => {
  const dispatch = useDispatch();
  const t = useTranslations();
  const claimRakebackBoost = useFetcher(TYPES.ACTIVATE_RAKEBACK_BOOST).action();
  const getRakebackBoostStatus = useFetcher<IGetRakebackBoostStatusResponse>(TYPES.GET_RAKEBACK_BOOST_STATUS).render();

  const { active, expiry, claimable, boostType } = useAppSelector(state => state.rakeboost);

  const [timeLeft, setTimeLeft] = useState('');
  const [timeUntilNextBoost, setTimeUntilNextBoost] = useState('');
  const [tileColors, setTileColors] = useState<string[]>([]);

  const getProgress = (durationMinutes: number, expiryTimeUTC: string) => {
    const currentTime = new Date().getTime();
    const expiryTime = new Date(expiryTimeUTC).getTime();
    const durationMilliseconds = durationMinutes * 60 * 1000;
    const startTime = expiryTime - durationMilliseconds;
    const totalEventDuration = expiryTime - startTime;
    const totalDuration = expiryTime - currentTime;

    if (totalDuration < 0) {
      return 100;
    }

    const elapsedTime = totalEventDuration - totalDuration;
    const progress = (elapsedTime / totalEventDuration) * 100;

    return progress > 100 ? 100 : progress;
  };

  const getNextBoostTime = () => {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const nextBoostDate = new Date(now);

    if (utcHours >= 0 && utcHours < 6) {
      nextBoostDate.setUTCHours(6, 0, 0, 0);
    } else if (utcHours >= 6 && utcHours < 14) {
      nextBoostDate.setUTCHours(14, 0, 0, 0);
    } else if (utcHours >= 14 && utcHours < 22) {
      nextBoostDate.setUTCHours(22, 0, 0, 0);
    } else {
      nextBoostDate.setUTCDate(nextBoostDate.getUTCDate() + 1);
      nextBoostDate.setUTCHours(6, 0, 0, 0);
    }

    return nextBoostDate;
  };

  const handleActivate = useCallback(async () => {
    claimRakebackBoost
      .mutateAsync({})
      .then((response: any) => {
        if (response?.success) {
          const newExpiry = new Date();
          newExpiry.setHours(newExpiry.getHours() + 8);

          dispatch(
            updateRakeboostState({
              active: true,
              claimable: false,
              boostType: response?.boost_type || 0,
              expiry: response?.expiry ?? newExpiry.toISOString()
            })
          );

          notify('success', 'success.success', 'success.rakebackBoostActivated');
        } else {
          notify('error', 'errors.error', 'errors.errorDescription');
          throw new Error('Activation failed');
        }
      })
      .catch(() => {
        notify('error', 'errors.error', 'errors.errorDescription');
      });
  }, [t, dispatch]);

  /** Renkleri güncelle */
  useEffect(() => {
    const mapBoosts = async () => {
      const currentTime = new Date().getUTCHours();
      const claimedRakeboosts = 0;

      const tileColors = ['#6CDE07', '#6CDE07', '#6CDE07'];

      if (currentTime >= 6 && currentTime < 14) {
        tileColors[0] = active ? '#E18314' : claimedRakeboosts >= 1 || !claimable ? '#888888' : '#67DF30';
        tileColors[1] = '#67DF30';
        tileColors[2] = '#67DF30';
      } else if (currentTime >= 14 && currentTime < 22) {
        tileColors[0] = '#888888';
        tileColors[1] = active ? '#E18314' : claimedRakeboosts >= 1 || !claimable ? '#888888' : '#67DF30';
        tileColors[2] = '#67DF30';
      } else if (currentTime >= 22 || currentTime < 6) {
        tileColors[0] = '#888888';
        tileColors[1] = '#888888';
        tileColors[2] = active ? '#E18314' : claimedRakeboosts >= 1 || !claimable ? '#888888' : '#67DF30';
      }
      setTileColors(tileColors);
    };
    mapBoosts();
  }, [active, claimable]);

  /** Kalan süre hesapla */
  useEffect(() => {
    if (!expiry) return;

    const expiryTime = new Date(expiry);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = expiryTime.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft('Expired');
        dispatch(updateRakeboostState({ active: false, expiry: null, claimable: false }));
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h ? `${h}h ` : ''}${m ? `${m}m ` : ''}${s}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiry, dispatch]);

  /** Calculate time until next boost availability */
  useEffect(() => {
    if (active || claimable) {
      setTimeUntilNextBoost('');
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const nextBoostTime = getNextBoostTime();
      const diff = nextBoostTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeUntilNextBoost('Available');
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeUntilNextBoost(`${h ? `${h}h ` : ''}${m ? `${m}m ` : ''}${s}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [active, claimable]);

  useEffect(() => {
    if (getRakebackBoostStatus.data?.success) {
      dispatch(
        updateRakeboostState({
          active: getRakebackBoostStatus.data.boost.active,
          expiry: getRakebackBoostStatus.data.boost.expiry,
          claimable: getRakebackBoostStatus.data.boost.claimable,
          boostType: getRakebackBoostStatus.data.boost.boost_type || 0
        })
      );
    } else if (getRakebackBoostStatus?.data?.boost?.claimable) {
      dispatch(
        updateRakeboostState({
          active: false,
          expiry: null,
          claimable: true,
          boostType: 0
        })
      );
    }
  }, [getRakebackBoostStatus.data]);

  return {
    /** redux state */
    active,
    expiry,
    claimable,
    boostType,

    /** local state */
    timeLeft,
    timeUntilNextBoost,
    tileColors,

    // loading
    activateLoading: claimRakebackBoost.isPending,
    getStatusLoading: getRakebackBoostStatus.isFetching,

    /** actions */
    handleActivate,
    getProgress
  };
};
