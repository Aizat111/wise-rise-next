import * as RadixAccordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/core/lib/utils';

export const Accordion = RadixAccordion.Root;

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Item>,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <RadixAccordion.Item
      ref={ref}
      className={cn('border-b border-transparent last:border-none', className)}
      {...props}
    />
  );
});

export type AccordionTriggerProps = React.ComponentPropsWithoutRef<typeof RadixAccordion.Trigger> & {
  indicator?: React.ReactNode | null;
  indicatorClassName?: string;
  unstyled?: boolean;
  headerClassName?: string;
  rightSlot?: React.ReactNode;
  collapseOpenEffect?: boolean;
};

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Trigger>,
  AccordionTriggerProps
>(function AccordionTrigger(
  {
    className,
    children,
    indicator,
    unstyled,
    headerClassName,
    indicatorClassName,
    rightSlot,
    collapseOpenEffect = true,
    ...props
  },
  ref
) {
  return (
    <RadixAccordion.Header className={cn('w-full flex items-center gap-2', headerClassName)}>
      {unstyled ? (
        <>
          <RadixAccordion.Trigger ref={ref} className={cn(collapseOpenEffect && 'collapse-open', className)} {...props}>
            {children}
          </RadixAccordion.Trigger>
          {rightSlot ? <div className="ml-2 shrink-0">{rightSlot}</div> : null}
        </>
      ) : (
        <>
          <RadixAccordion.Trigger
            ref={ref}
            className={cn(
              'group flex w-full  items-center justify-between gap-2 rounded-lg bg-transparent p-0 text-left text-white transition-colors duration-200 flex-1',
              'data-[state=open]:bg-gray-900 hover:bg_menu',
              'disabled:pointer-events-none  disabled:hover:bg-transparent',
              className
            )}
            {...props}
          >
            <span className="inline-flex min-w-0 flex-1 items-center gap-8">{children}</span>
            {indicator && (
              <ChevronDownIcon
                className={cn(
                  'h-[16px] w-[16px] transition-transform duration-200 group-data-[state=open]:rotate-180',
                  indicatorClassName
                )}
              />
            )}
          </RadixAccordion.Trigger>
          {rightSlot ? <div className="ml-2 shrink-0">{rightSlot}</div> : null}
        </>
      )}
    </RadixAccordion.Header>
  );
});

export type AccordionContentProps = React.ComponentPropsWithoutRef<typeof RadixAccordion.Content> & {
  unstyled?: boolean;
  innerClassName?: string;
};

export const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof RadixAccordion.Content>,
  AccordionContentProps
>(function AccordionContent({ className, children, unstyled, innerClassName, ...props }, ref) {
  return (
    <RadixAccordion.Content
      ref={ref}
      className={cn('overflow-hidden data-[state=closed]:animate-none data-[state=open]:animate-none', className)}
      {...props}
    >
      {unstyled ? children : <div className={cn('pt-0', innerClassName)}>{children}</div>}
    </RadixAccordion.Content>
  );
});

export {
  Content as AccordionContentPrimitive,
  Item as AccordionItemPrimitive,
  Trigger as AccordionTriggerPrimitive
} from '@radix-ui/react-accordion';
export type { AccordionMultipleProps, AccordionSingleProps } from '@radix-ui/react-accordion';
export { RadixAccordion as AccordionPrimitive };
