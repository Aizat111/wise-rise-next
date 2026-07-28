import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Modal } from '../Modal';

import GamesContent from './partials/GamesContent';
import MultiplayGames from './partials/MultiplayGames';
import SearchHeader from './partials/SearchHeader';
import TrendingList from './partials/TrendingList';
import { clearMultiplayGames, setMultiplay } from '@/core/redux-toolkit/slices/gameSlice';
import { RootState } from '@/core/redux-toolkit/store';
import SwitchInput from '@/shared/ui/inputs/SwitchInput';

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [search, setSearch] = useState<string>('');
  const multiplay = useSelector((state: RootState) => state.game.multiplay);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setMultiplay(false));
      dispatch(clearMultiplayGames());
    };
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} size="full" zIndex={1500}>
      <div className="flex flex-col gap-4 mb-5 max-w-[1200px] mx-auto">
        <SearchHeader onClose={onClose} setSearch={setSearch} search={search} isOpen={isOpen} />
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
        <MultiplayGames />
        <GamesContent search={search} />
      </div>
    </Modal>
  );
};

export default SearchModal;
