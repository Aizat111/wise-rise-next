import { ArrowUp, ChartLine, CirclePercent } from 'lucide-react';
import { useSelector } from 'react-redux';

import { RootState } from '@/core/redux-toolkit/store';
import Image from '@/shared/ui/Images/Image';

const GameCard = () => {
  const { game, gameStats } = useSelector((state: RootState) => state.game);
  const providerName =
    typeof game?.provider === 'string' ? game.provider : game?.provider?.displayName || game?.provider?.name || '';
  const gameInfo = [
    {
      icon: '/assets/svgs/provider.svg',
      label: 'Provider:',
      value: providerName
    },
    {
      icon: <ArrowUp className="w-9 h-9" />,
      label: 'Max Win:',
      value: gameStats.maxWin
    },
    {
      icon: <CirclePercent className="w-9 h-9" />,
      label: 'Edge:',
      value: `${gameStats.edge}%`
    },
    {
      icon: <ChartLine className="w-9 h-9" />,
      label: 'Volatility:',
      value: gameStats.volatility
    },
    {
      icon: '/assets/svgs/strategy.svg',
      label: 'Difficulty:',
      value: gameStats.difficulty
    },
    {
      icon: '/assets/svgs/play-speed.svg',
      label: 'Gameplay:',
      value: gameStats.gameplay
    }
  ];

  return (
    <div className="flex gap-6 mb-6">
      <div className="hidden lg:flex flex-shrink-0 aspect-[153/201] rounded-lg overflow-hidden w-60">
        <Image
          src={game?.image || ''}
          alt={`${game?.name} image`}
          width={153}
          height={201}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="grid grid-cols-3 gap-4">
          {gameInfo.map((item, index) => (
            <div
              key={index}
              className="bg-bg_content rounded-lg p-4 flex flex-col items-start justify-center gap-5 text-left aspect-[259/145]"
            >
              <div className="text-white">
                {typeof item.icon === 'string' ? (
                  <Image src={item.icon} alt={item.label} width={36} height={36} />
                ) : (
                  item.icon
                )}
              </div>
              <div>
                <div className="text-gray-400 text-sm">{item.label}</div>
                <div className="text-white font-medium">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
