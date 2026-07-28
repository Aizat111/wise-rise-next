'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setConnectorGameReady } from '@/core/redux-toolkit/slices/uiSlice';

export const ConnectorScriptLoader = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const handleScriptLoad = () => {
    if (
      typeof window !== 'undefined' &&
      (window as any).connector &&
      typeof (window as any).connector.create === 'function'
    ) {
      dispatch(setConnectorGameReady(true));
    }
  };

  const handleScriptError = () => {
    console.error('Failed to load connector script');
  };

  // Match both /casino/game/... and /xx/casino/game/... (locale-prefixed routes)
  const isGamePage = !!pathname && /^\/(([a-z]{2})\/)?casino\/game/.test(pathname);

  useEffect(() => {
    if (!isGamePage) return;

    const checkConnector = () => {
      if (
        typeof window !== 'undefined' &&
        (window as any).connector &&
        typeof (window as any).connector.create === 'function'
      ) {
        dispatch(setConnectorGameReady(true));
      }
    };

    checkConnector();
    const interval = setInterval(() => {
      checkConnector();
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [dispatch, isGamePage]);

  if (!isGamePage) return null;

  return (
    <Script
      id="connector-script"
      src="/toshi-connector.js"
      onLoad={handleScriptLoad}
      onError={handleScriptError}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};
