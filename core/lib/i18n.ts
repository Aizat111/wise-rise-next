// Import from shared CommonJS module
import localeToDeepL from './localeToDeepL.js';

export const locales = Object.keys(localeToDeepL) as (keyof typeof localeToDeepL)[];

export const defaultLocale = 'tr';

export { localeToDeepL };
