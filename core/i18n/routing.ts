import { defineRouting } from 'next-intl/routing';

import { DEFAULT_LOCALE, locales } from '@/core/config/domain-locale.config';

export type { AppLocale } from '@/core/config/domain-locale.config';
export { locales };

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: DEFAULT_LOCALE,
  // Turkish has no prefix; Azerbaijani is served under `/az`
  localePrefix: 'as-needed',
  // Domain/path decide locale — ignore Accept-Language
  localeDetection: false,
});
