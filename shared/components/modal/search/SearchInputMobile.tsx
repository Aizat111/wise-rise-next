import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import RecentlyPlayedGames from '../../carousel/RecentlyPlayedGames';

import GamesContent from './partials/GamesContent';
import SearchMobileSidebarMain from './partials/SearchMobileSidebarMain';
import { cn } from '@/core/lib/utils';
import { clearMultiplayGames, setMultiplay } from '@/core/redux-toolkit/slices/gameSlice';
import { closeMobileSidebarSearch } from '@/core/redux-toolkit/slices/uiSlice';
import { RootState } from '@/core/redux-toolkit/store';

const SearchInputMobile = () => {
  const mobileSidebarSearchOpen = useSelector((state: RootState) => state.ui.mobileSidebarSearchOpen);
  const [search, setSearch] = useState<string>('');

  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setMultiplay(false));
      dispatch(clearMultiplayGames());
    };
  }, []);

  return (
    <div>
      {mobileSidebarSearchOpen && (
        <div
          aria-hidden={true}
          onClick={() => {
            setSearch('');
            dispatch(closeMobileSidebarSearch());
          }}
          className="h-[100dvh] w-[100vw] z-[1449] fixed top-[70px] left-0  transition-opacity duration-300"
        ></div>
      )}

      <div
        className={cn(
          'flex flex-col z-[1449] relative gap-2 w-full h-fit  border-none mx-auto rounded-lg  transition-all duration-300 ease-out mb-5'
        )}
      >
        <SearchMobileSidebarMain
          onClose={() => {
            setSearch('');
            dispatch(closeMobileSidebarSearch());
          }}
          setSearch={setSearch}
          search={search}
          showRightIcon={!!search}
        />

        {/* {search && (
          <div className="flex items-center justify-between max-sm:flex-col max-sm:gap-2">
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
        )} */}
        {search && (
          <div className=" overflow-y-auto no-scrollbar">
            {/* <MultiplayGames /> */}
            <GamesContent search={search} />
            <RecentlyPlayedGames />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInputMobile;
