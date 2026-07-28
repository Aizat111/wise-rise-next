'use client';

import { type FC, type ReactNode } from 'react';

import Accordions from './Accordions';
import { cn } from '@/core/lib/utils';
import Card from '@/shared/components/card/Card';

// Types
interface TipItem {
  id: string;
  number: string;
  question: string;
  answer: ReactNode;
  isExpanded?: boolean;
}

interface TipsAccordionProps {
  title: string;
  tips: TipItem[];
  learnMoreText?: string;
  onLearnMoreClick?: () => void;
  className?: string;
  indicator?: boolean;
  indicatorClassName?: string;
  baseTitleClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
}

// Reusable Components
const TipsHeader: FC<{ title: string; baseTitleClassName?: string }> = ({ title, baseTitleClassName }) => (
  <div className="self-stretch inline-flex justify-start items-center gap-12">
    <div className="flex-1 flex justify-start items-center gap-[5px]">
      <h2
        className={cn(
          'text-center whitespace-nowrap justify-start text-white text-xl @[768px]:text-xl font-semibold ',
          baseTitleClassName
        )}
      >
        {title}
      </h2>
    </div>
  </div>
);

export const TipsAccordion: FC<TipsAccordionProps> = ({
  title,
  tips,
  className = '',
  indicator = false,
  indicatorClassName = 'w-4 h-4 text-white70',
  baseTitleClassName,
  titleClassName,
  contentClassName
}) => {
  return (
    <Card
      className={`@[768px]:px-10 px-4 @[768px]:py-12 py-6 rounded-xl inline-flex flex-col justify-center items-end gap-10 ${className}`}
    >
      {title && (
        <div className=" w-full ">
          <TipsHeader title={title} baseTitleClassName={baseTitleClassName} />
        </div>
      )}

      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        <Accordions
          items={tips}
          indicator={indicator}
          indicatorClassName={indicatorClassName}
          titleClassName={titleClassName}
          contentClassName={contentClassName}
        />
      </div>
    </Card>
  );
};

export default TipsAccordion;
