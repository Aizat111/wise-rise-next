// import { Search } from 'lucide-react';
import { SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useRef, useState } from 'react';

import CloseBtn from '@/shared/ui/buttons/CloseBtn';
import Input from '@/shared/ui/inputs/Input';

type SearchHeaderProps = {
  search: string;
  onClose: () => void;
  setSearch: (_search: string) => void;
  leftIcon?: React.ReactNode;
  showRightIcon?: React.ReactNode;
  isOpen?: boolean;
};

const SearchHeader: FC<SearchHeaderProps> = ({
  onClose,
  setSearch,
  search,
  // leftIcon,
  showRightIcon = true,
  isOpen
}) => {
  const t = useTranslations();
  const [input, setInput] = useState(search);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInput(search);
  }, [search]);

  useEffect(() => {
    // Auto-focus on the input when the component mounts or when isOpen becomes true
    if (isOpen) {
      // Small delay to ensure the modal animation has started
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <div className="pt-4  flex bg-bg_color items-center justify-between">
      <Input
        ref={inputRef}
        background="slate"
        value={input}
        size="lg"
        leftIcon={<SearchIcon className="text-white" />}
        placeholder={t('search_games')}
        className="w-full"
        onChange={e => {
          const val = e.target.value;
          setInput(val);
          setSearch(val);
        }}
        // Match the same visual behavior as the primary desktop popover input
        // by relying on Input's 'slate' background and default focus styles.
        inputClassName="text-sm @[768px]:text-base"
        rightIcon={
          showRightIcon && <CloseBtn onClick={onClose} size="xs" className="rounded-full p-2 hover:bg-white/10" />
        }
      />
    </div>
  );
};

export default SearchHeader;
