import type { Currency, CurrencyDep } from '@/core/types/deposit.types';

export const currencies: Currency[] = [
  { id: 0, name: 'Bitcoin', nick: 'BTC', symbol: 'BTC', icon: '/assets/currencies/btc.svg' },
  { id: 1, name: 'Ethereum', nick: 'ETH', symbol: 'ETH', icon: '/assets/currencies/eth.svg' },
  { id: 2, name: 'Solana', nick: 'SOL', symbol: 'SOL', icon: '/assets/currencies/solana.svg' },
  { id: 3, name: 'Litecoin', nick: 'LTC', symbol: 'LTC', icon: '/assets/currencies/ltc.svg' },
  { id: 4, name: 'BNB Coin', nick: 'BNB.BSC', symbol: 'BNB', icon: '/assets/currencies/bnb.svg' },
  { id: 5, name: 'Ordinals', nick: 'BRC-20s', symbol: '', icon: '/assets/currencies/brc20.svg' },
  { id: 6, name: 'USDC', nick: 'ERC-20', symbol: 'USDC.ERC20', icon: '/assets/currencies/usdc.svg' },
  { id: 7, name: 'Retardio', nick: 'SOL', symbol: 'RETARDIO', icon: '/assets/currencies/retardio.svg' },
  { id: 8, name: 'Giga', nick: 'GIGA', symbol: 'GIGA', icon: '/assets/currencies/giga.svg' },
  {
    id: 9,
    name: 'USDT',
    nick: 'ERC-20',
    symbol: 'USDT.ERC20',
    icon: '/assets/currencies/tether.svg'
  },
  { id: 10, name: 'USDT', nick: 'TRC-20', symbol: 'USDT.TRC20', icon: '/assets/currencies/tron.svg' },
  {
    id: 11,
    name: 'Doge Coin',
    nick: 'DOGE',
    symbol: 'DOGE',
    icon: '/assets/currencies/doge-coin.svg'
  },
  {
    id: 12,
    name: 'Bitcoin Cash',
    nick: 'BCH',
    symbol: 'BCH',
    icon: '/assets/currencies/bitcoin-cash.svg'
  },
  { id: 13, name: 'Dash Coin', nick: 'DASH', symbol: 'DASH', icon: '/assets/currencies/dash.svg' },
  { id: 14, name: 'XRP', nick: 'XRP', symbol: 'XRP', icon: '/assets/currencies/xrp.svg' },
  { id: 15, name: 'USDC', nick: 'USDC.SPL', symbol: 'USDC.SPL', icon: '/assets/currencies/usdc.svg' },
  { id: 16, name: 'Ethereum', nick: 'AETH', symbol: 'ETH.AETH', icon: '/assets/currencies/eth.svg' },
  { id: 17, name: 'Ethereum', nick: 'BASE', symbol: 'ETH.BASE', icon: '/assets/currencies/eth.svg' },
  { id: 18, name: 'USDC', nick: 'USDC.BASE', symbol: 'USDC.BASE', icon: '/assets/currencies/usdc.svg' },
  { id: 19, name: 'TON', nick: 'TON', symbol: 'TON', icon: '/assets/currencies/ton.svg' },
  { id: 20, name: 'Avalanche', nick: 'AVAX', symbol: 'AVAX', icon: '/assets/currencies/avax.svg' },
  { id: 21, name: 'Cardano', nick: 'ADA', symbol: 'ADA', icon: '/assets/currencies/ada.svg' },
  { id: 22, name: 'Algorand', nick: 'ALGO', symbol: 'ALGO', icon: '/assets/currencies/algo.svg' },
  { id: 23, name: 'ApeCoin', nick: 'APE', symbol: 'APE', icon: '/assets/currencies/ape.svg' },
  { id: 24, name: 'Blast', nick: 'BLAST', symbol: 'BLAST', icon: '/assets/currencies/blast.png' },
  { id: 25, name: 'Polkadot', nick: 'DOT', symbol: 'DOT', icon: '/assets/currencies/dot.svg' },
  { id: 26, name: 'Fantom', nick: 'FTM', symbol: 'FTM', icon: '/assets/currencies/ftm.svg' },
  { id: 27, name: 'Near Protocol', nick: 'NEAR', symbol: 'NEAR', icon: '/assets/currencies/near.svg' },
  { id: 28, name: 'Tezos', nick: 'XTZ', symbol: 'XTZ', icon: '/assets/currencies/xtz.svg' },
  { id: 29, name: 'Arbitrum', nick: 'ARB', symbol: 'ARB', icon: '/assets/currencies/arb.svg' },
  { id: 30, name: 'SHIB', nick: 'SHIB', symbol: 'SHIB', icon: '/assets/currencies/shib.svg' },
  { id: 30, name: 'Pump', nick: 'PUMP', symbol: 'PUMP', icon: '/assets/currencies/pump.png' },
  { id: 31, name: 'Dai Stablecoin', nick: 'DAI', symbol: 'DAI', icon: '/assets/currencies/dai.svg' },
  { id: 32, name: 'USDC', nick: 'USDC.BSC', symbol: 'USDC.BSC', icon: '/assets/currencies/usdc.svg' },
  { id: 33, name: 'USDC', nick: 'USDC.POLYGON', symbol: 'USDC.POLYGON', icon: '/assets/currencies/usdc.svg' },
  // { id: 34, name: "USDT", nick: "ALGO", symbol: "USDT.ALGO", icon: "tether" },
  { id: 34, name: 'USDT', nick: 'USDT.SPL', symbol: 'USDT.SPL', icon: '/assets/currencies/tether.svg' }
];

export const currenciesDep: CurrencyDep[] = [
  {
    name: 'SOL',
    longName: 'Solana',
    depositName: 'Solana',
    networks: ['SOL'],
    defaultNetwork: 'SOL',
    icon: '/assets/currencies/solana.svg',
    details: [
      {
        fee: [
          {
            network: 'SOL',
            fee: 0.000005
          }
        ]
      }
    ]
  },
  {
    name: 'BTC',
    longName: 'Bitcoin',
    depositName: 'Bitcoin',
    networks: ['BTC'],
    defaultNetwork: 'BTC',
    icon: '/assets/currencies/btc.svg',
    details: [
      {
        fee: [
          {
            network: 'BTC',
            fee: 0.00008
          }
        ]
      }
    ]
  },
  {
    name: 'ETH',
    longName: 'Ethereum',
    depositName: 'Ethereum',
    networks: ['ETH', 'Arbitrum', 'BASE'],
    defaultNetwork: 'ETH',
    icon: '/assets/currencies/eth.svg',
    details: [
      {
        fee: [
          {
            network: 'ETH',
            fee: 0.0006
          }
        ]
      }
    ]
  },
  {
    name: 'LTC',
    longName: 'Litecoin',
    depositName: 'Litecoin',
    networks: ['LTC'],
    defaultNetwork: 'LTC',
    icon: '/assets/currencies/ltc.svg',
    details: [
      {
        fee: [
          {
            network: 'LTC',
            fee: 0.001
          }
        ]
      }
    ]
  },
  {
    name: 'USDT',
    longName: 'Tether',
    depositName: 'USDT',
    networks: ['TRON', 'ETH', 'SOL'],
    defaultNetwork: 'TRON',
    icon: '/assets/currencies/tether.svg',
    details: [
      {
        fee: [
          {
            network: 'TRON',
            fee: 4
          },
          {
            network: 'ETH',
            fee: 4
          },
          {
            network: 'default',
            fee: 4
          }
        ]
      }
    ]
  },
  {
    name: 'USDC',
    longName: 'USDC',
    networks: ['ETH', 'SOL', 'BASE', 'BSC', 'POLYGON'],
    defaultNetwork: 'ETH',
    depositName: 'USDC',
    icon: '/assets/currencies/usdc.svg',
    details: [
      {
        fee: [
          {
            network: 'ETH',
            fee: 4
          },
          {
            network: 'SOL',
            fee: 0.1
          },
          {
            network: 'default',
            fee: 4
          }
        ]
      }
    ]
  },
  {
    name: 'SUI',
    longName: 'SUI',
    depositName: 'SUI',
    networks: ['SUI'],
    defaultNetwork: 'SUI',
    icon: '/assets/currencies/sui.svg',
    details: [
      {
        fee: [
          {
            network: 'SUI',
            fee: 0.001
          }
        ]
      }
    ]
  },
  {
    name: 'MONAD',
    longName: 'MONAD',
    depositName: 'MONAD',
    networks: ['MONAD'],
    defaultNetwork: 'MONAD',
    icon: '/assets/currencies/monad.svg',
    details: [
      {
        fee: [
          {
            network: 'MONAD',
            fee: 1
          }
        ]
      }
    ]
  },
  {
    name: 'XRP',
    longName: 'Ripple',
    depositName: 'XRP',
    networks: ['XRP'],
    defaultNetwork: 'XRP',
    icon: '/assets/currencies/xrp.svg',
    details: [
      {
        fee: [
          {
            network: 'XRP',
            fee: 0.2
          }
        ]
      }
    ]
  },
  {
    name: 'DOGE',
    longName: 'Dogecoin',
    depositName: 'Dogecoin',
    networks: ['DOGE'],
    defaultNetwork: 'DOGE',
    icon: '/assets/currencies/doge-coin.svg',
    details: [
      {
        fee: [
          {
            network: 'DOGE',
            fee: 4
          }
        ]
      }
    ]
  },

  {
    name: 'BNB',
    longName: 'Binance Coin',
    depositName: 'binancecoin',
    networks: ['BSC'],
    defaultNetwork: 'BSC',
    icon: '/assets/currencies/bnb.svg',
    details: [
      {
        fee: [
          {
            network: 'BSC',
            fee: 0.0002
          }
        ]
      }
    ]
  },
  {
    name: 'AVAX',
    longName: 'Avalanche',
    depositName: 'Avalanche',
    networks: ['AVAX'],
    defaultNetwork: 'AVAX',
    icon: '/assets/currencies/avax.svg',
    details: [
      {
        fee: [
          {
            network: 'AVAX',
            fee: 0.001
          }
        ]
      }
    ]
  },
  {
    name: 'ADA',
    longName: 'Cardano',
    depositName: 'ADA',
    networks: ['ADA'],
    defaultNetwork: 'ADA',
    icon: '/assets/currencies/ada.svg'
  },
  // { name: 'ALGO', longName: 'Algorand', networks: ['ALGO'], defaultNetwork: 'ALGO', icon: "algo" },
  {
    name: 'APE',
    longName: 'ApeCoin',
    depositName: 'APE',
    networks: ['ETH'],
    defaultNetwork: 'ETH',
    icon: '/assets/currencies/ape.svg'
  },
  // { name: 'BLAST', longName: 'Blast', networks: ['BLAST'], defaultNetwork: 'BLAST', icon: "blast" },
  // { name: 'DOT', longName: 'Polkadot', networks: ['DOT'], defaultNetwork: 'DOT', icon: "dot" },
  // { name: 'FTM', longName: 'Fantom', networks: ['FTM'], defaultNetwork: 'FTM', icon: "ftm" },
  // { name: 'NEAR', longName: 'Near Protocol', networks: ['BSC'], defaultNetwork: 'BSC', icon: "near" },
  // { name: 'XTZ', longName: 'Tezos', networks: ['XTZ'], defaultNetwork: 'XTZ', icon: "xtz" },
  // { name: 'ARB', longName: 'Arbitrum', networks: ['ARB'], defaultNetwork: 'ARB', icon: "arb" },
  {
    name: 'SHIB',
    longName: 'Shiba Inu',
    networks: ['ETH'],
    depositName: 'SHIB',
    defaultNetwork: 'ETH',
    icon: '/assets/currencies/shib.svg'
  },
  {
    name: 'PUMP',
    longName: 'Pump Fun',
    depositName: 'PUMP',
    networks: ['SOL'],
    defaultNetwork: 'SOL',
    icon: '/assets/currencies/pump.png'
  },
  // { name: 'DAI', longName: 'Dai Stablecoin', networks: ['ETH'], defaultNetwork: 'ETH', icon: "dai" },
  // { name: "Retardio", longName: 'Retardio', networks: ['SOL'], defaultNetwork: 'SOL', icon: "retardio" },
  // { name: "Giga", longName: 'Giga', networks: ['SOL'], defaultNetwork: 'SOL', icon: "giga" },
  {
    name: 'DASH',
    longName: 'Dash',
    depositName: 'DASH',
    networks: ['DASH'],
    defaultNetwork: 'DASH',
    icon: '/assets/currencies/dash.svg',
    details: [
      {
        fee: [
          {
            network: 'DASH',
            fee: 0.05
          }
        ]
      }
    ]
  },
  {
    name: 'BCH',
    longName: 'Bitcoin Cash',
    depositName: 'bitcoin-cash',
    networks: ['BCH'],
    defaultNetwork: 'BCH',
    icon: '/assets/currencies/bitcoin-cash.svg',
    details: [
      {
        fee: [
          {
            network: 'BCH',
            fee: 0.0001
          }
        ]
      }
    ]
  },
  {
    name: 'TON',
    longName: 'TON',
    depositName: 'TON',
    networks: ['TON'],
    defaultNetwork: 'TON',
    icon: '/assets/currencies/ton.svg',
    details: [
      {
        fee: [
          {
            network: 'TON',
            fee: 0.001
          }
        ]
      }
    ]
  }
];

export const mergedCurrencies: (Currency & { showDeposite: boolean })[] = [
  { id: 0, name: 'Bitcoin', nick: 'BTC', symbol: 'BTC', icon: '/assets/currencies/btc.svg', showDeposite: true },
  { id: 1, name: 'Ethereum', nick: 'ETH', symbol: 'ETH', icon: '/assets/currencies/eth.svg', showDeposite: true },
  { id: 2, name: 'Solana', nick: 'SOL', symbol: 'SOL', icon: '/assets/currencies/solana.svg', showDeposite: true },
  { id: 3, name: 'Litecoin', nick: 'LTC', symbol: 'LTC', icon: '/assets/currencies/ltc.svg', showDeposite: true },
  { id: 4, name: 'BNB Coin', nick: 'BNB.BSC', symbol: 'BNB', icon: '/assets/currencies/bnb.svg', showDeposite: true },
  { id: 5, name: 'Ordinals', nick: 'BRC-20s', symbol: '', icon: '/assets/currencies/brc20.svg', showDeposite: false },
  {
    id: 6,
    name: 'USDC',
    nick: 'ERC-20',
    symbol: 'USDC.ERC20',
    icon: '/assets/currencies/usdc.svg',
    showDeposite: true
  },
  {
    id: 7,
    name: 'Retardio',
    nick: 'SOL',
    symbol: 'RETARDIO',
    icon: '/assets/currencies/retardio.svg',
    showDeposite: false
  },
  { id: 8, name: 'Giga', nick: 'GIGA', symbol: 'GIGA', icon: '/assets/currencies/giga.svg', showDeposite: false },
  {
    id: 9,
    name: 'USDT',
    nick: 'ERC-20',
    symbol: 'USDT.ERC20',
    icon: '/assets/currencies/tether.svg',
    showDeposite: true
  },
  {
    id: 10,
    name: 'USDT',
    nick: 'TRC-20',
    symbol: 'USDT.TRC20',
    icon: '/assets/currencies/tron.svg',
    showDeposite: true
  },
  {
    id: 11,
    name: 'Doge Coin',
    nick: 'DOGE',
    symbol: 'DOGE',
    icon: '/assets/currencies/doge-coin.svg',
    showDeposite: true
  },
  {
    id: 12,
    name: 'Bitcoin Cash',
    nick: 'BCH',
    symbol: 'BCH',
    icon: '/assets/currencies/bitcoin-cash.svg',
    showDeposite: true
  },
  { id: 13, name: 'Dash Coin', nick: 'DASH', symbol: 'DASH', icon: '/assets/currencies/dash.svg', showDeposite: true },
  { id: 14, name: 'XRP', nick: 'XRP', symbol: 'XRP', icon: '/assets/currencies/xrp.svg', showDeposite: true },
  {
    id: 15,
    name: 'USDC',
    nick: 'USDC.SPL',
    symbol: 'USDC.SPL',
    icon: '/assets/currencies/usdc.svg',
    showDeposite: true
  },
  {
    id: 16,
    name: 'Ethereum',
    nick: 'AETH',
    symbol: 'ETH.AETH',
    icon: '/assets/currencies/eth.svg',
    showDeposite: true
  },
  {
    id: 17,
    name: 'Ethereum',
    nick: 'BASE',
    symbol: 'ETH.BASE',
    icon: '/assets/currencies/eth.svg',
    showDeposite: true
  },
  {
    id: 18,
    name: 'USDC',
    nick: 'USDC.BASE',
    symbol: 'USDC.BASE',
    icon: '/assets/currencies/usdc.svg',
    showDeposite: true
  },
  { id: 19, name: 'TON', nick: 'TON', symbol: 'TON', icon: '/assets/currencies/ton.svg', showDeposite: true },
  { id: 20, name: 'Avalanche', nick: 'AVAX', symbol: 'AVAX', icon: '/assets/currencies/avax.svg', showDeposite: true },
  { id: 21, name: 'Cardano', nick: 'ADA', symbol: 'ADA', icon: '/assets/currencies/ada.svg', showDeposite: true },
  { id: 22, name: 'Algorand', nick: 'ALGO', symbol: 'ALGO', icon: '/assets/currencies/algo.svg', showDeposite: false },
  { id: 23, name: 'ApeCoin', nick: 'APE', symbol: 'APE', icon: '/assets/currencies/ape.svg', showDeposite: true },
  { id: 24, name: 'Blast', nick: 'BLAST', symbol: 'BLAST', icon: '/assets/currencies/blast.png', showDeposite: false },
  { id: 25, name: 'Polkadot', nick: 'DOT', symbol: 'DOT', icon: '/assets/currencies/dot.svg', showDeposite: false },
  { id: 26, name: 'Fantom', nick: 'FTM', symbol: 'FTM', icon: '/assets/currencies/ftm.svg', showDeposite: false },
  {
    id: 27,
    name: 'Near Protocol',
    nick: 'NEAR',
    symbol: 'NEAR',
    icon: '/assets/currencies/near.svg',
    showDeposite: false
  },
  { id: 28, name: 'Tezos', nick: 'XTZ', symbol: 'XTZ', icon: '/assets/currencies/xtz.svg', showDeposite: false },
  { id: 29, name: 'Arbitrum', nick: 'ARB', symbol: 'ARB', icon: '/assets/currencies/arb.svg', showDeposite: false },
  { id: 30, name: 'SHIB', nick: 'SHIB', symbol: 'SHIB', icon: '/assets/currencies/shib.svg', showDeposite: true },
  { id: 30, name: 'Pump', nick: 'PUMP', symbol: 'PUMP', icon: '/assets/currencies/pump.png', showDeposite: true },
  {
    id: 31,
    name: 'Dai Stablecoin',
    nick: 'DAI',
    symbol: 'DAI',
    icon: '/assets/currencies/dai.svg',
    showDeposite: false
  },
  {
    id: 32,
    name: 'USDC',
    nick: 'USDC.BSC',
    symbol: 'USDC.BSC',
    icon: '/assets/currencies/usdc.svg',
    showDeposite: true
  },
  {
    id: 33,
    name: 'USDC',
    nick: 'USDC.POLYGON',
    symbol: 'USDC.POLYGON',
    icon: '/assets/currencies/usdc.svg',
    showDeposite: true
  },
  {
    id: 34,
    name: 'USDT',
    nick: 'USDT.SPL',
    symbol: 'USDT.SPL',
    icon: '/assets/currencies/tether.svg',
    showDeposite: true
  }
];

export const currencyPaths: Record<string, string> = {
  USD: '/assets/currencies/dollar.svg'
};

// Separate list for withdrawals (defined independently from deposits)
export const currenciesWdr: CurrencyDep[] = [
  {
    name: 'SOL',
    longName: 'Solana',
    depositName: 'Solana',
    networks: ['SOL'],
    defaultNetwork: 'SOL',
    icon: '/assets/currencies/solana.svg',
    details: [
      {
        fee: [
          {
            network: 'SOL',
            fee: 0.000005
          }
        ]
      }
    ]
  },
  {
    name: 'BTC',
    longName: 'Bitcoin',
    depositName: 'Bitcoin',
    networks: ['BTC'],
    defaultNetwork: 'BTC',
    icon: '/assets/currencies/btc.svg',
    details: [
      {
        fee: [
          {
            network: 'BTC',
            fee: 0.00008
          }
        ]
      }
    ]
  },
  {
    name: 'ETH',
    longName: 'Ethereum',
    depositName: 'Ethereum',
    networks: ['ETH', 'Arbitrum', 'BASE'],
    defaultNetwork: 'ETH',
    icon: '/assets/currencies/eth.svg',
    details: [
      {
        fee: [
          {
            network: 'ETH',
            fee: 0.0006
          }
        ]
      }
    ]
  },
  {
    name: 'LTC',
    longName: 'Litecoin',
    depositName: 'Litecoin',
    networks: ['LTC'],
    defaultNetwork: 'LTC',
    icon: '/assets/currencies/ltc.svg',
    details: [
      {
        fee: [
          {
            network: 'LTC',
            fee: 0.001
          }
        ]
      }
    ]
  },
  {
    name: 'USDT',
    longName: 'Tether',
    depositName: 'USDT',
    networks: ['TRON', 'ETH', 'SOL'],
    defaultNetwork: 'TRON',
    icon: '/assets/currencies/tether.svg',
    details: [
      {
        fee: [
          {
            network: 'TRON',
            fee: 4
          },
          {
            network: 'ETH',
            fee: 4
          },
          {
            network: 'default',
            fee: 4
          }
        ]
      }
    ]
  },
  {
    name: 'USDC',
    longName: 'USDC',
    networks: ['ETH', 'SOL', 'BASE', 'BSC', 'POLYGON'],
    defaultNetwork: 'ETH',
    depositName: 'USDC',
    icon: '/assets/currencies/usdc.svg',
    details: [
      {
        fee: [
          {
            network: 'ETH',
            fee: 4
          },
          {
            network: 'SOL',
            fee: 0.1
          },
          {
            network: 'default',
            fee: 4
          }
        ]
      }
    ]
  },
  {
    name: 'DOGE',
    longName: 'Dogecoin',
    depositName: 'Dogecoin',
    networks: ['DOGE'],
    defaultNetwork: 'DOGE',
    icon: '/assets/currencies/doge-coin.svg',
    details: [
      {
        fee: [
          {
            network: 'DOGE',
            fee: 4
          }
        ]
      }
    ]
  },
  {
    name: 'XRP',
    longName: 'Ripple',
    depositName: 'XRP',
    networks: ['XRP'],
    defaultNetwork: 'XRP',
    icon: '/assets/currencies/xrp.svg',
    details: [
      {
        fee: [
          {
            network: 'XRP',
            fee: 0.2
          }
        ]
      }
    ]
  },
  {
    name: 'BNB',
    longName: 'Binance Coin',
    depositName: 'binancecoin',
    networks: ['BSC'],
    defaultNetwork: 'BSC',
    icon: '/assets/currencies/bnb.svg',
    details: [
      {
        fee: [
          {
            network: 'BSC',
            fee: 0.0002
          }
        ]
      }
    ]
  },
  {
    name: 'AVAX',
    longName: 'Avalanche',
    depositName: 'Avalanche',
    networks: ['AVAX'],
    defaultNetwork: 'AVAX',
    icon: '/assets/currencies/avax.svg',
    details: [
      {
        fee: [
          {
            network: 'AVAX',
            fee: 0.001
          }
        ]
      }
    ]
  },
  {
    name: 'ADA',
    longName: 'Cardano',
    depositName: 'ADA',
    networks: ['ADA'],
    defaultNetwork: 'ADA',
    icon: '/assets/currencies/ada.svg'
  },
  {
    name: 'APE',
    longName: 'ApeCoin',
    depositName: 'APE',
    networks: ['ETH'],
    defaultNetwork: 'ETH',
    icon: '/assets/currencies/ape.svg'
  },
  {
    name: 'SHIB',
    longName: 'Shiba Inu',
    networks: ['ETH'],
    depositName: 'SHIB',
    defaultNetwork: 'ETH',
    icon: '/assets/currencies/shib.svg'
  },
  {
    name: 'PUMP',
    longName: 'Pump Fun',
    depositName: 'PUMP',
    networks: ['SOL'],
    defaultNetwork: 'SOL',
    icon: '/assets/currencies/pump.png'
  },
  {
    name: 'DASH',
    longName: 'Dash',
    depositName: 'DASH',
    networks: ['DASH'],
    defaultNetwork: 'DASH',
    icon: '/assets/currencies/dash.svg',
    details: [
      {
        fee: [
          {
            network: 'DASH',
            fee: 0.05
          }
        ]
      }
    ]
  },
  {
    name: 'BCH',
    longName: 'Bitcoin Cash',
    depositName: 'bitcoin-cash',
    networks: ['BCH'],
    defaultNetwork: 'BCH',
    icon: '/assets/currencies/bitcoin-cash.svg',
    details: [
      {
        fee: [
          {
            network: 'BCH',
            fee: 0.0001
          }
        ]
      }
    ]
  },
  {
    name: 'TON',
    longName: 'TON',
    depositName: 'TON',
    networks: ['TON'],
    defaultNetwork: 'TON',
    icon: '/assets/currencies/ton.svg',
    details: [
      {
        fee: [
          {
            network: 'TON',
            fee: 0.001
          }
        ]
      }
    ]
  }
];
