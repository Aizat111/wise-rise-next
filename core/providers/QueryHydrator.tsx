'use client';

import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query';
import type React from 'react';

type QueryHydratorProps = {
  state: DehydratedState;
  children: React.ReactNode;
};

export default function QueryHydrator({ state, children }: QueryHydratorProps) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
