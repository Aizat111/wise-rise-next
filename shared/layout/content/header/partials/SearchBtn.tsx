import { Button } from '@investorcentretb/toshi-ui';
import { useDispatch } from 'react-redux';

import { setDesktopHeaderSearchToggle } from '@/core/redux-toolkit/slices/uiSlice';
import SearchIcon from '@/shared/assets/header/Search';
import { useModalManager } from '@/shared/hooks/useModal';
import { useWindowSize } from '@/shared/hooks/useWindowSize';

const SearchBtn = () => {
  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const { openModal } = useModalManager();
  return (
    <Button
      intent="gray"
      appearance="3d"
      onClick={() => (width > 768 ? dispatch(setDesktopHeaderSearchToggle()) : openModal('search'))}
      className="w-10 h-10 text-white70 hidden md:flex"
      borderRadius="md"
      icon={<SearchIcon className="w-5 h-5" />}
    ></Button>
  );
};

export default SearchBtn;
