'use client';

import Script from 'next/script';
import { memo } from 'react';

const LAUNCHER_SRC = 'https://s3.eu-central-1.amazonaws.com/ignition.button/round-2/connector.js';

const GameLauncherScript = memo(function GameLauncherScript() {
  return (
    <Script
      src={LAUNCHER_SRC}
      strategy="afterInteractive"
      onLoad={() => window.dispatchEvent(new CustomEvent('game-launcher-ready'))}
      onError={() => console.error('[GameLauncher] Failed to load connector script')}
    />
  );
});

export default GameLauncherScript;
