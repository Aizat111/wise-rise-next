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

interface VideoPokerProps {
  floatResult: any;
  modal?: boolean;
}

const VideoPoker = ({ floatResult, modal = false }: VideoPokerProps) => {
  const t = useTranslations();

  // Float'tan kart sonuçları
  const cardResults =
    floatResult?.randomizations?.map((rand: any) => {
      const card = rand.gameEvent;
      return {
        card,
        sqlValue: findSQLValue(card)
      };
    }) || [];

  if (modal) {
    // const playerCards = cardResults.slice(0, 2);
    // const dealerCards = cardResults.slice(2, 4);
    // const extraCards = cardResults.slice(4, 9);
    const initialHand: any[] = [];
    const commingCards: any[] = [];

    cardResults.forEach((result: any, index: number) => {
      if (index < 5) initialHand.push(result);
      else commingCards.push(result);
    });

    return (
      <div className="flex flex-col gap-4 mt-2 items-center">
        {/* Dealer */}
        <div>
          <div className="text-base font-bold text-white mb-2">{t('initial_hand')}</div>
          <div className="flex gap-2 flex-wrap justify-center">
            {initialHand.length > 0 ? (
              initialHand.map((result: { card: { suit: Suit; rank: Rank } }, index: number) => (
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
        </div>

        {/* Player */}
        <div>
          <div className="text-base font-bold text-white mb-2">{t('comming_cards')}</div>
          <div className="flex gap-2 flex-wrap justify-center">
            {commingCards.length > 0 ? (
              commingCards.map((result: { card: { suit: Suit; rank: Rank } }, index: number) => (
                <CardComponent
                  key={`comming-card-${index}`}
                  rank={result.card.rank}
                  suit={result.card.suit}
                  isReversed={true}
                />
              ))
            ) : (
              <div className="text-white">{t('noCards', { defaultValue: 'Kart Yok' })}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default VideoPoker;
