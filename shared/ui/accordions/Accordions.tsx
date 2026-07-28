'use client';

import { type ReactNode } from 'react';

import { cn } from '@/core/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordions/Accordion';

type AccordionsProps = {
  items: {
    id: string;
    number?: string;
    question: string;
    answer: ReactNode;
  }[];
  indicator?: boolean;
  indicatorClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
};

const Accordions = ({
  items,
  indicator = false,
  indicatorClassName = 'w-4 h-4 text-white70',
  titleClassName,
  contentClassName
}: AccordionsProps) => {
  return (
    <Accordion type="single" collapsible className="w-full gap-2">
      {items.map(item => (
        <AccordionItem key={item.id} value={item.id} className="w-full  rounded-lg">
          <AccordionTrigger
            className={cn(
              ' mb-2 p-5 bg-bg_content gap-4 data-[state=open]:bg-bg_content data-[state=open]:rounded-b-none data-[state=open]:mb-0',
              titleClassName
            )}
            indicator={indicator}
            indicatorClassName={indicatorClassName}
          >
            <div className="flex-1 justify-start text-white text-base lg:text-base font-semibold ">{item.question}</div>
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              'bg-bg_content px-5 pb-6 lg:px-10 text-base text-white80 lg:text-base rounded-b-lg mb-5',
              contentClassName
            )}
          >
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default Accordions;
