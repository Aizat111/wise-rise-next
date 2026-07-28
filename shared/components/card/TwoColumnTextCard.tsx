import { getLocale } from 'next-intl/server';

import TwoColumnTextCardClient from './TwoColumnTextCardClient';
import { SANITY_TYPES } from '@/core/api/sanity/api-config';
import { fetchSanityContent } from '@/core/api/sanity/fetchSanityContent';

interface TwoColumnTextProps {
  slug?: string;
}

export default async function TwoColumnTextCard({ slug = '/casino/home' }: TwoColumnTextProps) {
  const locale = await getLocale();
  const data = await fetchSanityContent(slug, SANITY_TYPES.GET_SANITY_BLOG_CONTENT, locale);

  if (data == null) {
    return null;
  }

  return <TwoColumnTextCardClient data={data} />;
}
