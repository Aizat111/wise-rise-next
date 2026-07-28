import { FC } from 'react';

import { cn } from '../../../core/lib/utils';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordions/Accordion';

type AccordionGameDescriptionProps = {
  header: React.ReactNode;
  content: React.ReactNode;
  showIndicator?: boolean;
  rightSlot?: React.ReactNode;
  accordionClassName?: string;
  accordionItemClassName?: string;
  accordionTriggerClassName?: string;
  accordionContentClassName?: string;
  bgColor?: string;
};

const AccordionGameDescription: FC<AccordionGameDescriptionProps> = ({
  header,
  content,
  showIndicator = true,
  rightSlot,
  accordionClassName,
  accordionItemClassName,
  accordionTriggerClassName,
  accordionContentClassName,
  bgColor = 'toshi_body'
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="1"
      className={cn(`items-center bg-${bgColor} @mobg:px-6 px-4 rounded-lg w-full gap-2`, accordionClassName)}
    >
      <AccordionItem value={'1'} className={cn('w-full rounded-lg', accordionItemClassName)}>
        <AccordionTrigger
          className={cn(
            ` py-5 bg-${bgColor} data-[state=open]:rounded-b-none data-[state=open]:mb-0 data-[state=open]:bg-${bgColor} data-[state=open]:hover:bg-${bgColor} relative`,
            accordionTriggerClassName
          )}
          indicator={showIndicator}
          indicatorClassName="w-6 h-6"
          disabled={!showIndicator}
          rightSlot={rightSlot}
        >
          {header}
        </AccordionTrigger>
        <AccordionContent
          className={cn(
            `bg-${bgColor} p-0  mt-4 text-base text-white80 lg:text-base rounded-b-lg mb-5`,
            accordionContentClassName
          )}
        >
          {content}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionGameDescription;
