import Card from '@/shared/components/card/Card';
import Image from '@/shared/ui/Images/Image';
import ProgressBar from '@/shared/ui/progressbar/ProgressBar';

const RewardStat = ({
  title,
  value,
  totalRewards,
  backgroundColor = 'bg-orange-600'
}: {
  title: string;
  value: number;
  totalRewards: number;
  backgroundColor?: string;
}) => {
  const numericValue = Number(value ?? 0);
  const numericTotal = Number(totalRewards ?? 0);
  const progress = numericTotal > 0 ? (numericValue / numericTotal) * 100 : 0;
  return (
    <Card className="self-stretch flex-1 inline-flex bg-bg_menu justify-start items-start gap-8">
      <div className="flex-1 self-stretch inline-flex flex-col justify-between items-start">
        <div className="w-7 h-7 flex flex-col justify-start items-start gap-1.5 overflow-hidden">
          {/* <div className="inline-flex justify-start items-center gap-1.5 overflow-hidden">{icon}</div> */}
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <div className="inline-flex justify-start items-center gap-2">
            <div className="flex justify-center items-center gap-2.5">
              <div className="justify-start whitespace-nowrap text-white/60 text-base font-semibold font-suisse_intl leading-6 tracking-wide">
                {title}
              </div>
            </div>
            <div className="flex justify-center items-center gap-1">
              <div className="flex justify-start items-center gap-1">
                <div className="justify-start text-white text-base font-semibold font-suisse_intl leading-6 tracking-wide">
                  {Number(value ?? 0).toFixed(2)}
                </div>
                <Image
                  src="/assets/currencies/dollar.svg"
                  loading="lazy"
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5"
                  alt="$"
                />
              </div>
            </div>
          </div>
          <ProgressBar
            progress={progress}
            height="h-3"
            backgroundColor="bg-white10"
            progressColor={backgroundColor}
            animated
          />
        </div>
      </div>
    </Card>
  );
};

export default RewardStat;
