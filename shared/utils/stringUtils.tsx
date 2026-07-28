import { match } from 'path-to-regexp';

// Remove locale prefix like /en or /en-US from a pathname for matching
const stripLocale = (p: string): string => {
  if (!p) return '';
  return p.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/|$)/, '');
};

const getActiveTab = (pathname: string, link: string) => {
  const path = stripLocale(pathname || '').replace(/\/+$/, '');

  if (!link) {
    // Empty link implies base route of the section (commonly 'home' tab)
    return /(^$|^\/$|\/home(?:\/)?$)/.test(path);
  }

  // Absolute path: use path-to-regexp to support segment-aware matching
  if (link.startsWith('/')) {
    const normalizedLink = link.replace(/\/+$/, '');
    try {
      return !!match(normalizedLink, { end: false })(path);
    } catch {
      return path.startsWith(normalizedLink);
    }
  }

  // Segment string: test for segment boundary presence
  const segment = link.replace(/^\/+|\/+$/g, '');
  const re = new RegExp(`(^|/)${segment}(/|$)`, 'i');
  return re.test(path);
};

const shortenAddress = (address: string, width: number): string => {
  if (!address) return '';
  const limit = width < 1020 ? 30 : 55;
  return address.length > limit ? address.slice(0, limit) + '…' : address;
};

const truncateText = (text: string, maxLength: number, ellipsis: string = '...'): string => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + ellipsis : text;
};

export { getActiveTab, shortenAddress, truncateText };
