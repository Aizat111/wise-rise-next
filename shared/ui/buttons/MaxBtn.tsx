import { type ButtonProps } from '@investorcentretb/toshi-ui';

import { cn } from '@/core/lib/utils';

type MaxBtnProps = {
  onClick: () => void;
  intent?: ButtonProps['intent'];
  appearance?: ButtonProps['appearance'];
  size?: ButtonProps['size'];
  className?: string;
} & ButtonProps;

const MaxBtn = ({ onClick }: MaxBtnProps) => {
  return (
    <div className={cn('absolute right-2 top-1/2 -translate-y-1/2 text-white70')}>
      <div className="py-1 px-2 font-white text-xs rounded-md bg-bg_menu cursor-pointer" onClick={onClick}>
        Max
      </div>
    </div>
  );
};

export default MaxBtn;
