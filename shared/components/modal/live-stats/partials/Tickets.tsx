import { TicketIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { IRaffleTicketsResponse } from '@/core/types/raffle.types';
import Card from '@/shared/components/card/Card';
import { useUserSocket } from '@/shared/hooks/sockets/useUserSocket';

const TicketsStats = () => {
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
    <Card className="p-3 bg-toshi_body/70">
      <div className="w-full flex justify-between items-center">
        <span className="text-sm text-white">{t('tickets')}</span>
        <div className="flex items-center gap-1 bg-[#424A5F] px-[6px] py-[4px] rounded-[4px]">
          <span className="font-extrabold text-sm text-white">
            {totalTiclets
              ? Number(totalTiclets) < 1000000
                ? new Intl.NumberFormat('en-US').format(Number(totalTiclets))
                : new Intl.NumberFormat('en-US', {
                    notation: 'compact',
                    maximumFractionDigits: 2
                  }).format(Number(totalTiclets))
              : '0'}
          </span>
          <TicketIcon color="#FF861C" />
        </div>
      </div>
    </Card>
  );
};

export default TicketsStats;
