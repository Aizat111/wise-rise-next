'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { SidebarHeader } from './header/SidebarHeader';
import { SidebarMenu } from './menus/SidebarMenu';
import { cn } from '@/core/lib/utils';
import type { RootState } from '@/core/redux-toolkit/store';
import { SIDEBAR_DATA } from '@/data/navigation';
import { useWindowSize } from '@/shared/hooks/useWindowSize';

// Only on mobile/tablet: lazy-load sidebar header/menu to reduce initial JS.
// Desktop stays static (no dynamic).
const SidebarHeaderLazy = dynamic(() => import('./header/SidebarHeader').then(m => m.SidebarHeader), {
  loading: () => <div className="h-[70px]" />
}) as unknown as typeof SidebarHeader;

const SidebarMenuLazy = dynamic(() => import('./menus/SidebarMenu').then(m => m.SidebarMenu), {
  loading: () => <div className="h-[200px]" />
}) as unknown as typeof SidebarMenu;

export function Sidebar() {
  const isShowedSidebar = useSelector((state: RootState) => state.ui.sidebarOpen);
  const { width } = useWindowSize();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  // Avoid width-based class differences during SSR/first render to prevent hydration mismatch
  const overlayActive = mounted && isShowedSidebar && width < 1200;
  const isMobile = mounted && width < 1200;
  const HeaderComp = isMobile ? SidebarHeaderLazy : SidebarHeader;
  const MenuComp = isMobile ? SidebarMenuLazy : SidebarMenu;
  return (
    <aside
      className={cn(
        'p-0 bg-toshi_body whitespace-nowrap overflow-hidden fixed left-4 top-2 max-w-[208px] h-full hidded-sidebar',
        !isShowedSidebar && 'pr-0 top-2.5 left-4 max-w-[43px]',
        overlayActive ? 'z-[1599] left-0 top-0 p-3 max-w-[228px]' : 'z-[900]'
      )}
    >
      <HeaderComp />
      <MenuComp menu={SIDEBAR_DATA} />
    </aside>
  );
}
