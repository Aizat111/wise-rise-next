'use client';

import { useEffect, useState } from 'react';

const DESKTOP_BREAKPOINT = 1024;

export const useIsDesktop = (): boolean => {
  // Start as false to avoid hydration mismatch, then update on mount
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    check(); // Immediately set correct value on mount
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isDesktop;
};
