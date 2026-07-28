import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`@/core/languages/${locale}.json`)).default,
    timeZone: 'UTC',
    onError(error) {
      if (error.code === 'MISSING_MESSAGE' && process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD') {
        return;
      }
      console.error(error);
    }
  };
});
