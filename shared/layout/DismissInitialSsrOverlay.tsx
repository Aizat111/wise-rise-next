'use client';

import { useLayoutEffect } from 'react';

/**
 * `not-found.tsx` renders `InitialOverlaySSR` for parity with `[locale]/layout.tsx`
 * but does not mount `InitialFixedOverlay` (sidebar/geo/me loaders). Without an
 * explicit dismiss, the SSR loading layer stays on top and hides the 404 UI.
 */
export default function DismissInitialSsrOverlay() {
  useLayoutEffect(() => {
    document.getElementById('initial-overlay-ssr')?.style.setProperty('display', 'none');
  }, []);
  return null;
}
