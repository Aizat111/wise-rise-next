'use client';

import * as Popover from '@radix-ui/react-popover';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import Image from '../Images/Image';
import Input from '../inputs/Input';

import { cn } from '@/core/lib/utils';
import type { CurrencyDep } from '@/core/types/deposit.types';
import { useDebounce } from '@/shared/hooks/useDebounce';

export interface CurrencyDepSelectProps {
  options: CurrencyDep[];
  value?: string;
  onChange?: (_value: CurrencyDep | undefined) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  labelClassName?: string;
  contentClassName?: string;
  triggerClassName?: string;
}

export default function CurrencyDepSelect({
  options,
  value,
  onChange,
  placeholder = 'search_placeholder',
  triggerClassName = '',
  labelClassName = '',
  label,
  contentClassName = ''
}: CurrencyDepSelectProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debouncedQuery = useDebounce(query, 200);
  const [filtered, setFiltered] = useState<CurrencyDep[]>(options);
  const [selectedOption, setSelectedOption] = useState<CurrencyDep | undefined>(undefined);

  /** Value değiştiğinde seçili opsiyonu güncelle */
  useEffect(() => {
    setSelectedOption(options.find(o => o.name === value));
  }, [options, value]);

  useEffect(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) setFiltered(options);
    else setFiltered(options.filter(o => o.name.toLowerCase().includes(q)));
  }, [options, debouncedQuery]);

  useEffect(() => {
    if (open && inputRef.current) {
      const timeout = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(timeout);
    }
  }, [open, debouncedQuery]);

  return (
    <div className="w-full">
      {label && <label className={cn('text-sm block mb-1', labelClassName)}>{label}</label>}

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          className={cn(
            'inline-flex items-center justify-between gap-2 px-3 py-2 rounded-md shadow-sm w-full',
            triggerClassName
          )}
          aria-label={label || 'Select currency'}
        >
          {selectedOption ? (
            <span className="flex items-center gap-2 text-sm">
              {selectedOption.icon && (
                <Image src={selectedOption.icon} alt={selectedOption.name} width={20} height={20} />
              )}
              {selectedOption.name}
            </span>
          ) : (
            <span className="text-sm opacity-70">{t(placeholder)}</span>
          )}
          <ChevronDownIcon className="w-4 h-4" />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            sideOffset={4}
            align="end"
            onPointerDownOutside={event => {
              const target = event.target as HTMLElement;
              if (inputRef.current?.contains(target)) {
                event.preventDefault();
              }
              if (target.closest('[data-search-input]')) {
                event.preventDefault();
              }
            }}
            onOpenAutoFocus={e => e.preventDefault()}
            className={cn(
              'z-[1600] rounded-md bg-bg_menu/70 backdrop-blur-md shadow-lg pt-0 px-1 pb-2',
              '[touch-action:auto] [pointer-events:auto]',
              contentClassName
            )}
          >
            {/* Search Input */}
            <div className="py-2 sticky top-0 bg-bg_menu/80 backdrop-blur-sm [touch-action:auto]">
              <Input
                data-search-input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('search')}
                aria-label="Search currency"
                className="rounded-md w-full [touch-action:auto]"
                selectAllOnFocus={false}
                onKeyDown={e => {
                  if (e.key === 'Enter' && filtered.length === 1) {
                    onChange?.(filtered[0]);
                    setOpen(false);
                  }
                }}
              />
            </div>

            <div className="max-h-60 overflow-auto mt-1 [touch-action:auto] no-scrollbar">
              {filtered.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">{t('no_results')}</div>
              ) : (
                filtered.map(opt => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => {
                      onChange?.(opt);
                      setOpen(false);
                    }}
                    className={cn(
                      'cursor-pointer px-3 flex items-center gap-2 py-2 text-sm rounded-sm w-full',
                      'focus:bg-bg_content hover:bg-bg_content outline-none transition-colors',
                      '[touch-action:auto] [pointer-events:auto]'
                    )}
                  >
                    {opt.icon && <Image src={opt.icon} alt={opt.name} width={20} height={20} />}
                    <span>{opt.name}</span>
                    {opt.name === value && (
                      <span className="ml-auto">
                        <CheckIcon className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
