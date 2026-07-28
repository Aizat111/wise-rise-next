'use client';

import { type CSSProperties, type FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';

import { usePathname } from '@/core/i18n/navigation';
import { clearMultiplayGames, setMultiplay } from '@/core/redux-toolkit/slices/gameSlice';
import GamesContent from '@/shared/components/modal/search/partials/GamesContent';
import SearchMobileSidebarMain from '@/shared/components/modal/search/partials/SearchMobileSidebarMain';

type MobileSearchOverlayProps = {
  open: boolean;
  onClose: () => void;
  widthPx?: number;
  offsetX?: number;
  offsetY?: number;
  topOffsetPx?: number;
  bottomOffsetPx?: number;
  zIndex?: number;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  contentClassName?: string;
  contentStyle?: CSSProperties;
};

/**
 * MobileSearchOverlay
 * Single-file, activatable overlay for mobile search.
 * Mimics competitor structure and integrates the mobile search content.
 */
const MobileSearchOverlay: FC<MobileSearchOverlayProps> = ({
  open,
  onClose,
  widthPx: _widthPx = 376,
  offsetY = 80,
  topOffsetPx = 70,
  bottomOffsetPx = 70,
  zIndex = 1449,
  overlayClassName,
  overlayStyle,
  contentClassName,
  contentStyle
}) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState<string>('');
  const pathname = usePathname();
  const [initialPath, setInitialPath] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [shouldRender, setShouldRender] = useState<boolean>(false);

  // Handle fade-in and swipe-down animations
  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setIsClosing(false);
      // Small delay to trigger animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 0);
      return () => clearTimeout(timer);
    } else {
      // Start closing animation
      setIsVisible(false);
      setIsClosing(true);
      // Unmount after animation completes
      const timer = setTimeout(() => {
        setIsClosing(false);
        setShouldRender(false);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    return () => {
      dispatch(setMultiplay(false));
      dispatch(clearMultiplayGames());
      setSearch('');
    };
  }, [open, dispatch]);

  // Capture initial path when overlay opens
  useEffect(() => {
    if (open && initialPath === null) {
      setInitialPath(pathname);
    }
    if (!open) {
      setInitialPath(null);
    }
  }, [open, pathname, initialPath]);

  // Close overlay automatically on route change
  useEffect(() => {
    if (!open || initialPath === null) return;
    if (pathname !== initialPath) {
      onClose();
    }
  }, [pathname, open, initialPath, onClose]);

  if (!shouldRender && !isClosing) return null;

  const overlayNode = (
    <>
      <div
        className={`search-overlay-main overflow-hidden fixed inset-0 transition-opacity duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${overlayClassName ?? ''}`}
        style={{
          zIndex,
          background: 'var(--color-bg_color)',
          top: `${topOffsetPx}px`,
          bottom: `${bottomOffsetPx}px`,
          ...overlayStyle
        }}
        onClick={onClose}
        aria-hidden
      />
      <div
        data-portal="true"
        className={`search-content overflow-hidden mobile pt-2 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${contentClassName ?? ''}`}
        style={{
          zIndex,
          width: `100vw`,
          position: 'fixed',
          top: 0,
          left: '50%',
          margin: 0,
          transform: `translate3d(-50%, ${isVisible ? offsetY : offsetY + 40}px, 0px)`,
          height: `calc(100dvh - ${offsetY}px - ${bottomOffsetPx}px)`,
          maxHeight: `calc(100dvh - ${offsetY}px - ${bottomOffsetPx}px)`,
          ...contentStyle
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col gap-4 w-full h-full min-h-0 border-none mx-auto rounded-lg transition-all duration-300 ease-out px-6 pb-4">
          <SearchMobileSidebarMain
            onClose={() => {
              setSearch('');
              onClose();
            }}
            setSearch={setSearch}
            search={search}
            showRightIcon
            suppressFocusToggle
            autoFocus
          />
          {/* {search && (
            <div className="flex items-center justify-between max-sm:flex-col max-sm:gap-2"></div>
          )} */}
          {search && (
            <div
              className="overflow-y-auto no-scrollbar flex-1 min-h-0 pt-0"
              style={{ paddingBottom: `${bottomOffsetPx + 16}px` }}
            >
              <GamesContent search={search} />
              {/* <div className="mt-0 mt-4">
                <RecentlyPlayedGames />
              </div> */}
            </div>
          )}
        </div>
      </div>
    </>
  );

  // Render to body for true overlay behavior
  if (typeof document !== 'undefined') {
    return createPortal(overlayNode, document.body);
  }

  return overlayNode;
};

export default MobileSearchOverlay;
