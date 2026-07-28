'use client';

import { type PropsWithChildren, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/core/redux-toolkit/store';

export default function TwoColumnTextCardGate({ children }: PropsWithChildren) {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted && isAuthenticated) {
    return null;
  }
  return <>{children}</>;
}
