import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import GamesContent from './partials/GamesContent';
import MultiplayGames from './partials/MultiplayGames';
import SearchHeader from './partials/SearchHeader';
import TrendingList from './partials/TrendingList';
import { cn } from '@/core/lib/utils';
import { clearMultiplayGames, setMultiplay } from '@/core/redux-toolkit/slices/gameSlice';
import { setDesktopHeaderSearchToggle } from '@/core/redux-toolkit/slices/uiSlice';
import { RootState } from '@/core/redux-toolkit/store';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import SwitchInput from '@/shared/ui/inputs/SwitchInput';

const SearchDropdown = () => {
  const desktopHeaderSearchOpen = useSelector((state: RootState) => state.ui.desktopHeaderSearchOpen);
  const { width: _width } = useWindowSize();
  const [search, setSearch] = useState<string>('');
  const multiplay = useSelector((state: RootState) => state.game.multiplay);
  const dispatch = useDispatch();
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    return () => {
      dispatch(setMultiplay(false));
      dispatch(clearMultiplayGames());
    };
  }, []);

  useEffect(() => {
    if (desktopHeaderSearchOpen) {
      searchDropdownRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      searchDropdownRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [desktopHeaderSearchOpen]);

  // When closed, fully reset and unmount overlay (no invisible DOM left behind)
  useEffect(() => {
    if (!desktopHeaderSearchOpen) {
      setSearch('');
      dispatch(clearMultiplayGames());
    }
  }, [desktopHeaderSearchOpen]);

  if (!desktopHeaderSearchOpen) {
    return null;
  }

  // THIS IS THE HEADER SEARCH BAR
  const overlayNode = (
    <div
      ref={searchDropdownRef}
      className={cn(
        'absolute inset-0 mx-4 transition-opacity duration-200 ease-out',
        'opacity-100 pointer-events-auto'
      )}
    >
      {/* Backdrop (exclude header area via top offset above) */}
      {/* Header overlay (transparent, blocks interactions over header area) */}
      <div
        aria-hidden={true}
        onClick={() => dispatch(setDesktopHeaderSearchToggle())}
        className="fixed left-0 right-0 top-0 h-[70px] bg-transparent z-[1449]"
      />
      <div
        aria-hidden={true}
        onClick={() => dispatch(setDesktopHeaderSearchToggle())}
        className="fixed inset-0 bg-[rgba(6,14,32,0.7)] z-[1449] transition-opacity duration-200"
        style={{ top: 70 }}
      />
      {/* Search input bar fixed below header, outside the popover content */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-[1450] w-full max-w-[1200px]"
        style={{
          top: 0,
          minWidth: 600
        }}
      >
        <div className="bg-transparent w-full">
          <SearchHeader
            onClose={() => {
              dispatch(setDesktopHeaderSearchToggle());
            }}
            setSearch={setSearch}
            search={search}
            isOpen={desktopHeaderSearchOpen}
          />
        </div>
      </div>
      {/* Popover content, centered below header, fades in only when typing on desktop */}
      <div
        className={cn(
          'absolute left-1/2 -translate-x-1/2 z-[1450] transition-opacity duration-160 ease-out w-full max-w-[1200px]',
          search ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{
          top: 76,
          minWidth: 600
        }}
      >
        <div className="flex flex-col gap-2 bg-bg_color/80 backdrop-blur-sm p-4 border-2 border-white10 rounded-lg w-full">
          <div className="flex items-center justify-between">
            <TrendingList setSearch={setSearch} activeSearch={search} />
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
          <div className={cn('no-scrollbar overflow-y-auto', 'max-h-[450px]')}>
            <MultiplayGames />
            <GamesContent search={search} />
            {/* <RecentlyPlayedGames /> */}
          </div>
        </div>
      </div>
    </div>
  );

  // Mount within the inner content container for proper responsiveness
  if (typeof document !== 'undefined') {
    const container = document.querySelector('.contents-container');
    if (container) {
      return createPortal(overlayNode, container);
    }
  }
  return null;
};

export default SearchDropdown;
