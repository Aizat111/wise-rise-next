'use client';

import * as Popover from '@radix-ui/react-popover';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Image from '../Images/Image';
import Input from '../inputs/Input';

import { cn } from '@/core/lib/utils';
import { useDebounce } from '@/shared/hooks/useDebounce';

export type Option = { value: string; label: string; icon?: string; name?: string; count?: number };

// Memoized search input component
export const SearchInput = ({
  searchable,
  query,
  setQuery,
  inputRef,
  t,
  filtered,
  handleSelection,
  setOpen
}: {
  searchable: boolean;
  query: string;
  setQuery: (_query: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  t: (_key: string) => string;
  filtered: Option[];
  handleSelection: (_option: Option) => void;
  setOpen: (_open: boolean) => void;
}) => {
  if (!searchable) return null;

  return (
    <div className="px-1 py-2 [touch-action:auto]">
      <Input
        ref={inputRef}
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={t('search')}
        selectAllOnFocus={false}
        className="[touch-action:auto]"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            if (filtered.length === 1) {
              handleSelection(filtered[0]);
              setOpen(false);
            }
          }
        }}
      />
    </div>
  );
};

export interface SearchableSelectProps {
  options: Option[];
  value?: string | string[];
  onChange?: (_value: Option | Option[] | undefined) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  labelClassName?: string;
  contentClassName?: string;
  triggerClassName?: string;
  textSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | string;
  searchable?: boolean;
  multiple?: boolean;
  selectAll?: boolean;
  selectAllLabel?: string;
  maxDisplayItems?: number;
  disabled?: boolean;
  showCountOnly?: boolean;
  arrowDownClassName?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'search_placeholder',
  triggerClassName = '',
  labelClassName = '',
  label,
  contentClassName = '',
  textSize = 'sm',
  searchable = true,
  multiple = false,
  selectAll = false,
  selectAllLabel = 'Select All',
  maxDisplayItems = 1,
  disabled = false,
  showCountOnly = false,
  arrowDownClassName = ''
}: SearchableSelectProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedItems, setSelectedItems] = useState<Option[]>([]);
  const debouncedQuery = useDebounce(query, 500);

  const filtered: Option[] = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return options;
    return options.filter(o => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q));
  }, [options, debouncedQuery]);

  // Check if all items are selected
  const allSelected = useMemo(() => {
    return (
      multiple &&
      filtered.length > 0 &&
      filtered.every(option => selectedItems.some(selected => selected.value === option.value))
    );
  }, [filtered, selectedItems, multiple]);

  // Handle selection logic
  const handleSelection = useCallback(
    (option: Option) => {
      if (!multiple) {
        onChange?.(option as Option);
        setOpen(false);
        return;
      }

      const isSelected = selectedItems.some(item => item.value === option.value);
      let newSelectedItems: Option[];

      if (isSelected) {
        newSelectedItems = selectedItems.filter(item => item.value !== option.value);
      } else {
        newSelectedItems = [...selectedItems, option];
      }

      setSelectedItems(newSelectedItems);
      onChange?.(newSelectedItems as Option[]);
    },
    [multiple, selectedItems, onChange]
  );

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (!multiple) return;

    if (allSelected) {
      // Deselect all filtered items
      const newSelectedItems = selectedItems.filter(
        selected => !filtered.some(filteredItem => filteredItem.value === selected.value)
      );
      setSelectedItems(newSelectedItems);
      onChange?.(newSelectedItems);
    } else {
      // Select all filtered items
      const newSelectedItems = [...selectedItems];
      filtered.forEach(option => {
        if (!newSelectedItems.some(item => item.value === option.value)) {
          newSelectedItems.push(option);
        }
      });
      setSelectedItems(newSelectedItems);
      onChange?.(newSelectedItems);
    }
  }, [multiple, allSelected, selectedItems, filtered, onChange]);

  // Update selected items when value prop changes
  useEffect(() => {
    if (multiple) {
      if (Array.isArray(value)) {
        const items = options.filter(option => value.includes(option.value));
        setSelectedItems(items);
      } else {
        setSelectedItems([]);
      }
    } else {
      const item = options.find(o => o.value === value);
      setSelectedItems(item ? [item] : []);
    }
  }, [options, value, multiple]);

  useEffect(() => {
    if (open && searchable && inputRef.current) {
      const timeout = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(timeout);
    }
  }, [open, searchable]);

  // Get display text for trigger
  const getDisplayText = () => {
    const sizeClassMap: Record<string, string> = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '15px': 'text-[15px]',
      '17px': 'text-[17px]'
    };
    const triggerTextSizeClass = sizeClassMap[textSize] || 'text-sm';

    if (!multiple) {
      const selectedItem = selectedItems[0];
      return selectedItem ? (
        <span className={cn('flex items-center gap-2', triggerTextSizeClass)}>
          {selectedItem.icon && <Image src={selectedItem.icon} alt={selectedItem.name || ''} width={20} height={20} />}
          {selectedItem.label}
        </span>
      ) : (
        <span className={cn('', triggerTextSizeClass)}>{t(placeholder as string)}</span>
      );
    }

    if (selectedItems.length === 0) {
      return <span className={cn('', triggerTextSizeClass)}>{t(placeholder as string)}</span>;
    }

    if (showCountOnly) {
      return <span className={cn('', triggerTextSizeClass)}>{selectedItems.length}</span>;
    }

    if (selectedItems.length === options.length && selectAll) {
      return <span className={cn('', triggerTextSizeClass)}>{selectAllLabel}</span>;
    }

    if (selectedItems.length <= maxDisplayItems) {
      return (
        <span className="flex items-center gap-1 flex-wrap">
          {selectedItems.map((item, index) => (
            <span key={item.value} className="flex items-center gap-1 text-sm">
              {item.icon && <Image src={item.icon} alt={item.name || ''} width={16} height={16} />}
              {item.label}
              {index < selectedItems.length - 1 && ','}
            </span>
          ))}
        </span>
      );
    }

    return (
      <span className="text-sm">
        {selectedItems.length} {t('selected') || 'items selected'}
      </span>
    );
  };

  return (
    <div className="w-full">
      {label && <label className={cn('text-sm block mb-1', labelClassName)}>{label}</label>}
      <Popover.Root open={open} onOpenChange={disabled ? undefined : setOpen}>
        <Popover.Trigger
          disabled={disabled}
          className={cn(
            'inline-flex items-center justify-between gap-2 px-3 py-2 rounded-md shadow-sm cursor-pointer focus:outline-none w-full',
            triggerClassName
          )}
          aria-label="Select"
        >
          <div>{getDisplayText()}</div>
          <ChevronDownIcon className={arrowDownClassName} />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            sideOffset={4}
            align="end"
            onOpenAutoFocus={e => e.preventDefault()}
            className={cn(
              'z-[1600] mt-0 min-w-[var(--radix-popover-trigger-width)] rounded-md bg-bg_menu/70 backdrop-blur-md shadow-lg pt-1 px-1 pb-2',
              '[touch-action:auto] [pointer-events:auto]',
              contentClassName
            )}
          >
            {/* Search input */}
            <SearchInput
              searchable={searchable}
              query={query}
              setQuery={setQuery}
              inputRef={inputRef}
              t={t}
              filtered={filtered}
              handleSelection={handleSelection}
              setOpen={setOpen}
            />

            <div className="max-h-60 overflow-auto mt-2 [touch-action:auto] no-scrollbar">
              {filtered.length === 0 ? (
                <div className="px-3 py-3 text-sm">{t('no_results')}</div>
              ) : (
                <div className="flex flex-col [touch-action:auto] no-scrollbar">
                  {/* Select All option */}
                  {multiple && selectAll && filtered.length > 0 && (
                    <div
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer px-3 flex items-center gap-2 py-2 text-sm hover:bg-bg_content focus:bg-bg_content outline-none border-b border-gray-200 [touch-action:auto] [pointer-events:auto]"
                      onClick={handleSelectAll}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectAll();
                        }
                      }}
                    >
                      <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                        {allSelected && <CheckIcon className="w-3 h-3" />}
                      </div>
                      <span className="font-medium">{selectAllLabel}</span>
                    </div>
                  )}

                  {/* Regular options */}
                  {filtered.map((opt, index) => {
                    const isSelected = selectedItems.some(item => item.value === opt.value);

                    return (
                      <div
                        key={`${opt.value}-${index}`}
                        role="button"
                        tabIndex={0}
                        className={cn(
                          'cursor-pointer px-3 flex items-center gap-2 py-2 text-base outline-none rounded-md',
                          'hover:text-white hover:bg-bg_content focus:bg-bg_content',
                          isSelected ? 'text-white bg-bg_content' : 'text-white50',
                          '[touch-action:auto] [pointer-events:auto]'
                        )}
                        onClick={() => handleSelection(opt)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelection(opt);
                          }
                        }}
                      >
                        {multiple && (
                          <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                            {isSelected && <CheckIcon className="w-3 h-3" />}
                          </div>
                        )}

                        {opt?.icon && <Image src={opt?.icon} alt={opt?.name || ''} width={20} height={20} />}

                        <span className="flex items-center justify-between gap-2 w-full">
                          {opt.label} {opt?.count && <span className="text-gray-300">({opt.count})</span>}
                        </span>

                        {!multiple && isSelected && (
                          <div className="ml-2 text-sm">
                            <CheckIcon />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
