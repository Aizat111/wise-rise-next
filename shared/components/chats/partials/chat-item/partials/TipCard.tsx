import Image from '@/shared/ui/Images/Image';

type TipCardProps = {
  tipData: Record<string, any>;
};

const TipCard: React.FC<TipCardProps> = ({ tipData }) => {
  return (
    <div className="block rounded overflow-hidden ml-7 py-1.5 px-2  mt-1 mb-1 mx-0 border border-orange-500">
      <div className="w-full flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-orange-500 font-bold">TIP</span>
          <div className="flex items-center gap-0.5">
            <span className="text-xs font-black text-orange-500">${Number(tipData.amount).toFixed(2)}</span>
            <Image src="/assets/currencies/dollar.svg" alt="dollar" width={9} height={9} className="mb-0.5" />
          </div>
        </div>
        <span className="text-xs text-gray-300">to {tipData.toUsername}</span>
      </div>
    </div>
  );
};

export default TipCard;
