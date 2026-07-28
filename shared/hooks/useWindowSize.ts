'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { closeMobileSidebar, closeSidebar } from '@/core/redux-toolkit/slices/uiSlice';

// Debounce helper (client-safe)
function debounce<T extends (..._args: any[]) => void>(fn: T, delay: number) {
  let timer: number | undefined;

  return (...args: Parameters<T>) => {
    if (timer !== undefined) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => fn(...args), delay);
  };
}

export function useWindowSize(debounceMs: number = 150) {
  const dispatch = useDispatch();
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = debounce(() => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      setSize(prev => {
        if (prev.width === newWidth && prev.height === newHeight) return prev;
        return { width: newWidth, height: newHeight };
      });

      if (newWidth > 1024) {
        dispatch(closeMobileSidebar());
      }
      if (newWidth < 768) {
        dispatch(closeSidebar());
      }
    }, debounceMs);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [debounceMs, dispatch]);

  return size;
}
