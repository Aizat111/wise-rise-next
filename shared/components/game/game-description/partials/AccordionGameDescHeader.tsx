'use client';

import { useAppSelector } from '@/core/redux-toolkit/hooks';

const AccordionGameDescHeader = () => {
  const { game } = useAppSelector(state => state.game);
  const providerName =
    typeof game?.provider === 'string' ? game.provider : game?.provider?.displayName || game?.provider?.name || '';
  return (
    <div className="flex items-center gap-2 w-full ">
      <div className="flex items-center justify-center gap-2">
        <div className="w-full flex flex-row items-start gap-2">
          <div className="flex flex-row h-full items-baseline justify-center gap-2">
            <h1 className="@[768px]:text-md text-sm font-bold mb-0 capitalize"> {game?.name}</h1>
            <span className="@[768px]:text-sm text-sm mb-0.5 text-grey capitalize"> {providerName}</span>
          </div>
          {/* <Image src={game?.image || ''} alt={game?.name || ''} width={100} height={100} /> */}
        </div>
      </div>

      {/* <div className="absolute right-16">
        <Button
          className="bg-green-900/40 text-white hover:bg-green-900/40"
          icon={<Image src="/assets/currencies/dollar.svg" alt="rtp" width={16} height={16} />}
          iconPosition="left"
        >
          {game?.maxWin}x
        </Button>
      </div> */}
    </div>
  );
};

export default AccordionGameDescHeader;
