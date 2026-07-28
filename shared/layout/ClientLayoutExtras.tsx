'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Reduce initial JS evaluation: split non-critical client UI into separate chunks.
const ChatPanel = dynamic(() => import('./chat-panel'), { loading: () => null });
const MobileSidebar = dynamic(() => import('./sidebar/MobileSidebar'), { loading: () => null });
const BottomNavigation = dynamic(() => import('./bottom-navigation/BottomNavigation'), {
  loading: () => null
});

function MobileSidebarAfterMount() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return <MobileSidebar />;
}

export default function ClientLayoutExtras() {
  return (
    <>
      <ChatPanel />
      <MobileSidebarAfterMount />
      <BottomNavigation />
    </>
  );
}
