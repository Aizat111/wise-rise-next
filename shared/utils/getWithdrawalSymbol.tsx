type CryptoSymbol = {
  [key: string]: string;
};

const cryptoSymbols: CryptoSymbol = {
  bitcoin: 'BTC',
  solana: 'SOL',
  ethereum: 'ETH',
  Doge: 'DOGE',
  binancecoin: 'BNB',
  ['bitcoin-cash']: 'BCH',
  dash: 'DASH',
  dogecoin: 'DOGE',
  usdc: 'USDC',
  usdt: 'USDT',
  litecoin: 'LTC'
};

const assetToImageMap: CryptoSymbol = {
  ethereum: 'eth',
  eth: 'eth',
  'eth.aeth': 'eth',
  'eth.base': 'eth',
  bitcoin: 'btc',
  btc: 'btc',
  sol: 'solana',
  solana: 'solana',
  binancecoin: 'bnb',
  bnb: 'bnb',
  'bnb.bsc': 'bnb',
  dogecoin: 'doge-coin',
  doge: 'doge-coin',
  usdt: 'tether',
  'usdt.erc20': 'tether',
  'usdt.trc20': 'tron',
  'usdt.spl': 'tether',
  usdc: 'usdc',
  'usdc.erc20': 'usdc',
  'usdc.spl': 'usdc',
  'usdc.base': 'usdc',
  'usdc.bsc': 'usdc',
  'usdc.polygon': 'usdc',
  bch: 'bitcoin-cash',
  litecoin: 'ltc',
  ltc: 'ltc',
  dash: 'dash',
  xrp: 'xrp',
  ton: 'ton',
  avax: 'avax',
  ada: 'ada',
  ape: 'ape',
  shib: 'shib'
};

export function getWithdrawalSymbol(cryptoName: string): string {
  return cryptoSymbols[cryptoName.toLowerCase()] || cryptoName;
}

export function getAssetImage(cryptoName: string): string {
  return assetToImageMap[cryptoName.toLowerCase()] || cryptoName;
}
