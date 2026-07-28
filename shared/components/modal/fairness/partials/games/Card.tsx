import React from 'react';

import { Card } from '@/core/types/blackjack.type';
import { Cardbackk } from '@/shared/assets/games';

interface CardComponentProps extends Card {
  index?: number;
  initialDelay?: number;
}

export const CardComponent: React.FC<CardComponentProps> = ({ rank, suit, style }) => {
  const SUITS_EQUIVALENT: { [key: string]: string } = {
    C: '♣',
    D: '♦',
    H: '♥',
    S: '♠'
  };

  const VALUES_EQUIVALENT: { [key: string]: string } = {
    J: 'J',
    Q: 'Q',
    K: 'K',
    A: 'A',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '10': '10'
  };

  const links = {
    '♠K': "url('/assets/games/blackjack/cards/spadesKing.webp')",
    '♠Q': "url('/assets/games/blackjack/cards/spadesQueen.webp')",
    '♠J': "url('/assets/games/blackjack/cards/spadesJack.webp')",
    '♥K': "url('/assets/games/blackjack/cards/heartsKing.webp')",
    '♥Q': "url('/assets/games/blackjack/cards/heartsQueen.webp')",
    '♥J': "url('/assets/games/blackjack/cards/heartsJack.webp')",
    '♦K': "url('/assets/games/blackjack/cards/diamondsKing.webp')",
    '♦Q': "url('/assets/games/blackjack/cards/diamondsQueen.webp')",
    '♦J': "url('/assets/games/blackjack/cards/diamondsJack.webp')",
    '♣K': "url('/assets/games/blackjack/cards/clubsKing.webp')",
    '♣Q': "url('/assets/games/blackjack/cards/clubsQueen.webp')",
    '♣J': "url('/assets/games/blackjack/cards/clubsJack.webp')",
    '♠': '/assets/games/blackjack/spades.svg',
    '♥': '/assets/games/blackjack/hearts.svg',
    '♦': '/assets/games/blackjack/diamonds.svg',
    '♣': '/assets/games/blackjack/clubs.svg'
  };

  const SUIT = 0;
  const VALUE = 1;

  const parseCard = (type: number, val: string | number) => {
    let toReturn: string;
    if (type === SUIT) {
      toReturn = SUITS_EQUIVALENT[val.toString()];
    } else {
      toReturn = VALUES_EQUIVALENT[val.toString()];
    }

    if (!toReturn) return val.toString();
    return toReturn;
  };

  // Boş kart kontrolü - eğer rank ve suit yoksa sadece arka tarafı göster
  const isEmptyCard = !rank || !suit;
  const suitSymbol = isEmptyCard ? '' : parseCard(SUIT, suit);
  const rankSymbol = isEmptyCard ? '' : parseCard(VALUE, rank);
  const isSpadeOrClub = suitSymbol === '♠' || suitSymbol === '♣';
  const textColor = isSpadeOrClub ? 'text-[#010103]' : 'text-[#FF3D50]';

  return (
    <div
      style={{
        ...style,
        '--character': links[`${suitSymbol}${rankSymbol}` as keyof typeof links] || 'unset'
        // '--card-transition': automode ? `${400 * ratio}ms` : '200ms',
        // '--card-reverse-duration': automode ? `${200 * ratio}ms` : '200ms',
        // '--card-reverse-delay': automode ? `${300 * ratio}ms` : '300ms',
        // '--card-disappear-duration': automode ? `${300 * ratio}ms` : '300ms'
      }}
      // className={cn('perspective-normal', disappear ? 'animate-card-disappear' : '')}
    >
      <div
        className={`
          relative select-none perspective-700 
          transition-all ease-out
          text-[10px] @mobg:text-[18px]
          w-[5.61em] h-[7.9em]
          shadow-[0_0_0.25em_rgba(7,16,23,0.3)]
          rounded-[0.25em]
          preserve-3d
        `}
        style={{
          // marginTop: `${index}em`,
          transform: 'rotateY(180deg)'
        }}
      >
        <div
          className="h-full w-fullrounded-[0.25em] bg-white rounded"
          style={{
            backgroundImage: 'var(--character)',
            backgroundPosition: 'bottom right',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '75% auto',
            transform: 'scaleX(-1)'
          }}
        >
          <div className="flex flex-col items-center text-[1.7em] font-black text-black w-max ml-[10%]">
            {!isEmptyCard && (
              <>
                <span className={textColor}>{rankSymbol}</span>
                <img
                  className="w-[1em] h-[1em] mx-[0.1em]"
                  src={links[suitSymbol as keyof typeof links]}
                  alt="Card suit"
                />
              </>
            )}
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-[0.25em] bg-white"
          style={{
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <Cardbackk className="w-[100%] h-[100%]" />
          </div>
        </div>
      </div>
    </div>
  );
};

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}
