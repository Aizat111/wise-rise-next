import { useEffect } from 'react';

export function useViewportHeight() {
  useEffect(() => {
    const setRealViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setRealViewportHeight();

    window.addEventListener('resize', setRealViewportHeight);
    window.addEventListener('orientationchange', setRealViewportHeight);

    return () => {
      window.removeEventListener('resize', setRealViewportHeight);
      window.removeEventListener('orientationchange', setRealViewportHeight);
    };
  }, []);
}
