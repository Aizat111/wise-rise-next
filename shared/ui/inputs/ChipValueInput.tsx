'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

import CurrencyValue from '../CurrencyValue';

import { cn } from '@/core/lib/utils';
import { formatChipValue, formatChipValueForColor } from '@/shared/utils/rouletteUtils';

type ChipValueInputProps = {
  value: number;
  onChange: (_value: number) => void;
  currency?: string;
  disabled?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  chips?: number[];
  min?: number;
  max?: number;
};

export const DEFAULT_CHIPS = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000];

export const Chip: FC<{
  value: number;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ value, isSelected, onClick, disabled, className }) => {
  return (
    <button
      key={value}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex-shrink-0 rounded-full h-9 w-9 flex items-center justify-center',
        'transition-all duration-200 z-10',
        'font-bold text-xs ',
        className,
        isSelected && 'border-white scale-95 border-[4px]',
        !isSelected && 'border-transparent hover:scale-105 hover:shadow-md',
        disabled && 'opacity-50 cursor-not-allowed grayscale'
      )}
      aria-label={`Select chip value ${value}`}
    >
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background: formatChipValueForColor(value),
          backgroundImage: 'url(/assets/svgs/chip_top.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <span className="relative z-10 text-xs font-tusker_grotesk chip-value">{formatChipValue(value)}</span>
    </button>
  );
};

const ChipValueInput: FC<ChipValueInputProps> = ({
  value,
  onChange,
  disabled = false,
  containerClassName,
  labelClassName,
  chips = DEFAULT_CHIPS,
  min,
  max
}) => {
  const t = useTranslations();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 1);
  }, []);

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [checkScrollability]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -120, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 120, behavior: 'smooth' });
    }
  };

  const handleChipClick = (chipValue: number) => {
    if (disabled) return;
    let newValue = chipValue;
    if (min !== undefined && newValue < min) newValue = min;
    if (max !== undefined && newValue > max) newValue = max;
    onChange(newValue);
  };

  // Filter chips based on min/max if provided
  const availableChips = chips.map(chip => {
    if (min !== undefined && chip < min) return { chip, isAvailable: false };
    if (max !== undefined && chip > max) return { chip, isAvailable: false };
    return { chip, isAvailable: true };
  });

  return (
    <div className={cn('w-full', containerClassName)}>
      {/* Label and Value Display */}
      <div className={cn('mb-1 flex items-center justify-between', labelClassName)}>
        <label className="text-sm text-white70">{t('chip_value') || 'Chip Value'}</label>
        <span className="text-sm text-white70">
          <CurrencyValue value={value / 100} />
        </span>
      </div>

      <div className="relative flex items-center gap-2 rounded-lg bg-bg_content p-2">
        <Button
          icon={<ChevronLeft className="size-4" />}
          iconOnly
          intent="gray"
          size="xs"
          onClick={scrollLeft}
          disabled={!canScrollLeft || disabled}
          className="flex-shrink-0 !bg-bg_content"
          aria-label="Scroll left"
        />
        <div
          ref={scrollContainerRef}
          className="flex flex-1 gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {availableChips.map(chipValue => {
            const isSelected = value === chipValue.chip;
            return (
              <Chip
                key={chipValue.chip.toString()}
                value={chipValue.chip}
                isSelected={isSelected}
                onClick={() => handleChipClick(chipValue.chip)}
                disabled={disabled || !chipValue.isAvailable}
              />
            );
          })}
        </div>

        <Button
          icon={<ChevronRight className="size-4" />}
          iconOnly
          intent="gray"
          size="xs"
          onClick={scrollRight}
          disabled={!canScrollRight || disabled}
          className="flex-shrink-0 rounded-md !bg-bg_content"
          aria-label="Scroll right"
        />
      </div>
    </div>
  );
};

export default ChipValueInput;
