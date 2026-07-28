import type { CurrencyDep } from '@/core/types/deposit.types';

function normalize(value?: string): string {
  return (value || '').trim();
}

export function getDepositAssetName(currency: CurrencyDep | string | undefined, network?: string): string | undefined {
  const name = typeof currency === 'string' ? normalize(currency) : normalize(currency?.name);
  const net = normalize(network);
  if (!name) return undefined;

  const netUpper = net.toUpperCase();

  // ETH uses same address on mainnet, Arbitrum and Base
  if (name === 'ETH') {
    return 'ETH';
  }

  // USDT network-specific symbols
  if (name === 'USDT') {
    if (netUpper === 'TRON') return 'USDT.TRC20';
    if (netUpper === 'ETH') return 'USDT.ERC20';
    if (netUpper === 'SOL') return 'USDT.SPL';
    return 'USDT';
  }

  // USDC network-specific symbols (lowercase per backend examples)
  if (name === 'USDC') {
    if (netUpper === 'ETH') return 'USDC.ERC20';
    if (netUpper === 'BASE') return 'USDC.ERC20';
    if (netUpper === 'BSC') return 'USDC.ERC20';
    if (netUpper === 'POLYGON') return 'USDC.ERC20';
    if (netUpper === 'SOL') return 'USDC.SPL';
    return 'USDC';
  }
  if (name === 'BNB') {
    if (netUpper === 'BSC') return 'BNB.BSC';
    return 'BNB';
  }
  // Single-network or default fallbacks
  return name;
}
