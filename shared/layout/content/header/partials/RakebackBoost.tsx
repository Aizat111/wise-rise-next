import { Button } from '@investorcentretb/toshi-ui';
import { Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { rakebackBoostTypes } from '@/core/constants/rakeback-boost.consttants';
import CustomTile from '@/screens/rewards/partials/rakeback-boost-bar/partials/CustomTile';
import { useRakebackBoost } from '@/shared/hooks/useRakebackBoost';
import ShowTextInput from '@/shared/ui/inputs/ShowTextInput';

const RakebackBoost = () => {
  const t = useTranslations();
  const { active, claimable, tileColors, handleActivate, activateLoading, boostType, timeLeft, timeUntilNextBoost } =
    useRakebackBoost();
  return (
    <div className="flex flex-col gap-3  bg-bg_color  rounded-md px-1.5 pr-2.5 py-4">
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-row items-center gap-2">
          <div className="w-7 h-7 inline-flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-500" />
          </div>
          <p className="text-white font-semibold text-base"> {t('rewards.rakebackBoost')}</p>
        </div>
        <div className="flex items-center justify-between max-w-[99px] w-full gap-1.5">
          {tileColors &&
            tileColors.map((colour, index) => (
              <CustomTile key={index} colour={colour} border={colour} customIcon={true} containerClassName="w-7 h-7" />
            ))}
        </div>
      </div>
      <div className="flex items-center justify-between pl-1">
        <ShowTextInput
          value={`${rakebackBoostTypes[boostType]?.percentage || 15}%`}
          className="text-sm w-fit bg_toshi"
          size="sm"
        />
        <Button
          intent={'primary'}
          appearance={'solid'}
          borderRadius="md"
          size="md"
          className=" h-[38px] min-w-[99px] w-fit px-2.5 py-2 "
          onClick={handleActivate}
          disabled={activateLoading || !claimable}
        >
          {claimable ? t('rewards.activate') : active ? timeLeft : timeUntilNextBoost}
        </Button>
      </div>
    </div>
  );
};

export default RakebackBoost;
