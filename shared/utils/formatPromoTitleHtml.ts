import { stripHtmlTags } from '@/shared/utils/sanitizeHtml';

/**
 * Splits a two-word headline onto separate lines when a gold subtitle follows a `<br>`.
 * Example: "World Cup Boosts<br><span>Up to 50% Extra</span>"
 *       -> "World Cup<br>Boosts<br><span>Up to 50% Extra</span>"
 */
export const formatPromoTitleHtml = (html: string): string => {
  if (!/<br\s*\/?>/i.test(html)) return html;

  const segments = html
    .split(/<br\s*\/?>/i)
    .map(segment => segment.trim())
    .filter(Boolean);

  if (!segments.length) return '';

  const [headline, ...rest] = segments;
  const words = stripHtmlTags(headline).split(/\s+/);

  const formattedHeadline = words.length >= 2 ? `${words.slice(0, -1).join(' ')}<br>${words.at(-1)}` : headline;

  return [formattedHeadline, ...rest].join('<br>');
};

export const PROMO_TITLE_HTML_CLASS =
  'max-w-[70%] font-byrd text-xl font-bold uppercase leading-[0.95] text-white100 [text-shadow:0_4px_46px_rgba(0,0,0,1)] sm:max-w-[65%] sm:text-lg lg:max-w-[60%] lg:text-xl [&_span]:mt-0.5 [&_span]:block [&_span]:text-base [&_span]:font-bold [&_span]:uppercase [&_span]:leading-[0.95] [&_span]:text-[#FFD700] sm:[&_span]:text-sm lg:[&_span]:text-base [&_span]:mt-1';
