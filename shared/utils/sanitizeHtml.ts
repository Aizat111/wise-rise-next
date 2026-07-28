import DOMPurify, { type Config } from 'isomorphic-dompurify';

const ALLOWED_COLOR_PATTERN =
  /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$|^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;

const CMS_HTML_CONFIG: Config = {
  ALLOWED_TAGS: ['br', 'span', 'b', 'strong', 'i', 'em', 'p', 'a'],
  ALLOWED_ATTR: ['style', 'href', 'target', 'rel', 'class'],
  ALLOWED_URI_REGEXP: /^https?:\/\//i
};

const sanitizeInlineStyle = (style: string): string | null => {
  const colorMatch = style.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
  if (!colorMatch) return null;

  const color = colorMatch[1].trim();
  if (!ALLOWED_COLOR_PATTERN.test(color)) return null;

  return `color: ${color}`;
};

let hooksRegistered = false;

const registerSanitizerHooks = () => {
  if (hooksRegistered) return;
  hooksRegistered = true;

  DOMPurify.addHook('afterSanitizeAttributes', node => {
    if (node.hasAttribute('style')) {
      const safeStyle = sanitizeInlineStyle(node.getAttribute('style') ?? '');
      if (safeStyle) {
        node.setAttribute('style', safeStyle);
      } else {
        node.removeAttribute('style');
      }
    }

    if (node.tagName !== 'A') return;

    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  });
};

export type SanitizeHtmlOptions = Partial<Config>;

/** Strips HTML tags and returns plain text. Useful for alt text and previews. */
export const stripHtmlTags = (value: string): string => value.replace(/<[^>]*>/g, '').trim();

/**
 * Sanitizes untrusted CMS HTML before rendering with `dangerouslySetInnerHTML`.
 * Defaults to a strict allowlist suited for promo cards and rich text snippets.
 */
export const sanitizeHtml = (dirty: string, options?: SanitizeHtmlOptions): string => {
  if (!dirty.trim()) return '';

  registerSanitizerHooks();

  return DOMPurify.sanitize(dirty, {
    ...CMS_HTML_CONFIG,
    ...options
  });
};
