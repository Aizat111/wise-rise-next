import { useMemo, useState } from 'react';

import { WHEEL_PAYOUTS, getMultiplierColor } from '@/core/constants/games/wheel.constants';
import { cn } from '@/core/lib/utils';
import { WheelRisk } from '@/core/types/wheel.types';
import ShowTextInput from '@/shared/ui/inputs/ShowTextInput';

interface Hash {
  hex: string;
  bytes: number[];
}

interface Extraction {
  cursor: number;
  hashIndex: number;
  offset: number;
  integer: number;
}

interface Randomization {
  limit: number;
  extractions: Extraction[];
  randomNumber: number;
  gameEvent: any;
}

interface FloatResult {
  hashes: Hash[];
  randomizations: Randomization[];
}

const Wheel = ({
  game: _game,
  floatResult,
  risk,
  numberOfSections
}: {
  game: string;
  floatResult: FloatResult | null;
  risk: WheelRisk;
  numberOfSections: number;
}) => {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [chanceTextHovered, setChanceTextHovered] = useState<string | null>(null);

  const segments = useMemo(() => {
    return WHEEL_PAYOUTS[numberOfSections]?.[risk] ?? [];
  }, [numberOfSections, risk]);

  const uniqueValues = useMemo(() => Array.from(new Set(segments)).sort((a, b) => a - b), [segments]);
  const handleChipLeave = () => {
    setHoveredValue(null);
    setChanceTextHovered(null);
  };

  const handleChipEnter = (value: number) => {
    setHoveredValue(value);
    setChanceTextHovered(`${segments.filter(s => s === value).length} / ${numberOfSections}`);
  };

  if (!floatResult) return null;

  const randomFloatingNumber = floatResult.randomizations[0]?.gameEvent?.randomFloatingNumber;

  const selectedSegmentIndex =
    randomFloatingNumber != null ? Math.floor(randomFloatingNumber * numberOfSections) : null;

  const selectedMultiplier =
    selectedSegmentIndex != null && segments[selectedSegmentIndex] != null ? segments[selectedSegmentIndex] : null;

  const chanceText = `${segments.filter(s => s === selectedMultiplier).length} / ${numberOfSections}`;

  return (
    <div>
      <div className="w-full mb-4">
        <ShowTextInput
          label="Chance"
          value={chanceTextHovered != null ? chanceTextHovered : chanceText}
          containerClassName="bg-toshi_body border border-white10 rounded-lg p-2"
        />
      </div>

      <div className="flex items-center relative justify-center gap-2 px-4 !w-full">
        {uniqueValues.map(value => {
          const color = getMultiplierColor(value);
          return (
            <div key={value} className="w-full">
              <button
                className={cn(
                  'group flex items-center justify-center w-full h-[40px] rounded-md text-sm font-bold relative overflow-hidden cursor-help',
                  'bg-bg_content text-white hover:bg-bg_content/80'
                )}
                onMouseEnter={() => handleChipEnter(value)}
                onMouseLeave={handleChipLeave}
                onTouchStart={() => handleChipEnter(value)}
                onTouchEnd={handleChipLeave}
                onClick={() => handleChipEnter(value)}
              >
                <span className="z-10">{value.toFixed(2)}x</span>

                <div
                  className={`absolute bottom-0 w-full z-0 h-[10%] group-hover:h-full transition-all duration-300`}
                  style={{
                    background: color,
                    height: selectedMultiplier === value || hoveredValue === value ? '100%' : ''
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wheel;
