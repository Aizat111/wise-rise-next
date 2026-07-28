'use client';

import { STORAGE_KEY } from '../../core/config/storage.config';
import storage from '../utils/storage';

import { PAGE } from '@/core/config/public-page.config';
import { useRouter } from '@/core/i18n/navigation';

/**
 * Centralizes all LMS navigation.
 * On desktop the (lms)/layout.tsx automatically wraps sub-pages in a modal,
 * so this hook just does normal router.push() on all devices.
 */
export const useLmsNavigation = () => {
  const router = useRouter();

  return {
    goToInfo: (tournamentId: string) => router.push(PAGE.LMS_INFO(tournamentId)),
    goToSelectGame: (tournamentId: string, roundNo: number | string) => {
      storage?.setItem(STORAGE_KEY.LMS_SELECTED_ROUND_NO, roundNo.toString());
      router.push(PAGE.JOIN_TOURNAMENT(tournamentId));
    },
    goToSelectGamePickTeam: (tournamentId: string) => router.push(PAGE.LMS_SELECT_GAME_PICK_TEAM(tournamentId)),
    goToPlaceABet: (tournamentId: string) => router.push(PAGE.LMS_PLACE_A_BET(tournamentId)),
    goBack: () => router.back(),
    goHome: () => router.push(PAGE.LAST_MAN_STANDING),
    goToProfilePage: (tournamentId?: string) =>
      router.push(`${PAGE.LMS_PROFILE}${tournamentId ? `?tournamentId=${tournamentId}` : ''}`)
  };
};
