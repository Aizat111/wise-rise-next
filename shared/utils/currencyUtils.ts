import { currencies, currencyPaths } from '@/core/constants/currencies.constants';

export function getCurrencyIcon(currencySymbol: string): string {
  if (!currencySymbol) {
    return '/assets/currencies/dollar.svg';
  }

  const normalized = currencySymbol.toUpperCase().trim();

  return currencyPaths[normalized] || '/assets/currencies/dollar.svg';
}

export function getCurrencyBySymbol(currencySymbol: string) {
  if (!currencySymbol) return undefined;

  const normalized = currencySymbol.toUpperCase().trim();

  return (
    currencies.find(c => c.symbol.toUpperCase() === normalized) ||
    currencies.find(c => c.nick.toUpperCase() === normalized) ||
    currencies.find(c => c.name.toUpperCase() === normalized)
  );
}

export function getCurrencyFormatOptions(currencySymbol: string): Intl.NumberFormatOptions {
  const normalized = currencySymbol.toUpperCase().trim();

  // USD and stablecoins typically use 2 decimals
  if (
    normalized === 'USD' ||
    normalized.includes('USDT') ||
    normalized.includes('USDC') ||
    normalized.includes('DAI')
  ) {
    return {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };
  }

  // Bitcoin and most cryptocurrencies use more decimals
  if (normalized === 'BTC' || normalized === 'ETH' || normalized === 'SOL') {
    return {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    };
  }

  // Default
  return {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  };
}

export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    BTC: '₿',
    ETH: 'Ξ'
  };

  return symbols[currency.toUpperCase()] || currency.toUpperCase();
}
