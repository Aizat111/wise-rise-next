'use client';

import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import { type PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from 'react';

import { useAppDispatch } from '@/core/redux-toolkit/hooks';
import { closeDesktopHeaderSearch } from '@/core/redux-toolkit/slices/uiSlice';
import { Spinnertext } from '@/shared/assets/loading';
import ToshiIcon from '@/shared/ui/loaders/ToshiIcon';

interface NavigationLoadingContextType {
  startLoading: () => void;
  stopLoading: () => void;
  isLoading: boolean;
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType | undefined>(undefined);

export const useNavigationLoading = () => {
  const context = useContext(NavigationLoadingContext);
  if (!context) {
    throw new Error('useNavigationLoading must be used within NavigationLoadingProvider');
  }
  return context;
};

export function NavigationLoadingProvider({ children }: PropsWithChildren<unknown>) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const currentPathRef = useRef(pathname);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (pathname !== currentPathRef.current) {
      currentPathRef.current = pathname;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      dispatch(closeDesktopHeaderSearch());

      timeoutRef.current = setTimeout(() => {
        NProgress.done();
      }, 50);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [pathname]);

  const startLoading = () => {
    NProgress.start();
    setIsLoading(true);
  };

  const stopLoading = () => {
    NProgress.done();
  };

  return (
    <NavigationLoadingContext.Provider value={{ startLoading, stopLoading, isLoading }}>
      {children}
    </NavigationLoadingContext.Provider>
  );
}

export function NavigationLoadingOverlay() {
  const { isLoading } = useNavigationLoading();

  if (!isLoading) return null;

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-[999] flex items-center justify-center bg-toshi_body animate-in fade-in duration-200">
      <div className="relative inline-flex items-center justify-center animate-pulse-in">
        <Spinnertext width={160} height={160} className="animate-spin" style={{ animationDuration: '6s' }} />
        <ToshiIcon
          width={160}
          height={160}
          className="absolute ml-[6.4px] mt-[6px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
}
