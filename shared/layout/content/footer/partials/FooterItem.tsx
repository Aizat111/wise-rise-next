import { useTranslations } from 'next-intl';
import type { FC } from 'react';

import { cn } from '@/core/lib/utils';
import { Link } from '@/shared/ui/LoadingLink';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordions/Accordion';

type FooterItemProps = {
  title: string;
  links: {
    title: string;
    link: string;
    props?: Record<string, any>;
  }[];
  isTranslated?: boolean;
  width?: number;
  mobileContent?: React.ReactNode;
};
const FooterItem: FC<FooterItemProps> = ({ title, links, isTranslated = true, mobileContent }) => {
  const t = useTranslations();

  return (
    <>
      <div className="@[768px]:hidden ">
        <Accordion type="single" collapsible>
          <AccordionItem value="a">
            <AccordionTrigger
              className={cn(
                'group flex items-center data-[state=open]:bg-transparent hover:bg-white10 justify-between gap-2 w-full text-left @[768px]:py-3 py-4 border-t border-gray-500  px-4 bg-transparent rounded-none'
              )}
              indicator
              indicatorClassName="w-4 h-4 text-white70"
            >
              <h4 className="text-sm font-bold text-white uppercase">{t(title)}</h4>
            </AccordionTrigger>
            <AccordionContent className={cn(' pb-5 px-4 rounded-b-lg overflow-hidden')}>
              {mobileContent ? (
                mobileContent
              ) : (
                <ul className="space-y-2">
                  {links.map((link, index) => {
                    return (
                      <li key={index}>
                        <Link
                          href={link.link}
                          {...link?.props}
                          className=" hover:text-white transition-colors text-white70 duration-200 text-sm"
                        >
                          {isTranslated ? t(link.title) : link.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="@[768px]:flex flex-col hidden">
        <h4 className="text-sm font-bold text-white mb-4 uppercase">{t(title)}</h4>
        <ul className="space-y-2 text-white70 ">
          {links.map((link, index) => (
            <li key={index}>
              <Link className="hover:text-white transition-colors duration-200" href={link.link} {...link?.props}>
                {isTranslated ? t(link.title) : link.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default FooterItem;
