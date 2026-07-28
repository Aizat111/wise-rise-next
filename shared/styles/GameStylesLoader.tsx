'use client';

import { memo, useEffect } from 'react';

let importPromise: Promise<unknown> | null = null;

function loadStyles() {
  importPromise ??= import('@/styles/games.scss').catch(() => {
    importPromise = null;
  });
}

const GameStylesLoader = memo(function GameStylesLoader() {
  useEffect(loadStyles, []);
  return null;
});

export default GameStylesLoader;
