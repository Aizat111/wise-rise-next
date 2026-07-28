import { getLocale } from 'next-intl/server';

import AccordionGameDescHeader from './partials/AccordionGameDescHeader';
import GameContent from './partials/GameContent';
import RightSlot from './partials/RightSlot';
import { SANITY_TYPES } from '@/core/api/sanity/api-config';
import { fetchSanityContent } from '@/core/api/sanity/fetchSanityContent';
import AccordionGameDescription from '@/shared/ui/accordions/AccordionGameDescription';

type Props = {
  slug: string;
};

export default async function GameDescription({ slug }: Props) {
  const locale = await getLocale();
  const data = await fetchSanityContent(slug, SANITY_TYPES.GET_SANITY_GAME_CONTENT, locale);
  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <AccordionGameDescription
        header={<AccordionGameDescHeader />}
        content={<GameContent data={data} locale={locale} />}
        showIndicator={Boolean(data)}
        rightSlot={<RightSlot />}
      />
    </div>
  );
}
