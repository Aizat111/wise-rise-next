// import { Search } from 'lucide-react';
import { SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setDesktopHomeSearchToggle, setMobileSidebarSearchToggle } from '@/core/redux-toolkit/slices/uiSlice';
import { RootState } from '@/core/redux-toolkit/store';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import CloseBtn from '@/shared/ui/buttons/CloseBtn';
import Input from '@/shared/ui/inputs/Input';

type SearchHeaderMainProps = {
  search: string;
  onClose: () => void;
  setSearch: (_search: string) => void;
  // leftIcon?: React.ReactNode;
  showRightIcon?: React.ReactNode;
  suppressFocusToggle?: boolean;
  autoFocus?: boolean;
  onType?: (_value: string) => void;
};

const SearchHeaderMain: FC<SearchHeaderMainProps> = ({
  onClose,
  setSearch,
  search,
  // leftIcon,
  showRightIcon = true,
  suppressFocusToggle = false,
  autoFocus = false,
  onType
}) => {
  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const isDesktopHomeSearchOpen = useSelector((state: RootState) => state.ui.desktopHomeSearch);
  const t = useTranslations();
  const [input, setInput] = useState(search);
  const debouncedSetSearch = useDebounce(input, 500);
  const inputRef = useRef<HTMLInputElement>(null);
  const isDesktop = width > 768;

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

  useEffect(() => {
    // Only restore focus on visibility change for mobile flows
    if (!autoFocus || width > 768) return;
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        inputRef.current?.focus();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [autoFocus, width]);

  // On desktop, prevent cursor showing when overlay is closed (e.g., BFCache revisit)
  useEffect(() => {
    if (isDesktop && !isDesktopHomeSearchOpen && document.activeElement === inputRef.current) {
      inputRef.current?.blur();
    }
  }, [isDesktop, isDesktopHomeSearchOpen]);

  return (
    <div className="py-0 px-0  flex items-center justify-between">
      <Input
        ref={inputRef}
        background="slate"
        value={input}
        leftIcon={<SearchIcon className="text-white" />}
        placeholder={t('search_games')}
        className="w-full"
        size="lg"
        tabIndex={isDesktop && !isDesktopHomeSearchOpen ? -1 : 0}
        onMouseDown={() => {
          if (suppressFocusToggle) return;
          if (width > 768) {
            if (!isDesktopHomeSearchOpen) {
              dispatch(setDesktopHomeSearchToggle());
            }
          }
        }}
        onClick={() => {
          if (suppressFocusToggle) return;
          if (width <= 768) {
            dispatch(setMobileSidebarSearchToggle());
          }
        }}
        onChange={e => {
          setInput(e.target.value);
          onType?.(e.target.value);
        }}
        onFocus={() => {
          if (suppressFocusToggle) return;
          // No-op on mobile to avoid accidental opens on BFCache/visibility changes
        }}
        rightIcon={
          showRightIcon && <CloseBtn onClick={onClose} size="xs" className="rounded-full p-2 hover:bg-white/10" />
        }
      />
    </div>
  );
};

export default SearchHeaderMain;
