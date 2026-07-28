import { Button } from '@investorcentretb/toshi-ui';
import { Blocks, ChartLine, TicketIcon, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { DraggablesModal } from '../DraggablesModal';

import DailyDollarTrackingLiveStats from './partials/DailyDollarTrackingLiveStats';
import HeaderLiveStats from './partials/HeaderLiveStats';
import Level0Placeholder from './partials/Level0Placeholder';
import LevelTrackingLiveStats from './partials/LevelTrackingLiveStats';
import LiveSessionStats from './partials/LiveSessionStats';
import { RakebackLiveStats } from './partials/RakebackLiveStats';
import TicketsStats from './partials/Tickets';
import { cn } from '@/core/lib/utils';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { RootState } from '@/core/redux-toolkit/store';
import Vipside from '@/shared/assets/sidebar/Vipside';
import Image from '@/shared/ui/Images/Image';
import OpacitySlider from '@/shared/ui/sliders/OpacitySlider';
import { CustomTooltip } from '@/shared/ui/tooltips/Tooltip';

const ProfitGraph = dynamic(() => import('./partials/ProfitGraph').then(mod => mod.default), {
  ssr: false,
  loading: () => <div /> // placeholder
});

interface ComponentVisibility {
  bettingStats: boolean;
  dailyDollar: boolean;
  tickets: boolean;
  levelTracking: boolean;
  rakeback: boolean;
  graph: boolean;
}

const LiveStats = () => {
  const { user } = useAppSelector((state: RootState) => state.user);
  // Component visibility state
  const [componentVisibility, setComponentVisibility] = useState<ComponentVisibility>({
    bettingStats: true,
    dailyDollar: true,
    tickets: true,
    levelTracking: false,
    rakeback: false,
    graph: true
  });
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const toggleComponent = (component: keyof ComponentVisibility) => {
    setComponentVisibility(prev => ({
      ...prev,
      [component]: !prev[component]
    }));
  };
  return (
    <DraggablesModal header={<HeaderLiveStats />} width={277}>
      <div className="px-0">
        <div className="bg-toshi_body flex gap-1.5 px-3 py-2">
          <CustomTooltip label="Betting Stats">
            <Button
              intent="gray"
              appearance="3d"
              isActive={componentVisibility.bettingStats}
              size="xs"
              iconOnly
              onClick={() => toggleComponent('bettingStats')}
              icon={<Blocks className="h-4 " />}
              className={cn(
                'rounded-md cursor-pointer !bg-[#424A5F]',
                !componentVisibility.bettingStats && '!bg-[#424A5F]/30'
              )}
            />
          </CustomTooltip>
          <CustomTooltip label="P&L Graph">
            <Button
              intent="gray"
              appearance="3d"
              isActive={componentVisibility.graph}
              size="xs"
              onClick={() => toggleComponent('graph')}
              iconOnly
              icon={<ChartLine className="h-4" />}
              className={cn(
                'rounded-md cursor-pointer !bg-[#424A5F]',
                !componentVisibility.graph && '!bg-[#424A5F]/30'
              )}
            />
          </CustomTooltip>
          <CustomTooltip label="Raffle">
            <Button
              intent="gray"
              appearance="3d"
              isActive={isAuthenticated && componentVisibility.tickets}
              size="xs"
              onClick={() => toggleComponent('tickets')}
              iconOnly
              icon={<TicketIcon className="h-4" />}
              className={cn(
                'rounded-md cursor-pointer !bg-[#424A5F]',
                !(isAuthenticated && componentVisibility.tickets) && '!bg-[#424A5F]/30'
              )}
              disabled={!isAuthenticated}
            />
          </CustomTooltip>
          <CustomTooltip label="VIP Progress">
            <Button
              intent="gray"
              appearance="3d"
              isActive={isAuthenticated && componentVisibility.levelTracking}
              size="xs"
              onClick={() => toggleComponent('levelTracking')}
              iconOnly
              icon={<Vipside className="h-4" viewBox="0 0 24 24" />}
              className={cn(
                'rounded-md cursor-pointer !bg-[#424A5F]',
                !(isAuthenticated && componentVisibility.levelTracking) && '!bg-[#424A5F]/30'
              )}
              disabled={!isAuthenticated}
            />
          </CustomTooltip>
          <CustomTooltip label="Daily Dollars">
            <Button
              intent="gray"
              appearance="3d"
              isActive={isAuthenticated && componentVisibility.dailyDollar}
              size="xs"
              onClick={() => toggleComponent('dailyDollar')}
              iconOnly
              icon={<Image src="/assets/currencies/dollar.svg" alt="dollar" width={15} height={15} />}
              className={cn(
                'rounded-md cursor-pointer !bg-[#424A5F]',
                !(isAuthenticated && componentVisibility.dailyDollar) && '!bg-[#424A5F]/30'
              )}
              disabled={!isAuthenticated}
            />
          </CustomTooltip>
          <CustomTooltip label="Rakeback">
            <Button
              intent="gray"
              appearance="3d"
              isActive={isAuthenticated && componentVisibility.rakeback}
              size="xs"
              iconOnly
              onClick={() => toggleComponent('rakeback')}
              icon={<Zap className="h-4" />}
              className={cn(
                'rounded-md cursor-pointer !bg-[#424A5F]',
                !(isAuthenticated && componentVisibility.rakeback) && '!bg-[#424A5F]/30'
              )}
              disabled={!isAuthenticated}
            />
          </CustomTooltip>
          <OpacitySlider />
        </div>

        <div className="flex flex-col bg-bg_menu p-2.5 my-0 gap-2 overflow-y-scroll max-h-[80vh] no-scrollbar">
          {componentVisibility.bettingStats && <LiveSessionStats />}
          {componentVisibility.graph && <ProfitGraph />}
          {isAuthenticated && componentVisibility.tickets && <TicketsStats />}
          {isAuthenticated && componentVisibility.levelTracking && <LevelTrackingLiveStats />}
          {isAuthenticated &&
            componentVisibility.dailyDollar &&
            (user?.level === 0 ? <Level0Placeholder /> : <DailyDollarTrackingLiveStats />)}
          {isAuthenticated && componentVisibility.rakeback && <RakebackLiveStats rakeback_balance={0} />}
        </div>
      </div>
    </DraggablesModal>
  );
};

export default LiveStats;
