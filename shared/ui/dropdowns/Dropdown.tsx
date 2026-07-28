import { DropdownMenu } from 'radix-ui';

import { cn } from '@/core/lib/utils';

interface DropdownProps {
  className?: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
  onOpenChange?: (_open: boolean) => void;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
}

const Dropdown = ({
  trigger,
  content,
  className,
  open,
  onOpenChange,
  align = 'end',
  sideOffset = 15,
  alignOffset = -10
}: DropdownProps) => {
  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn('z-[9992]', className)}
          sideOffset={sideOffset}
          align={align}
          side="bottom"
          alignOffset={alignOffset}
          avoidCollisions={true}
          collisionPadding={16}
        >
          {content}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Dropdown;
