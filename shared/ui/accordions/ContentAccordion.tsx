'use client';

import { FC } from 'react';

import { cn } from '../../../core/lib/utils';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordions/Accordion';

type ContentAccordionProps = {
  data: {
    id: string;
    header: React.ReactNode;
    content: React.ReactNode;
  }[];
  showIndicator?: boolean;
  rightSlot?: React.ReactNode;
  accordionClassName?: string;
  accordionItemClassName?: string;
  accordionTriggerClassName?: string;
  accordionContentClassName?: string;
  bgColor?: string;
};

const ContentAccordion: FC<ContentAccordionProps> = ({
  data,
  showIndicator = true,
  rightSlot,
  accordionClassName,
  accordionItemClassName,
  accordionTriggerClassName,
  accordionContentClassName,
  bgColor = 'toshi_body'
}) => {
  const isMultiple = data.length > 1;

  return (
    <Accordion
      type={isMultiple ? 'multiple' : 'single'}
      {...(!isMultiple ? { collapsible: true } : {})}
      className={cn(`items-center bg-${bgColor} @mobg:px-6 px-4 rounded-lg w-full gap-2`, accordionClassName)}
    >
      {data.map((item, index) => (
        <AccordionItem
          key={`${item.id}-${index}`}
          value={item.id}
          className={cn('w-full rounded-lg', accordionItemClassName)}
        >
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
            {item.header}
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              `bg-${bgColor} p-0  mt-4 text-base text-white80 lg:text-base rounded-b-lg mb-5`,
              accordionContentClassName
            )}
          >
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ContentAccordion;
