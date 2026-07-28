import { Ticket } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type FC, useEffect, useState } from 'react';

import Card from './Card';
import { IRaffleTicketsResponse } from '@/core/types/raffle.types';
import { useUserSocket } from '@/shared/hooks/sockets/useUserSocket';
import CountdownTimer from '@/shared/ui/CountdownTimer';
import { formatNumberWithCommas } from '@/shared/utils/numberUtils';

interface RaffleCardProps {
  title: string;
}

const RaffleCard: FC<RaffleCardProps> = ({ title }) => {
  const t = useTranslations();
  const [totalTiclets, setTotalTickets] = useState(0);
  const { connected, on, off } = useUserSocket();

  useEffect(() => {
    if (connected) {
      on('user:raffleTickets', (response: IRaffleTicketsResponse) => {
        setTotalTickets(response.raffle_tickets_with_wagering + response.raffle_tickets_with_gold);
      });
    }
    return () => {
      off('user:raffleTickets');
    };
  }, [connected, on, off]);

  return (
    <Card className="@[768px]:gap-3 @[768px]:p-7 gap-8 p-6 min-h-[322px]">
      <div className="relative w-full  flex-col flex rounded-md ">
        <div className="text-xl @[768px]:text-3xl font-byrd font-semibold text-white leading-[1.2] @[768px]:leading-tight">
          {title.toUpperCase()}
        </div>
      </div>

      <div className="relative w-full flex-col gap-xsgap flex rounded-xl">
        <CountdownTimer className="w-full" />
      </div>

      <div className="relative w-full flex flex-col gap-xsgap rounded-xl ">
        <p className="text-sm font-semibold text-grey"> {t('raffle.your_tickets')}</p>

        <div className="relative w-full flex flex-row justify-between items-center">
          <div className="relative w-fit flex flex-row gap-2.5 justify-between items-center bg-bg_menu py-2.5 px-4 rounded-md">
            <p className="text-lg font-semibold text-white">{formatNumberWithCommas(totalTiclets)}</p>
            <Ticket className="size-5 text-primary-500" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RaffleCard;
