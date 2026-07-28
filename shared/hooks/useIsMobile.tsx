import { useEffect, useState } from 'react';

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

interface DeviceState {
  isMobile: boolean;
  isLandscape: boolean;
  orientation: 'portrait' | 'landscape';
  isMobileLandscape: boolean;
}

export default function useDeviceState(debounceMs: number = 150): DeviceState {
  const [state, setState] = useState<DeviceState>({
    isMobile: false,
    isLandscape: false,
    orientation: 'portrait',
    isMobileLandscape: false
  });

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

      const isMobile =
        /android/i.test(userAgent) ||
        (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) ||
        window.innerWidth < 768;

      const isLandscape = window.matchMedia('(orientation: landscape)').matches;

      setState({
        isMobile,
        isLandscape,
        orientation: isLandscape ? 'landscape' : 'portrait',
        isMobileLandscape: isMobile && isLandscape
      });
    };

    const debouncedCheckDevice = debounce(checkDevice, debounceMs);

    checkDevice();

    window.addEventListener('resize', debouncedCheckDevice);
    window.addEventListener('orientationchange', debouncedCheckDevice);

    return () => {
      window.removeEventListener('resize', debouncedCheckDevice);
      window.removeEventListener('orientationchange', debouncedCheckDevice);
    };
  }, [debounceMs]);

  return state;
}
