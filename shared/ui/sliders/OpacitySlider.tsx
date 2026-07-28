'use client';

import { useTranslations } from 'next-intl';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { cn } from '@/core/lib/utils';
import { setLiveStatsOpacity } from '@/core/redux-toolkit/slices/uiSlice';
import { useDebounce } from '@/shared/hooks/useDebounce';

type OpacitySliderProps = {
  disabled?: boolean;
  label?: string;
  isTranslated?: boolean;
  labelClass?: string;
  containerClass?: string;
  sliderContainerClass?: string;
  sliderClass?: string;
  opacity?: number;
  setOpacity?: (_opacity: number) => void;
};

const OpacitySlider: FC<OpacitySliderProps> = ({
  disabled,
  label,
  isTranslated,
  labelClass,
  containerClass,
  sliderContainerClass,
  sliderClass,
  opacity = 100,
  setOpacity
}) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const [localOpacity, setLocalOpacity] = useState(opacity);

  const debounce = useDebounce(localOpacity, 100);

  useEffect(() => {
    setOpacity?.(debounce);
    dispatch(setLiveStatsOpacity(debounce));
  }, [debounce]);

  return (
    <div className={cn('', containerClass)}>
      {label && (
        <label htmlFor={'opacity_slider'} className={cn('mb-1 block text-sm text-white70', labelClass)}>
          {isTranslated ? t(label) : label}
        </label>
      )}
      <div className={cn('relative w-full rounded-md  flex items-center pl-2 py-2 gap-2', sliderContainerClass)}>
        <div className={cn('relative text-white70')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#ebecf0" opacity="0.7">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M12 6v12c3.31 0 6-2.69 6-6s-2.69-6-6-6z" />
          </svg>
        </div>

        <input
          type="range"
          min="0.3"
          max="1"
          step="0.1"
          disabled={disabled}
          value={localOpacity}
          onChange={value => setLocalOpacity(Number(value.target.value))}
          onMouseDown={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
          className={cn(
            'w-[50px] h-[4px] bg-[#4A5568] rounded-2px outline-none cursor-pointer WebkitAppearance:none appearance:none',
            sliderClass
          )}
          style={{
            width: '50px',
            height: '4px',
            background: '#4A5568',
            borderRadius: '2px',
            outline: 'none',
            cursor: 'pointer',
            WebkitAppearance: 'none',
            appearance: 'none'
          }}
        />
      </div>
    </div>
  );
};

OpacitySlider.displayName = 'OpacitySlider';

export default OpacitySlider;
