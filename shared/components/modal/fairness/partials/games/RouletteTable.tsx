'use client';

import { FC, useState } from 'react';

import { BET_INITIAL_STATE, BET_TYPES, ROULETTE_COLORS } from '@/core/constants/games/roulette.constants';
import { cn } from '@/core/lib/utils';
import { RouletteBetsState } from '@/core/types/roulette.types';
import { Chip, DEFAULT_CHIPS } from '@/shared/ui/inputs/ChipValueInput';
import { isNumberHighlighted } from '@/shared/utils/rouletteUtils';

type RouletteTableProps = {
  bets: RouletteBetsState;
  className?: string;
  randomNumber: number | null;
};

const getChips = (amount: number) => {
  let currentAmount = amount;
  const chips: number[] = [];
  const sortedChips = [...DEFAULT_CHIPS].sort((a, b) => b - a);

  for (const chipValue of sortedChips) {
    const count = Math.floor(currentAmount / chipValue);
    for (let i = 0; i < count; i++) {
      chips.push(chipValue);
      if (chips.length >= 10) return chips;
    }
    currentAmount %= chipValue;
  }
  return chips.reverse();
};

const RouletteTable: FC<RouletteTableProps> = ({ bets = BET_INITIAL_STATE, className, randomNumber }) => {
  const [hoveredBet, setHoveredBet] = useState<{ type: keyof RouletteBetsState; index: number } | null>(null);

  const getBetAmount = (type: keyof RouletteBetsState, index: number) => {
    if (!bets[type]) return 0;
    const betType = bets[type] as Record<string, number>;
    return betType[String(index)] || 0;
  };

  const renderChips = (amount: number) => {
    if (amount <= 0) return null;
    const chips = getChips(amount);
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none flex items-center justify-center">
        {chips.map((chipVal, i) => (
          <div
            key={i}
            className="absolute transition-transform duration-200"
            style={{
              transform: `translateY(-${i * 4}px)`,
              zIndex: i
            }}
          >
            <Chip
              value={i === chips.length - 1 ? amount : chipVal}
              isSelected={false}
              onClick={() => {}}
              className="text-[10px] shadow-md hover:scale-100 ring-0 hover:shadow-md border border-black/20"
            />
          </div>
        ))}
      </div>
    );
  };

  const renderCell = (
    label: string | number | React.ReactNode,
    type: keyof RouletteBetsState,
    index: number,
    colorClass: string = 'bg-toshi_card',
    colSpan: number = 1,
    rowSpan: number = 1,
    isRotate: boolean = false
  ) => {
    const amount = getBetAmount(type as keyof RouletteBetsState, index);
    const isHovered = hoveredBet?.type === type && hoveredBet?.index === index;

    const rotateClass = isRotate ? '-rotate-90' : '';

    return (
      <div
        aria-label={`Place bet on ${label}`}
        aria-hidden="true"
        onMouseEnter={() => setHoveredBet({ type, index })}
        onMouseLeave={() => setHoveredBet(null)}
        className={cn(
          'relative flex items-center justify-center border border-white/10 hover:brightness-125 cursor-pointer select-none transition-all rounded-md',
          colorClass,
          isHovered && 'ring-1 ring-yellow-400 ring-opacity-75 brightness-150',
          rotateClass
        )}
        style={{
          gridColumn: `span ${colSpan}`,
          gridRow: `span ${rowSpan}`
        }}
      >
        <span className="text-white font-bold text-sm">{label}</span>
        {renderChips(amount)}
      </div>
    );
  };

  return (
    <div className="h-[500px] overflow-y-auto no-scrollbar flex justify-center items-center">
      <div className={cn('flex flex-col rotate-90', className)}>
        {/* Main Grid: 14 cols (0, 12 nums, 2:1), 5 rows */}
        <div className="grid grid-cols-[3rem_repeat(12,1fr)_3rem] gap-1 bg-toshi_body rounded-lg p-1 text-sm">
          {/* Zero */}
          <div
            aria-label="Place bet on 0"
            aria-hidden="true"
            className={cn(
              'row-span-1 flex items-center justify-center bg-green-600 border border-white/10 hover:brightness-125 cursor-pointer rounded-l-md relative transition-all',
              isNumberHighlighted(0, hoveredBet || { type: '', index: 0 }) &&
                'ring-2 ring-yellow-400 ring-opacity-75 brightness-150',
              randomNumber === 0 && ' border-2 border-green-500'
            )}
          >
            <span className="text-white font-bold -rotate-90 @mobg:rotate-0">0</span>
            {renderChips(getBetAmount(BET_TYPES.STRAIGHT, 0))}
          </div>

          {/* Numbers Grid */}
          {/* <div className="col-span-12 grid grid-flow-col gap-1"> */}
          {Array.from({ length: 12 }).map((_, colIndex) => {
            const n3 = (colIndex + 1) * 3;
            const n2 = n3 - 1;
            const n1 = n3 - 2;

            const renderNumberCell = (number: number) => {
              const amount = getBetAmount(BET_TYPES.STRAIGHT, number);
              const isHighlighted = isNumberHighlighted(number, hoveredBet || { type: '', index: 0 });
              const colorClass =
                ROULETTE_COLORS[number as keyof typeof ROULETTE_COLORS] === 'red' ? 'bg-red-600' : 'bg-gray-800';

              return (
                <div
                  key={number}
                  aria-label={`Place bet on ${number}`}
                  aria-hidden="true"
                  className={cn(
                    'relative flex items-center justify-center border border-white/10 hover:brightness-125 cursor-pointer select-none transition-all rounded-md aspect-square -rotate-90',
                    colorClass,
                    isHighlighted && 'brightness-125',
                    randomNumber === number && ' border-2 border-green-500'
                  )}
                >
                  <span className="text-white font-bold text-sm">{number}</span>
                  {renderChips(amount)}
                </div>
              );
            };

            return (
              <div key={colIndex} className="grid grid-rows-3 gap-0.5">
                {renderNumberCell(n3)}
                {renderNumberCell(n2)}
                {renderNumberCell(n1)}
              </div>
            );
          })}
          {/* </div> */}

          {/* 2 to 1 Columns */}
          <div className="grid grid-rows-3 gap-1">
            {renderCell('2:1', BET_TYPES.COLUMN, 2, 'border-2 w-[30px]', 1, 1, true)}
            {renderCell('2:1', BET_TYPES.COLUMN, 1, 'border-2 w-[30px]', 1, 1, true)}
            {renderCell('2:1', BET_TYPES.COLUMN, 0, 'border-2 w-[30px]', 1, 1, true)}
          </div>

          {/* Dozens - Spans 4 columns each */}
          <div className="col-start-2 col-span-12 grid grid-cols-3 gap-1">
            {renderCell('1 to 12', BET_TYPES.DOZEN, 0, 'h-[40px] border-4')}
            {renderCell('13 to 24', BET_TYPES.DOZEN, 1, 'h-[40px] border-4')}
            {renderCell('25 to 36', BET_TYPES.DOZEN, 2, 'h-[40px] border-4')}
          </div>

          {/* Empty space for 2:1 column alignment */}
          <div className="col-start-14"></div>

          {/* Even/Odd, Red/Black, 1-18/19-36 */}
          <div className="col-start-2 col-span-12 grid grid-cols-6 gap-1">
            {renderCell('1 to 18', BET_TYPES.HALF, 0, 'h-[40px] border-4')}
            {renderCell('Even', BET_TYPES.PARITY, 1, 'h-[40px] border-4')}
            {renderCell('', BET_TYPES.COLOR, 0, 'bg-red-600 ')}
            {renderCell('', BET_TYPES.COLOR, 1, 'bg-black ')}
            {renderCell('Odd', BET_TYPES.PARITY, 0, 'h-[40px] border-4')}
            {renderCell('19 to 36', BET_TYPES.HALF, 1, 'h-[40px] border-4')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouletteTable;
