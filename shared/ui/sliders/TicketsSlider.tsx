import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FC } from 'react';

import { cn } from '@/core/lib/utils';

const defaultMarks = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%'
};

interface TicketsSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (_value: number) => void;
  marks?: {
    [key: number]: string;
  };
  disabled?: boolean;
  className?: string;
}

const TicketsSlider: FC<TicketsSliderProps> = ({
  min = 2,
  max = 98,
  value = 50,
  onChange,
  marks = defaultMarks,
  disabled,
  className
}) => {
  return (
    <div className={cn('w-full mx-auto px-0 rounded-lg flex justify-center items-center', className)}>
      {/* Slider value bubble (visible while dragging) */}
      <Slider
        className="tickets-slider"
        min={min}
        max={max}
        value={value}
        onChange={(val: number | number[]) => {
          if (Array.isArray(val)) {
            return;
          }
          const newValue = val as number;
          if (newValue < min || newValue > max) {
            return;
          }
          onChange(newValue);
        }}
        marks={marks}
        disabled={disabled}
        styles={{
          track: {
            backgroundColor: '#FF6100',
            height: 8,
            borderRadius: 8
          },
          handle: {
            backgroundColor: '#FF6100',
            borderColor: '#FF6100',
            boxShadow: 'none',
            opacity: 1,
            width: 24,
            height: 24,
            marginTop: -10
          },
          rail: {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            height: 4,
            borderRadius: 8
          }
        }}
      />
    </div>
  );
};

export default TicketsSlider;
