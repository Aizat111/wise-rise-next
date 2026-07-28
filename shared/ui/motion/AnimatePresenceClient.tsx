'use client';

import { AnimatePresence } from 'framer-motion';
import type { PropsWithChildren } from 'react';

export default function AnimatePresenceClient(props: PropsWithChildren<any>) {
  return <AnimatePresence {...props} />;
}
