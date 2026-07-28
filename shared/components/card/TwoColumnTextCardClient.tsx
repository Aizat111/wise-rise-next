'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { PortableText } from '@portabletext/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import Card from './Card';
import { cn } from '@/core/lib/utils';
import { IBlog } from '@/core/types/blog.types';
import { portableTextComponents } from '@/shared/utils/sanityUtls';

type TwoColumnTextCardClientProps = {
  data: IBlog;
};

export default function TwoColumnTextCardClient({ data }: TwoColumnTextCardClientProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={cn('rounded-2xl bg-bg_content p-10 border border-gray-500 relative', isOpen ? 'pb-28' : 'pb-0')}>
      <div className={cn('transition text-white rounded-2xl overflow-hidden', isOpen ? 'h-full' : 'h-[377px]')}>
        <div>
          <h1 className="text-xl font-bold mb-2">{data.title}</h1>
          <div className="mt-8 md:columns-2 gap-6 space-y-4 text-white50">
            <PortableText value={data.body} components={portableTextComponents} />
          </div>
        </div>
      </div>

      <div
        className={cn(
          'flex justify-center items-end absolute  -left-2 w-[calc(100%+32px)] mt-4 h-[144px] ',
          isOpen ? 'h-[70px] bottom-10' : 'h-[144px] two-column-more-button -bottom-2'
        )}
      >
        <Button
          intent="gray"
          appearance="solid"
          borderRadius="md"
          className="bg-toshi_body text-base py-2.5 px-3  text-primary-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? t('see_less') : t('see_more')}
        </Button>
      </div>
    </Card>
  );
}
