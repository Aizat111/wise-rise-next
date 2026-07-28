import { Card, PokerCombination, Rank } from '@/core/types/video-poker.type';

// Ranks that count for pair (Jacks or Better)
const PAIR_RANKS = new Set([Rank.JACK, Rank.QUEEN, Rank.KING, Rank.ACE]);

/**
 * Get the indices of winning cards based on the combination
 */
export function getWinningCardIndices(hand: Card[], combination: PokerCombination | null | undefined): number[] {
  if (!combination || hand.length !== 5) {
    return [];
  }

  switch (combination) {
    case PokerCombination.ROYAL_FLUSH:
    case PokerCombination.STRAIGHT_FLUSH:
    case PokerCombination.FLUSH:
    case PokerCombination.STRAIGHT:
    case PokerCombination.FULL_HOUSE:
      // All 5 cards are part of the winning combination
      return [0, 1, 2, 3, 4];

    case PokerCombination.FOUR_OAK: {
      // Find the rank that appears 4 times
      const rankCounts = new Map<Rank, number[]>();
      hand.forEach((card, index) => {
        if (!rankCounts.has(card.rank)) {
          rankCounts.set(card.rank, []);
        }
        rankCounts.get(card.rank)!.push(index);
      });
      for (const [_rank, indices] of rankCounts.entries()) {
        if (indices.length === 4) {
          return indices;
        }
      }
      return [];
    }

    case PokerCombination.SET: {
      // Find the rank that appears 3 times
      const rankCounts = new Map<Rank, number[]>();
      hand.forEach((card, index) => {
        if (!rankCounts.has(card.rank)) {
          rankCounts.set(card.rank, []);
        }
        rankCounts.get(card.rank)!.push(index);
      });
      for (const [_rank, indices] of rankCounts.entries()) {
        if (indices.length === 3) {
          return indices;
        }
      }
      return [];
    }

    case PokerCombination.TWO_PAIR: {
      // Find two ranks that appear 2 times each
      const rankCounts = new Map<Rank, number[]>();
      hand.forEach((card, index) => {
        if (!rankCounts.has(card.rank)) {
          rankCounts.set(card.rank, []);
        }
        rankCounts.get(card.rank)!.push(index);
      });
      const pairIndices: number[] = [];
      for (const [_rank, indices] of rankCounts.entries()) {
        if (indices.length === 2) {
          pairIndices.push(...indices);
        }
      }
      return pairIndices;
    }

    case PokerCombination.PAIR: {
      // Find a pair of Jacks or Better (J, Q, K, A)
      const rankCounts = new Map<Rank, number[]>();
      hand.forEach((card, index) => {
        if (!rankCounts.has(card.rank)) {
          rankCounts.set(card.rank, []);
        }
        rankCounts.get(card.rank)!.push(index);
      });
      for (const [rank, indices] of rankCounts.entries()) {
        if (indices.length === 2 && PAIR_RANKS.has(rank)) {
          return indices;
        }
      }
      return [];
    }

    default:
      return [];
  }
}

/**
 * Evaluate a 5-card video poker hand and return the PokerCombination.
 * Rules assume Jacks or Better paytable.
 */
export function evaluatePokerHand(hand: Card[] | undefined | null): PokerCombination | null {
  if (!hand || hand.length !== 5) return null;

  // Helper mappings
  const rankToValue: Record<Rank, number> = {
    [Rank.TWO]: 2,
    [Rank.THREE]: 3,
    [Rank.FOUR]: 4,
    [Rank.FIVE]: 5,
    [Rank.SIX]: 6,
    [Rank.SEVEN]: 7,
    [Rank.EIGHT]: 8,
    [Rank.NINE]: 9,
    [Rank.TEN]: 10,
    [Rank.JACK]: 11,
    [Rank.QUEEN]: 12,
    [Rank.KING]: 13,
    [Rank.ACE]: 14
  };

  const suits = hand.map(c => c.suit);
  const ranks = hand.map(c => c.rank);
  const values = ranks.map(r => rankToValue[r]).sort((a, b) => a - b);

  // Count helpers
  const rankCounts = new Map<Rank, number>();
  for (const r of ranks) {
    rankCounts.set(r, (rankCounts.get(r) || 0) + 1);
  }

  const counts = Array.from(rankCounts.values()).sort((a, b) => b - a); // e.g., [3,2], [4,1], [2,2,1], ...
  const pairRanks = Array.from(rankCounts.entries())
    .filter(([_, count]) => count === 2)
    .map(([r]) => r);

  // Flush
  const isFlush = suits.every(s => s === suits[0]);

  // Straight (with A-2-3-4-5 handling)
  const isStandardConsecutive = new Set(values).size === 5 && values[4] - values[0] === 4;
  const isWheel =
    // A-2-3-4-5 -> treat Ace as 1
    new Set(values).size === 5 &&
    values[4] === 14 &&
    values[0] === 2 &&
    values[1] === 3 &&
    values[2] === 4 &&
    values[3] === 5;
  const isStraight = isStandardConsecutive || isWheel;

  // Straight Flush / Royal Flush
  if (isFlush && isStraight) {
    const isRoyal =
      values.includes(10) && values.includes(11) && values.includes(12) && values.includes(13) && values.includes(14);
    return isRoyal ? PokerCombination.ROYAL_FLUSH : PokerCombination.STRAIGHT_FLUSH;
  }

  // Four of a Kind
  if (counts[0] === 4) return PokerCombination.FOUR_OAK;

  // Full House
  if (counts[0] === 3 && counts[1] === 2) return PokerCombination.FULL_HOUSE;

  // Flush
  if (isFlush) return PokerCombination.FLUSH;

  // Straight
  if (isStraight) return PokerCombination.STRAIGHT;

  // Three of a Kind
  if (counts[0] === 3) return PokerCombination.SET;

  // Two Pair
  if (counts[0] === 2 && counts[1] === 2) return PokerCombination.TWO_PAIR;

  // Pair (Jacks or Better)
  if (counts[0] === 2) {
    const hasHighPair = pairRanks.some(r => PAIR_RANKS.has(r));
    if (hasHighPair) return PokerCombination.PAIR;
  }

  return null;
}

/**
 * Evaluate only the held subset to determine if it ALREADY forms a winning combination.
 * This avoids hinting at potential draws; only fully formed combos are returned.
 */
export function evaluateHeldCombination(heldCards: Card[] | undefined | null): PokerCombination | null {
  if (!heldCards || heldCards.length < 2) return null;

  const ranks = heldCards.map(c => c.rank);

  const rankCounts = new Map<Rank, number>();
  for (const r of ranks) {
    rankCounts.set(r, (rankCounts.get(r) || 0) + 1);
  }
  const countsDesc = Array.from(rankCounts.values()).sort((a, b) => b - a);

  // Four of a kind (must have 4 cards of the same rank)
  if (countsDesc[0] === 4) return PokerCombination.FOUR_OAK;

  // Full-house, Straight, Flush, Straight Flush, Royal Flush need 5 cards conclusively
  if (heldCards.length === 5) {
    return evaluatePokerHand(heldCards);
  }

  // Three of a kind
  if (countsDesc[0] === 3) return PokerCombination.SET;

  // Two pair (requires at least 4 held cards forming two pairs)
  const pairRanks = Array.from(rankCounts.values()).filter(c => c === 2).length;
  if (pairRanks >= 2) return PokerCombination.TWO_PAIR;

  // Pair of Jacks or Better
  if (countsDesc[0] === 2) {
    for (const [rank, count] of rankCounts.entries()) {
      if (count === 2 && PAIR_RANKS.has(rank)) {
        return PokerCombination.PAIR;
      }
    }
  }

  return null;
}
