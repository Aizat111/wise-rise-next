// import { Search } from 'lucide-react';
import { SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setMobileSidebarSearchToggle } from '@/core/redux-toolkit/slices/uiSlice';
import { useDebounce } from '@/shared/hooks/useDebounce';
import CloseBtn from '@/shared/ui/buttons/CloseBtn';
import Input from '@/shared/ui/inputs/Input';

type SearchMobileSidebarMainProps = {
  search: string;
  onClose: () => void;
  setSearch: (_search: string) => void;
  leftIcon?: React.ReactNode;
  showRightIcon?: React.ReactNode;
  suppressFocusToggle?: boolean;
  autoFocus?: boolean;
};

const SearchMobileSidebarMain: FC<SearchMobileSidebarMainProps> = ({
  onClose,
  setSearch,
  search,
  // leftIcon,
  showRightIcon = true,
  suppressFocusToggle = false,
  autoFocus = false
}) => {
  const dispatch = useDispatch();
  const t = useTranslations();
  const [input, setInput] = useState(search);
  const debouncedSetSearch = useDebounce(input, 500);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearch(debouncedSetSearch);
  }, [debouncedSetSearch]);

  useEffect(() => {
    setInput(search);
  }, [search]);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  return (
    <div className="py-0 px-0 flex items-center w-full justify-between ">
      <Input
        ref={inputRef}
        value={input}
        leftIcon={<SearchIcon className="text-white" />}
        placeholder={t('search_games')}
        className="w-full"
        size="lg"
        onChange={e => {
          setInput(e.target.value);
        }}
        onFocus={() => {
          if (!suppressFocusToggle) {
            dispatch(setMobileSidebarSearchToggle());
          }
        }}
        inputClassName="mb-1.25 cursor-text max-w-none w-full text-sm @[768px]:text-base text-white50   bg-lightgrey border-white/10  1px solid rgba(255, 255, 255, 0.1)"
        rightIcon={
          showRightIcon && <CloseBtn onClick={onClose} size="xs" className="rounded-full p-2 hover:bg-white/10" />
        }
      />
    </div>
  );
};

export default SearchMobileSidebarMain;
