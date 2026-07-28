import { type ElementType, type HTMLAttributes, useMemo } from 'react';

import { cn } from '@/core/lib/utils';
import { type SanitizeHtmlOptions, sanitizeHtml } from '@/shared/utils/sanitizeHtml';

export type SafeHtmlProps<T extends ElementType = 'div'> = {
  html: string;
  as?: T;
  className?: string;
  transform?: (_html: string) => string;
  sanitizeOptions?: SanitizeHtmlOptions;
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'dangerouslySetInnerHTML'>;

/**
 * Renders sanitized CMS HTML. Use this instead of raw `dangerouslySetInnerHTML`
 * for any untrusted or backend-provided markup.
 */
const SafeHtml = <T extends ElementType = 'div'>({
  html,
  as,
  className,
  transform,
  sanitizeOptions,
  ...props
}: SafeHtmlProps<T>) => {
  const Tag = (as ?? 'div') as ElementType;

  const sanitizedHtml = useMemo(() => {
    const transformed = transform ? transform(html) : html;
    return sanitizeHtml(transformed, sanitizeOptions);
  }, [html, transform, sanitizeOptions]);

  if (!sanitizedHtml) return null;

  return <Tag className={cn(className)} {...props} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default SafeHtml;
