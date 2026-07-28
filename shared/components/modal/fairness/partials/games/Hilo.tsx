import { useTranslations } from 'next-intl';

import { CardComponent } from './Card';

/* eslint-disable no-unused-vars */
export enum Suit {
  CLUBS = 'C',
  DIAMONDS = 'D',
  HEARTS = 'H',
  SPADES = 'S'
}

export enum Rank {
  ACE = 'A',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K'
}

// Kart kombinasyonları
export const CARDS = Object.values(Suit).flatMap(suit => Object.values(Rank).map(rank => ({ suit, rank })));

// SQL değerleri
export const SQL_VALUE = {
  [Suit.SPADES]: 1,
  [Suit.HEARTS]: 2,
  [Suit.DIAMONDS]: 3,
  [Suit.CLUBS]: 4,
  [Rank.JACK]: 11,
  [Rank.QUEEN]: 12,
  [Rank.KING]: 13,
  [Rank.ACE]: 1
};

// Kartı SQL değerine çevir
const findSQLValue = (card: { suit: Suit; rank: Rank }) => {
  return [SQL_VALUE[card.suit], SQL_VALUE[card.rank as keyof typeof SQL_VALUE] || parseInt(card.rank)];
};

interface HiloProps {
  floatResult: any;
  modal?: boolean;
}

const Hilo = ({ floatResult, modal = false }: HiloProps) => {
  const t = useTranslations();

  // Float'tan kart sonuçları
  const cardResults =
    floatResult?.randomizations?.map((rand: any) => {
      const card = rand.gameEvent.card;
      return {
        card,
        sqlValue: findSQLValue(card)
      };
    }) || [];

  if (modal) {
    return (
      <div className="flex gap-4 mt-2 py-3 items-center overflow-x-auto w-full max-w-[400px] no-scrollbar">
        {cardResults.length > 0 ? (
          cardResults.map((result: { card: { suit: Suit; rank: Rank } }, index: number) => (
            <CardComponent
              key={`dealer-card-${index}`}
              rank={result.card.rank}
              suit={result.card.suit}
              isReversed={true}
            />
          ))
        ) : (
          <div className="text-white">{t('noCards')}</div>
        )}
      </div>
    );
  }
};

export default Hilo;
