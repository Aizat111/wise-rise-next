import { sanitizeHtml } from "@/shared/utils/sanitizeHtml";
import { cn } from "@/lib/utils";

import type { HtmlContentProps } from "../types";

/**
 * Server/client-safe HTML renderer for trusted translation markup (`<b>`, `<span>`, etc.).
 */
export function HtmlContent({
  html,
  className,
  as: Tag = "div",
}: HtmlContentProps) {
  const sanitized = sanitizeHtml(html);

  if (!sanitized) return null;

  return (
    <Tag
      className={cn(className)}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
