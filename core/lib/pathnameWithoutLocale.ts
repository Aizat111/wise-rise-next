/**
 * Strips the locale prefix from middleware `x-pathname` cookie value
 * (e.g. `/en/casino/home` → `/casino/home`).
 */
export function pathnameWithoutLocale(fullPathWithSearch: string, locale: string): string {
  const pathOnly = fullPathWithSearch.split('?')[0];
  const prefix = `/${locale}`;
  if (pathOnly === prefix || pathOnly.startsWith(`${prefix}/`)) {
    const rest = pathOnly.slice(prefix.length);
    return (rest.startsWith('/') ? rest : `/${rest}`) || '/';
  }
  return pathOnly || '/';
}
