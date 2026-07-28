'use client';

import { type PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/core/redux-toolkit/store';
import useIsMobile from '@/shared/hooks/useIsMobile';
import { useWindowSize } from '@/shared/hooks/useWindowSize';

export default function ClientContentWrapper({ children }: PropsWithChildren<unknown>) {
  const { sidebarOpen, chatOpen } = useSelector((state: RootState) => state.ui);
  const { width } = useWindowSize();
  const { isMobileLandscape } = useIsMobile();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const className = useMemo(() => {
    const base = 'relative transition-all duration-300 ease-in-out md:pt-0 pt-0 w-full h-full !overflow-hidden';
    // SSR/first render: produce deterministic classes to avoid hydration mismatch
    if (!mounted || !width) {
      return `${base} md:pl-[240px]`;
    }

    if (width > 1200 && sidebarOpen && chatOpen) {
      return `${base} md:pl-[240px] md:pr-[260px]${!isMobileLandscape ? ' md:p-4' : ''}`;
    }
    if (width < 1200 && width >= 768 && sidebarOpen && chatOpen) {
      return `${base} md:pl-[73px] md:pr-[260px]${!isMobileLandscape ? ' md:p-4' : ''}`;
    }
    if (width > 1200 && sidebarOpen && !chatOpen) {
      return `${base} md:pl-[240px]${!isMobileLandscape ? ' md:p-4' : ''}`;
    }
    if (width < 1200 && width >= 768 && sidebarOpen && !chatOpen) {
      return `${base} md:pl-[73px]${!isMobileLandscape ? ' md:p-4' : ''}`;
    }
    if (!sidebarOpen && chatOpen) {
      return `${base} md:pl-[73px] md:pr-[260px]${!isMobileLandscape ? ' md:p-4' : ''}`;
    }
    if (!sidebarOpen && !chatOpen) {
      return `${base} md:pl-[73px]${!isMobileLandscape ? ' md:p-4' : ''}`;
    }

    return `${base} md:p-4 !pb-0`;
  }, [mounted, width, sidebarOpen, chatOpen, isMobileLandscape]);

  return <div className={className}>{children}</div>;
}
