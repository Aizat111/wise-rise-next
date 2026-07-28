'use client';

import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';

import AccordionMenuItem from './AccordionMenuItem';
import LanguageAccordionItem from './LanguageAccordionItem';
import { MenuItem } from './MenuItem';
import { cn } from '@/core/lib/utils';
import type { RootState } from '@/core/redux-toolkit/store';
import type { ISidebarItem } from '@/core/types/sidebar.types';

interface Props {
  title?: string;
  menu: ISidebarItem[];
}

export function SidebarMenu({ menu }: Props) {
  const pathname = usePathname();
  const { sidebarOpen: isShowedSidebar, mobileSidebarOpen } = useSelector((state: RootState) => state.ui);
  // Streaks is opened imperatively (no URL change), so pathname alone can't
  // tell us whether the sidebar entry should render as active. Read the modal
  // state directly and fold it into the active-state calc for items that lack
  // a `link`. See navigation.ts — the Streaks entry uses `onClick` + dispatch.
  const isStreaksModalOpen = useSelector(
    (state: RootState) => !Array.isArray(state.modals.modals.streaks) && !!state.modals.modals.streaks?.isOpen
  );
  const renderItem = (menuItem: ISidebarItem) => {
    // console.log(menuItem.link, pathname);

    const normalizePath = (p?: string) => {
      if (!p) return '';
      // Strip leading locale like /en or /en-US and trailing slash
      const withoutLocale = p.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/|$)/, '');
      const trimmed = withoutLocale.replace(/\/+$/, '');
      return trimmed === '' ? '/' : trimmed;
    };

    const pathNormalized = normalizePath(pathname || '');
    const linkNormalized = normalizePath(menuItem.link);

    const isActive =
      (!!linkNormalized && (pathNormalized === linkNormalized || pathNormalized.startsWith(linkNormalized + '/'))) ||
      (!menuItem.link && menuItem.label === 'streaks_sidebar' && isStreaksModalOpen);

    const props = {
      item: menuItem,
      isActive,
      isShowedSidebar,
      mobileSidebarOpen
    };
    if (menuItem.children && menuItem.label === 'language') {
      return <LanguageAccordionItem key={menuItem.label} {...props} />;
    }
    if (menuItem.children) {
      return <AccordionMenuItem key={menuItem.label} {...props} menuItem={menuItem} />;
    }
    return <MenuItem key={menuItem.label} {...props} />;
  };

  // Desktop (sidebar open, not mobile): render grouped sections
  if (isShowedSidebar && !mobileSidebarOpen) {
    const section1 = menu.filter(m => m.label === 'casino');
    const section2 = menu.filter(m => m.label === 'sports');
    const sectionLms = menu.filter(
      m =>
        m.label === 'last_man_standing_sidebar' || m.label === 'world_cup_hub_sidebar' || m.label === 'predict_sidebar'
    );
    const section3 = menu.filter(
      m =>
        m.label === 'rewards.rewards' ||
        m.label === 'streaks_sidebar' ||
        m.label === 'affiliatetext' ||
        m.label === 'viptext'
    );
    const section4 = menu.filter(m => m.label === 'farming_dashboard' || m.label === 'raffle_title');
    const section5 = menu.filter(m => m.label === 'language' || m.label === 'livesupport' || m.label === 'blog');

    return (
      <nav className={cn('p-0 rounded-md overflow-y-scroll h-[calc(100vh-100px)] no-scrollbar')}>
        <div className="flex flex-col gap-1">
          <ul className="sidebar-section flex flex-col gap-0">{section1.map(renderItem)}</ul>
          <ul className="sidebar-section flex flex-col gap-0">{section2.map(renderItem)}</ul>
          <ul className="sidebar-section flex flex-col gap-0">{sectionLms.map(renderItem)}</ul>
          <ul className="sidebar-section flex flex-col gap-0">{section3.map(renderItem)}</ul>
          <ul className="sidebar-section flex flex-col gap-0">{section4.map(renderItem)}</ul>
          <ul className="sidebar-section flex flex-col gap-0">{section5.map(renderItem)}</ul>
        </div>
      </nav>
    );
  }

  // Desktop (sidebar collapsed, not mobile): render the same grouped sections
  if (!isShowedSidebar && !mobileSidebarOpen) {
    const section1 = menu.filter(m => m.label === 'casino');
    const section2 = menu.filter(m => m.label === 'sports');
    const sectionLms = menu.filter(
      m =>
        m.label === 'last_man_standing_sidebar' || m.label === 'world_cup_hub_sidebar' || m.label === 'predict_sidebar'
    );
    const section3 = menu.filter(
      m =>
        m.label === 'rewards.rewards' ||
        m.label === 'streaks_sidebar' ||
        m.label === 'affiliatetext' ||
        m.label === 'viptext'
    );
    const section4 = menu.filter(m => m.label === 'farming_dashboard' || m.label === 'raffle_title');
    const section5 = menu.filter(m => m.label === 'language' || m.label === 'livesupport' || m.label === 'blog');

    const normalizeCollapsed = (p?: string) => {
      if (!p) return '';
      const withoutLocale = p.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/|$)/, '');
      const trimmed = withoutLocale.replace(/\/+$/, '');
      return trimmed === '' ? '/' : trimmed;
    };
    const pathNorm = normalizeCollapsed(pathname || '');
    // Streaks has no `link` — the sidebar entry dispatches openModal. Fold
    // the modal-open flag into isActive so the collapsed pill highlights
    // while the modal is open.
    const isCollapsedActive = (item: ISidebarItem) => {
      const linkNorm = normalizeCollapsed(item.link);
      if (linkNorm && (pathNorm === linkNorm || pathNorm.startsWith(linkNorm + '/'))) return true;
      if (!item.link && item.label === 'streaks_sidebar' && isStreaksModalOpen) return true;
      return false;
    };

    return (
      <nav className={cn('p-0 rounded-xl')}>
        <div className="flex flex-col gap-1">
          {section1.map(item => {
            const isActiveCollapsed = isCollapsedActive(item);
            return (
              <ul
                key={`collapsed-1-${item.label}`}
                className={cn(
                  'sidebar-section-collapsed relative group overflow-hidden rounded-lg hover:bg-white10 transition-colors duration-150',
                  isActiveCollapsed && 'bg-white50'
                )}
              >
                {renderItem(item)}
              </ul>
            );
          })}
          {section2.map(item => {
            const isActiveCollapsed = isCollapsedActive(item);
            return (
              <ul
                key={`collapsed-2-${item.label}`}
                className={cn(
                  'sidebar-section-collapsed relative group overflow-hidden rounded-lg hover:bg-white10 transition-colors duration-150',
                  isActiveCollapsed && 'bg-white50'
                )}
              >
                {renderItem(item)}
              </ul>
            );
          })}
          {sectionLms.map(item => {
            const isActiveCollapsed = isCollapsedActive(item);
            return (
              <ul
                key={`collapsed-lms-${item.label}`}
                className={cn(
                  'sidebar-section-collapsed relative group overflow-hidden rounded-lg hover:bg-white10 transition-colors duration-150',
                  isActiveCollapsed && 'bg-white50'
                )}
              >
                {renderItem(item)}
              </ul>
            );
          })}
          {section3.map(item => {
            const isActiveCollapsed = isCollapsedActive(item);
            return (
              <ul
                key={`collapsed-3-${item.label}`}
                className={cn(
                  'sidebar-section-collapsed relative group overflow-hidden rounded-lg hover:bg-white10 transition-colors duration-150',
                  isActiveCollapsed && 'bg-white50'
                )}
              >
                {renderItem(item)}
              </ul>
            );
          })}
          {section4.map(item => {
            const isActiveCollapsed = isCollapsedActive(item);
            return (
              <ul
                key={`collapsed-4-${item.label}`}
                className={cn(
                  'sidebar-section-collapsed relative group overflow-hidden rounded-lg hover:bg-white10 transition-colors duration-150',
                  isActiveCollapsed && 'bg-white50'
                )}
              >
                {renderItem(item)}
              </ul>
            );
          })}
          {section5.map(item => {
            const isActiveCollapsed = isCollapsedActive(item);
            return (
              <ul
                key={`collapsed-5-${item.label}`}
                className={cn(
                  'sidebar-section-collapsed relative group overflow-hidden rounded-lg hover:bg-white10 transition-colors duration-150',
                  isActiveCollapsed && 'bg-white50'
                )}
              >
                {renderItem(item)}
              </ul>
            );
          })}
        </div>
      </nav>
    );
  }

  // Mobile: flat list
  return (
    <nav className={cn('p-0 rounded-xl', !isShowedSidebar && 'p-0')}>
      <ul className="flex flex-col gap-0 md:pt-1 pt-0  md:gap-0">{menu.map(menuItem => renderItem(menuItem))}</ul>
    </nav>
  );
}
