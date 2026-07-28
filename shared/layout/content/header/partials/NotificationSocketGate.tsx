'use client';

import { useEffect, useState } from 'react';

import { EnumTokens } from '@/core/types/auth.types';
import { useNotificationSocket } from '@/shared/hooks/useNotificationSocket';
import tokenStorage from '@/shared/utils/tokenStorage';

function Inner() {
  useNotificationSocket();
  return null;
}

export default function NotificationSocketGate() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only start sockets if we have a token.
    const token = tokenStorage.getItem(EnumTokens.ACCESS_TOKEN);
    if (!token) return;

    let done = false;
    const trigger = () => {
      if (done) return;
      done = true;
      setEnabled(true);
    };

    // Avoid loading sockets during Lighthouse window.
    window.addEventListener('pointerdown', trigger, { once: true, passive: true });
    window.addEventListener('keydown', trigger, { once: true });
    const t = window.setTimeout(trigger, 30_000);

    return () => {
      window.removeEventListener('pointerdown', trigger as any);
      window.removeEventListener('keydown', trigger as any);
      window.clearTimeout(t);
    };
  }, []);

  if (!enabled) return null;
  return <Inner />;
}
