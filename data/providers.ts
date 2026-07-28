export interface Provider {
  name: string;
  image: React.ElementType | string;
  slug: string;
  filter: string;
  gameCount?: number | null;
}

const providerSvg = (file: string) => `/assets/providers/${file}`;

export const providers: Provider[] = [
  {
    name: 'Pragmatic Play',
    image: providerSvg('pragmatic.svg'),
    slug: 'pragmatic-play',
    filter: 'Pragmatic Play'
  },
  {
    name: 'Pragmatic Play Live',
    image: providerSvg('pragmatic.svg'),
    slug: 'pragmatic-play-live',
    filter: 'Pragmatic Play Live'
  },
  {
    name: 'Evolution',
    image: providerSvg('evolution.svg'),
    slug: 'evolution',
    filter: 'Evolution Gaming'
  },
  {
    name: 'Hacksaw',
    image: providerSvg('hacksaw.svg'),
    slug: 'hacksaw',
    filter: 'Hacksaw'
  },
  {
    name: "Toshi's Dojo ",
    image: providerSvg('toshisdojo.svg'),
    slug: 'toshis-dojo',
    filter: "Toshi's Dojo"
  },
  {
    name: 'Nolimit City',
    image: providerSvg('nolimit.svg'),
    slug: 'nolimit-city',
    filter: 'Nolimit City'
  },
  {
    name: 'Backseat Gaming',
    image: providerSvg('backseatgaming.svg'),
    slug: 'backseat-gaming',
    filter: 'backseat'
  },
  {
    name: 'Bullshark Games',
    image: providerSvg('bullsharkgames.svg'),
    slug: 'bullshark-games',
    filter: 'bullshark'
  },
  {
    name: 'AvatarUX',
    image: providerSvg('avatarux.svg'),
    slug: 'avatarux',
    filter: 'AvatarUX'
  },
  {
    name: 'PG Soft',
    image: providerSvg('pgsoft.svg'),
    slug: 'pg-soft',
    filter: 'PGSoft'
  },
  {
    name: 'Popiplay',
    image: providerSvg('popiplay.svg'),
    slug: 'popiplay',
    filter: 'Popiplay'
  },
  {
    name: 'BGaming',
    image: providerSvg('bgaming.svg'),
    slug: 'bgaming',
    filter: 'BGaming'
  },
  {
    name: 'GameArt',
    image: providerSvg('gameart.svg'),
    slug: 'game-art',
    filter: 'GameArt'
  },
  {
    name: 'Marbles',
    image: providerSvg('marbles.svg'),
    slug: 'marbles',
    filter: 'Marbles'
  },
  {
    name: 'Fantasma',
    image: providerSvg('fantasma.svg'),
    slug: 'fantasma',
    filter: 'Fantasma'
  },
  {
    name: '3 Oaks Gaming',
    image: providerSvg('3-oaks.svg'),
    slug: '3-oaks-gaming',
    filter: '3Oaks'
  },
  {
    name: 'Wazdan',
    image: providerSvg('wazdan.svg'),
    slug: 'wazdan',
    filter: 'Wazdan'
  },
  {
    name: 'Red Rake Gaming',
    image: providerSvg('redrakegaming.svg'),
    slug: 'red-rake-gaming',
    filter: 'Red Rake Gaming'
  },
  {
    name: 'Gamomat',
    image: providerSvg('gamomat.svg'),
    slug: 'gamomat',
    filter: 'Gamomat'
  },
  {
    name: 'OneTouch',
    image: providerSvg('onetouch.svg'),
    slug: 'onetouch',
    filter: 'OneTouch'
  },
  {
    name: 'Live 88',
    image: providerSvg('live88.svg'),
    slug: 'live-88',
    filter: 'Live88'
  },
  {
    name: '155.io',
    image: providerSvg('155svg.svg'),
    slug: '155-io',
    filter: '155.io'
  }
];
