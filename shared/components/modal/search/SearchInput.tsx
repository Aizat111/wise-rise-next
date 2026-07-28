import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DesktopSearchOverlay from './DesktopSearchOverlay';
import MobileSearchOverlay from './MobileSearchOverlay';
import GamesContent from './partials/GamesContent';
import MultiplayGames from './partials/MultiplayGames';
import SearchHeaderMain from './partials/SearchHeaderMain';
import TrendingList from './partials/TrendingList';
import { usePathname } from '@/core/i18n/navigation';
import { cn } from '@/core/lib/utils';
import { clearMultiplayGames, setMultiplay } from '@/core/redux-toolkit/slices/gameSlice';
import {
  closeDesktopHomeSearch,
  closeMobileSidebarSearch,
  setDesktopHomeSearchToggle
} from '@/core/redux-toolkit/slices/uiSlice';
import { RootState } from '@/core/redux-toolkit/store';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import SwitchInput from '@/shared/ui/inputs/SwitchInput';

const SearchInput = () => {
  const desktopHomeSearch = useSelector((state: RootState) => state.ui.desktopHomeSearch);
  const mobileSidebarSearchOpen = useSelector((state: RootState) => state.ui.mobileSidebarSearchOpen);
  const [search, setSearch] = useState<string>('');
  const [typed, setTyped] = useState<string>('');
  const multiplay = useSelector((state: RootState) => state.game.multiplay);
  const dispatch = useDispatch();
  const anchorRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { width } = useWindowSize();
  const [anchorWidth, setAnchorWidth] = useState<number>(0);
  useEffect(() => {
    return () => {
      dispatch(setMultiplay(false));
      dispatch(clearMultiplayGames());
    };
  }, []);

  // Close desktop overlay on route change (prevents auto-reopen on browser back)
  useEffect(() => {
    if (desktopHomeSearch) {
      setSearch('');
      dispatch(closeDesktopHomeSearch());
    }
  }, [pathname]);

  // Track anchor width for responsive overlay content
  useLayoutEffect(() => {
    const updateAnchorWidth = () => {
      if (anchorRef.current) {
        setAnchorWidth(anchorRef.current.getBoundingClientRect().width);
      }
    };

    updateAnchorWidth();
    window.addEventListener('resize', updateAnchorWidth);
    return () => window.removeEventListener('resize', updateAnchorWidth);
  }, []);

  //  THIS IS MID PAGE SEARCH BAR
  return (
    <div ref={anchorRef}>
      <div
        className={cn(
          'flex flex-col relative gap-2 w-full h-fit focus-within:z-[1450] max-w-[1200px] mx-auto rounded-lg px-0 transition-all duration-300 ease-out'
        )}
      >
        <SearchHeaderMain
          onClose={() => {
            setSearch('');
            setTyped('');
            dispatch(closeDesktopHomeSearch());
          }}
          setSearch={setSearch}
          search={search}
          autoFocus={desktopHomeSearch}
          showRightIcon={!!search}
          onType={value => {
            setTyped(value);
            if (width > 768 && !desktopHomeSearch) {
              dispatch(setDesktopHomeSearchToggle());
            }
          }}
        />
      </div>
      {width > 768 && (
        <DesktopSearchOverlay
          open={desktopHomeSearch}
          onClose={() => {
            setSearch('');
            dispatch(closeDesktopHomeSearch());
          }}
          anchorRef={anchorRef as unknown as React.RefObject<HTMLElement>}
          widthPx={962.734}
          zIndex={1449}
          offsetY={16}
          contentClassName="desktop-search-overlay"
          contentVisible={Boolean(typed)}
          matchAnchorWidth
          forceOpenAbove={(() => {
            if (typeof window === 'undefined') return false;
            const el = (anchorRef as unknown as React.RefObject<HTMLElement>)?.current;
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            return spaceBelow < 300;
          })()}
        >
          {typed && (
            <div
              className={cn(
                'bg-bg_color/80 backdrop-blur-sm border-[3px] border-white10 rounded-lg w-full',
                anchorWidth <= 768 ? 'pt-0 px-4 pb-4' : 'p-4'
              )}
            >
              {anchorWidth >= 768 && (
                <div className="flex items-center justify-between">
                  <TrendingList setSearch={setSearch} activeSearch={typed} />
                  <SwitchInput
                    label="multiplay"
                    variant="success"
                    checked={multiplay}
                    onCheckedChange={value => {
                      dispatch(setMultiplay(value));
                      dispatch(clearMultiplayGames());
                    }}
                  />
                </div>
              )}
              <div className="max-h-[450px] bg-transparent no-scrollbar overflow-y-auto">
                {anchorWidth >= 768 && <MultiplayGames />}
                <GamesContent search={typed} />
                {/* <RecentlyPlayedGames /> */}
              </div>
            </div>
          )}
        </DesktopSearchOverlay>
      )}
      {width <= 768 && (
        <MobileSearchOverlay
          open={mobileSidebarSearchOpen}
          onClose={() => dispatch(closeMobileSidebarSearch())}
          topOffsetPx={70}
        />
      )}
    </div>
  );
};

export default SearchInput;
