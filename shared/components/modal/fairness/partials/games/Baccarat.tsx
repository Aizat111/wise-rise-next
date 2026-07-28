import { useTranslations } from 'next-intl';

import { cn } from '@/core/lib/utils';
import { BetType, Card, Rank, Suit } from '@/core/types/baccarat.type';
import CardCount from '@/screens/games/baccarat/partials/CardCount';
import { CardComponent } from '@/shared/components/modal/fairness/partials/games/Card';

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

// Kart değerini hesapla (Baccarat kurallarına göre)
const getCardValue = (rank: Rank): number => {
  if (['J', 'Q', 'K', '10'].includes(rank)) {
    return 0;
  } else if (rank === 'A') {
    return 1;
  } else {
    return parseInt(rank);
  }
};

// El puanını hesapla (toplam % 10)
const calculatePoints = (cards: Card[]): number => {
  return cards.reduce((acc, card) => {
    if (!card.rank) return acc;
    return (acc + getCardValue(card.rank)) % 10;
  }, 0);
};

// Banker 3. kart karar tablosu (README'den)
const bankerDrawDecision: Record<number, (_p?: number) => boolean> = {
  0: () => true,
  1: () => true,
  2: () => true,
  3: p => p !== 8,
  4: p => p !== undefined && p >= 2 && p <= 7,
  5: p => p !== undefined && p >= 4 && p <= 7,
  6: p => p === 6 || p === 7,
  7: () => false
};

interface BaccaratProps {
  floatResult: any;
  modal?: boolean;
}

const Baccarat = ({ floatResult, modal = false }: BaccaratProps) => {
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
    const playerCards: Card[] = [];
    const bankerCards: Card[] = [];

    // Kartı Card interface'ine dönüştür
    const createCard = (card: { suit: Suit; rank: Rank }): Card => ({
      suit: card.suit,
      rank: card.rank,
      isReversed: false
    });

    // İlk 4 kart: Player 1, Banker 1, Player 2, Banker 2
    if (cardResults.length >= 4) {
      playerCards.push(createCard(cardResults[0].card));
      playerCards.push(createCard(cardResults[1].card));
      bankerCards.push(createCard(cardResults[2].card));
      bankerCards.push(createCard(cardResults[3].card));
    }

    // İlk iki karttan sonra puanları hesapla
    const playerInitialPoints = calculatePoints(playerCards);
    const bankerInitialPoints = calculatePoints(bankerCards);

    let cardIndex = 4; // Sonraki kart indeksi

    // Player 3. kart kuralları
    // Natural 8 veya 9 ise 3. kart çekilmez
    // 6 veya 7 ise 3. kart çekilmez
    // 0-5 ise 3. kart çekilir (banker'ın 8 veya 9'u yoksa)
    let playerThirdCard: Card | null = null;
    if (
      playerInitialPoints < 6 &&
      bankerInitialPoints !== 8 &&
      bankerInitialPoints !== 9 &&
      cardIndex < cardResults.length
    ) {
      const thirdCard = createCard(cardResults[cardIndex].card);
      playerThirdCard = thirdCard;
      playerCards.push(thirdCard);
      cardIndex++;
    }

    // Banker 3. kart kuralları
    const bankerCurrentPoints = calculatePoints(bankerCards);

    let shouldBankerDraw = false;

    if (bankerCurrentPoints === 8 || bankerCurrentPoints === 9) {
      // Natural, 3. kart çekilmez
      shouldBankerDraw = false;
    } else if (playerInitialPoints === 8 || playerInitialPoints === 9) {
      // Player natural 8/9 varsa, banker sadece 0-2 ise çeker
      if (bankerCurrentPoints <= 2) {
        shouldBankerDraw = true;
      } else {
        shouldBankerDraw = false;
      }
    } else if (playerThirdCard && playerThirdCard.rank) {
      // Player 3. kart çektiyse, tabloya göre karar ver
      const playerThirdValue = getCardValue(playerThirdCard.rank);
      const decisionTable = bankerDrawDecision[bankerCurrentPoints];
      if (decisionTable) {
        shouldBankerDraw = decisionTable(playerThirdValue) ?? false;
      } else {
        shouldBankerDraw = false;
      }
    } else {
      // Player 3. kart çekmediyse (6 veya 7), banker 0-2 ise çeker
      if (bankerCurrentPoints <= 2) {
        shouldBankerDraw = true;
      } else {
        shouldBankerDraw = false;
      }
    }

    // Banker 3. kartı çek
    if (shouldBankerDraw && cardIndex < cardResults.length) {
      bankerCards.push(createCard(cardResults[cardIndex].card));
    }

    // Sonucu hesapla
    const finalPlayerPoints = calculatePoints(playerCards);
    const finalBankerPoints = calculatePoints(bankerCards);

    let result: BetType;
    if (finalPlayerPoints > finalBankerPoints) {
      result = BetType.PLAYER;
    } else if (finalBankerPoints > finalPlayerPoints) {
      result = BetType.BANKER;
    } else {
      result = BetType.TIE;
    }

    return (
      <div className="flex flex-col gap-4 mt-2 items-center">
        <div className={cn('relative h-2/3 pt-3 @mobg:pt-10 flex w-full justify-around')}>
          {/* Player */}

          <div className="flex flex-col items-center gap-3">
            <div className="text-base font-bold text-white mb-2">{t('player')}</div>
            {playerCards?.length > 0 && (
              <>
                <CardCount
                  cards={playerCards}
                  isWin={result === BetType.PLAYER}
                  isLost={result === BetType.BANKER}
                  isDraw={result === BetType.TIE}
                />

                <div className="flex">
                  {playerCards.map((card: Card, index: number) => (
                    <CardComponent
                      key={`player-card-${index}`}
                      index={index}
                      rank={card.rank}
                      suit={card.suit}
                      isReversed={true}
                      isWin={result === BetType.PLAYER}
                      isLost={result === BetType.BANKER}
                      isDraw={result === BetType.TIE}
                      disappear={card.disappear ? true : false}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col items-center gap-3">
            {/* Banker */}
            <div className="text-base font-bold text-white mb-2">{t('baccarat.banker')}</div>
            {bankerCards?.length > 0 && (
              <>
                <CardCount
                  cards={bankerCards}
                  isWin={result === BetType.BANKER}
                  isLost={result === BetType.PLAYER}
                  isDraw={result === BetType.TIE}
                />

                <div className="flex">
                  {bankerCards.map((card: Card, index: number) => (
                    <CardComponent
                      key={`split-card-${index}`}
                      index={index}
                      rank={card.rank}
                      suit={card.suit}
                      isReversed={true}
                      isWin={result === BetType.BANKER}
                      isLost={result === BetType.PLAYER}
                      isDraw={result === BetType.TIE}
                      disappear={card.disappear ? true : false}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default Baccarat;
