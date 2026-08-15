import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';

import { cn } from '@/core/lib/utils';

type CloseBtnProps = {
  onClick: () => void;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  className?: string;
} & ButtonProps;

const CloseBtn = ({
  onClick,
  appearance = 'ghost',
  variantSize = 'xs',
  className = 'text-lg font-extrabold p-0',
  ...props
}: CloseBtnProps) => {
  return (
    <Button
      onClick={onClick}
      variant={appearance}
      size={variantSize}
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
