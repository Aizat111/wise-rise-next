/**
 * RAFFLE TICKET TIERED PRICING CALCULATIONS
 * ==========================================
 *
 * Tickets are priced in tiers that double every 1,500 tickets:
 * - Tier 0 (0-1,499): base price
 * - Tier 1 (1,500-2,999): 2x base price
 * - Tier 2 (3,000-4,499): 4x base price
 * - Tier 3 (4,500-5,999): 8x base price
 * - Tier 4 (6,000-7,499): 16x base price
 * - Tier 5 (7,500-8,999): 32x base price
 * - Tier 6+ (9,000+): 64x base price (capped)
 */

const TICKETS_PER_TIER = 1500;
const MAX_TIER = 6;

/**
 * Calculate total gold required to buy ticketCount tickets
 * when user already has currentRaffleTickets.
 */
export const calculateGoldForTickets = (
  currentRaffleTickets: number,
  ticketCount: number,
  goldPerTicket: number
): number => {
  if (ticketCount <= 0) return 0;

  let totalGold = 0;
  const tMin = Math.floor(currentRaffleTickets / TICKETS_PER_TIER);
  const tMax = Math.floor((currentRaffleTickets + ticketCount - 1) / TICKETS_PER_TIER);

  for (let t = tMin; t <= tMax; t++) {
    const startPos = t * TICKETS_PER_TIER;
    const endPos = (t + 1) * TICKETS_PER_TIER - 1;
    const ourStart = Math.max(startPos, currentRaffleTickets);
    const ourEnd = Math.min(endPos, currentRaffleTickets + ticketCount - 1);
    const count = ourEnd - ourStart + 1;
    const tierMultiplier = Math.pow(2, Math.min(t, MAX_TIER));
    totalGold += count * goldPerTicket * tierMultiplier;
  }

  return totalGold;
};

/**
 * Calculate how many tickets goldAmount can buy with tiered pricing.
 */
export const calculateTicketsForGold = (
  currentRaffleTickets: number,
  goldAmount: number,
  goldPerTicket: number
): { tickets: number; goldUsed: number } => {
  if (goldAmount <= 0) return { tickets: 0, goldUsed: 0 };

  let remainingGold = goldAmount;
  let ticketsBought = 0;
  let pos = currentRaffleTickets;
  let currentTier = Math.floor(pos / TICKETS_PER_TIER);

  while (remainingGold > 0) {
    const tierEnd = (currentTier + 1) * TICKETS_PER_TIER - 1;
    const spaceInTier = tierEnd - pos + 1;
    const costPerTicket = goldPerTicket * Math.pow(2, Math.min(currentTier, MAX_TIER));
    const maxAffordable = Math.floor(remainingGold / costPerTicket);
    const ticketsInThisTier = Math.min(spaceInTier, maxAffordable);

    if (ticketsInThisTier < 1) break;

    const goldUsedInTier = ticketsInThisTier * costPerTicket;
    remainingGold -= goldUsedInTier;
    ticketsBought += ticketsInThisTier;
    pos += ticketsInThisTier;
    currentTier = Math.floor(pos / TICKETS_PER_TIER);
  }

  return { tickets: ticketsBought, goldUsed: goldAmount - remainingGold };
};

/**
 * Get the current tier based on ticket count.
 */
export const getCurrentTier = (ticketCount: number): number => {
  return Math.floor(ticketCount / TICKETS_PER_TIER);
};

/**
 * Get the price multiplier for a given tier.
 */
export const getTierMultiplier = (tier: number): number => {
  return Math.pow(2, Math.min(tier, MAX_TIER));
};

/**
 * Get current price per ticket based on user's current ticket count.
 */
export const getCurrentPricePerTicket = (currentTickets: number, basePrice: number): number => {
  const tier = getCurrentTier(currentTickets);
  return basePrice * getTierMultiplier(tier);
};

/**
 * Get detailed tier breakdown for a ticket purchase.
 */
export const getTierBreakdown = (
  currentRaffleTickets: number,
  ticketCount: number,
  goldPerTicket: number
): Array<{ tier: number; tickets: number; pricePerTicket: number; totalCost: number }> => {
  if (ticketCount <= 0) return [];

  const breakdown: Array<{ tier: number; tickets: number; pricePerTicket: number; totalCost: number }> = [];
  const tMin = Math.floor(currentRaffleTickets / TICKETS_PER_TIER);
  const tMax = Math.floor((currentRaffleTickets + ticketCount - 1) / TICKETS_PER_TIER);

  for (let t = tMin; t <= tMax; t++) {
    const startPos = t * TICKETS_PER_TIER;
    const endPos = (t + 1) * TICKETS_PER_TIER - 1;
    const ourStart = Math.max(startPos, currentRaffleTickets);
    const ourEnd = Math.min(endPos, currentRaffleTickets + ticketCount - 1);
    const count = ourEnd - ourStart + 1;
    const tierMultiplier = Math.pow(2, Math.min(t, MAX_TIER));
    const pricePerTicket = goldPerTicket * tierMultiplier;
    const totalCost = count * pricePerTicket;

    breakdown.push({
      tier: t,
      tickets: count,
      pricePerTicket,
      totalCost
    });
  }

  return breakdown;
};

/**
 * Get tickets remaining in current tier.
 */
export const getTicketsRemainingInTier = (currentTickets: number): number => {
  const currentTier = getCurrentTier(currentTickets);
  const tierEnd = (currentTier + 1) * TICKETS_PER_TIER;
  return tierEnd - currentTickets;
};

/**
 * Constants for external use.
 */
export { TICKETS_PER_TIER, MAX_TIER };
