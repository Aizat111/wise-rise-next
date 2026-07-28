'use client';

import LiveWins from './LiveWins';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import type { RootState } from '@/core/redux-toolkit/store';

export default function LiveWinsClient() {
  const { hideLiveWins } = useAppSelector((state: RootState) => state.ui);

  if (hideLiveWins) {
    return null;
  }

  return <LiveWins />;
}
