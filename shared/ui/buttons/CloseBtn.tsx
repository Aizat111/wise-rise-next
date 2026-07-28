import { Button, type ButtonProps } from '@investorcentretb/toshi-ui';

import { cn } from '@/core/lib/utils';

type CloseBtnProps = {
  onClick: () => void;
  intent?: ButtonProps['intent'];
  appearance?: ButtonProps['appearance'];
  size?: ButtonProps['size'];
  className?: string;
} & ButtonProps;

const CloseBtn = ({
  onClick,
  appearance = 'ghost',
  size = 'xs',
  className = 'text-lg font-extrabold p-0',
  ...props
}: CloseBtnProps) => {
  return (
    <Button
      onClick={onClick}
      appearance={appearance}
      size={size}
      className={cn(
        'text-lg font-extrabold text-white p-0 m-0 bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent w-auto h-auto min-w-0 leading-none rounded-none',
        className
      )}
      {...props}
    >
      X
    </Button>
  );
};

export default CloseBtn;
