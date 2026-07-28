import { Button } from '@investorcentretb/toshi-ui';
import { XIcon } from 'lucide-react';
import type { FC } from 'react';
import { useDispatch } from 'react-redux';

import { removeMultiplayGames } from '@/core/redux-toolkit/slices/gameSlice';
import Image from '@/shared/ui/Images/Image';

interface GameCardProps {
  id: string;
  title: string;
  image: string;
}

const MultiplayGameCard: FC<GameCardProps> = ({ id, title, image }) => {
  const dispatch = useDispatch();

  return (
    <div className="multiplay-game-card relative" aria-label={`${title} image`}>
      <div
        aria-hidden="true"
        className="relative w-full h-full aspect-[153/201] overflow-hidden rounded-md min-h-[78px] min-w-[60px]"
      >
        <Image
          src={image}
          alt={`${title} image`}
          width={60}
          height={78}
          className="w-full h-full object-cover"
          aria-label={`${title} image`}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: '12px'
          }}
        />
      </div>
      <span className="absolute -right-4 -top-4 px-2 py-1">
        <Button
          intent="red"
          appearance="glossy"
          size="xs"
          className="rounded-md"
          iconOnly
          icon={<XIcon className="w-4 h-4 text-white" aria-label="Remove game from multiplay" />}
          onClick={() => dispatch(removeMultiplayGames({ id }))}
        />
      </span>
    </div>
  );
};

export default MultiplayGameCard;
