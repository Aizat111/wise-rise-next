'use client';

import { useEffect, useRef, useState } from 'react';

import LiveWinCard from '../card/LiveWinsCard';

import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { cn } from '@/core/lib/utils';
import type { ILiveWinsResponse, IWin } from '@/core/types/games.type';
import { useLivewinsSocket } from '@/shared/hooks/sockets/useLivewinsSocket';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import { SkeletonLoader } from '@/shared/ui/SkeletonLoader';
import { generateIdempotencyKey } from '@/shared/utils/numberUtils';

const CARD_WIDTH = 80;
const CARD_GAP = 8;
const NEW_ANIMATION_TIMEOUT = 600;

export default function LiveWins() {
  const winsQuery = useFetcher<ILiveWinsResponse>(TYPES.GET_LIVE_WINS).render([{}, ['daily']], {
    staleTime: 30_000,
    refetchOnWindowFocus: false
  });
  const { connected, on } = useLivewinsSocket();
  const { width } = useWindowSize();

  const [liveWins, setLiveWins] = useState<IWin[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const clearNewTimerRef = useRef<number | null>(null);
  const [maxVisible, setMaxVisible] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showSkeleton = !mounted || winsQuery.isLoading;
  const skeletonCount = maxVisible > 0 ? maxVisible : 10;

  useEffect(() => {
    if (!connected) return;

    const unsubscribe = on('user:liveWins', (win: IWin) => {
      setLiveWins(prev => {
        const newWin: IWin = { ...win, key: generateIdempotencyKey() };
        let updated = [newWin, ...prev];

        if (maxVisible > 0 && updated.length > maxVisible) {
          updated = updated.slice(0, maxVisible);
        }

        setNewKey(newWin.key);

        if (clearNewTimerRef.current) clearTimeout(clearNewTimerRef.current);
        clearNewTimerRef.current = window.setTimeout(() => setNewKey(null), NEW_ANIMATION_TIMEOUT);

        return updated;
      });
    });

    return () => {
      unsubscribe?.();
    };
  }, [connected, on, maxVisible]);

  useEffect(() => {
    const recompute = () => {
      const width = containerRef.current?.offsetWidth || 0;
      const count = width > 0 ? Math.max(1, Math.floor((width + CARD_GAP) / (CARD_WIDTH + CARD_GAP))) : 0;
      setMaxVisible(count);
    };

    if (width < 768) {
      setMaxVisible(10);
      return;
    } else {
      recompute();
    }
    window.addEventListener('resize', recompute);
    return () => window.removeEventListener('resize', recompute);
  }, [width]);

  useEffect(() => {
    if (maxVisible > 0 && liveWins.length > maxVisible) {
      setLiveWins(prev => prev.slice(0, maxVisible));
    }
  }, [maxVisible, liveWins.length]);

  useEffect(() => {
    if (winsQuery.data?.wins) {
      setLiveWins(winsQuery.data.wins.map(win => ({ ...win, key: win.key ?? generateIdempotencyKey() })));
    }
  }, [winsQuery.data]);

  return (
    <div className="flex gap-4 @[768px]:mt-1 mt-1 @[768px]:min-h-[172px]  min-h-[137px] border-b border-white10 pb-6">
      {/* Live Wins */}
      <div ref={containerRef} className="relative flex gap-2 overflow-hidden w-full  livewin-card-wrapper">
        {showSkeleton ? (
          <div className="flex flex-wrap gap-2">
            <SkeletonLoader
              key={skeletonCount}
              count={skeletonCount}
              containerClassName="flex-wrap1"
              className="w-[90px] h-[117px] @[768px]:h-[147px] @[768px]:min-h-[147px] min-h-[120px] max-h-[147px]"
            />
          </div>
        ) : (
          liveWins.map((win, index) => (
            <div
              key={win.key}
              className={cn(
                newKey && index > 0 && 'animate-shift-right',
                newKey && index === 0 && 'animate-livewin-enter'
              )}
            >
              <LiveWinCard
                game_name={win.game_name || ''}
                provider={win.provider || "Toshi's Dojo"}
                image={win.game_image || ''}
                username={win.username || ''}
                amount={Number(win.amount) || 0}
                isNew={win.key === newKey}
                level={win.level || 0}
              />
            </div>
          ))
        )}
        <div
          className="absolute top-0 -right-3 w-[8.3125rem] h-full pointer-events-none z-1 max-sm:hidden md:block"
          style={{ background: 'linear-gradient(90deg, rgba(4, 10, 41, 0) 0%, #040A29 100%)' }}
        />
      </div>
    </div>
  );
}
