import { useCallback, useSyncExternalStore } from 'react';

import { getControls, subscribe } from '@/core/lib/carouselControlsStore';
import type { HorizontalCarouselControls } from '@/core/types/carousel.types';

export function useCarouselControls(sectionId?: string): HorizontalCarouselControls | null {
  const subscribeFn = useCallback(
    (onStoreChange: () => void) => {
      if (!sectionId) return () => {};
      return subscribe(sectionId, onStoreChange);
    },
    [sectionId]
  );
  const getSnapshot = useCallback(() => (sectionId ? getControls(sectionId) : null), [sectionId]);
  const getServerSnapshot = () => null;
  return useSyncExternalStore(subscribeFn, getSnapshot, getServerSnapshot);
}
