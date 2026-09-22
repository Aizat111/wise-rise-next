import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { PATHNAME_HEADER } from '@/shared/seo/schema-ids';
import {
  isAzAllowedOnHost,
  isAzPathname,
  normalizeHostname,
} from '@/core/config/domain-locale.config';
import { CANONICAL_HOSTNAME } from '@/shared/seo/site-url';
import { routing } from '@/core/i18n/routing';
import {
  parseFreeCampaignPathname,
  toInternalCampaignPathname,
} from '@/features/auth/lib/free-campaign';

const intlMiddleware = createMiddleware(routing);

const TEACHERS_UNICODE_SEGMENT = 'eğitmenler'.normalize('NFC');

function decodePathname(pathname: string) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

function requestHostname(request: NextRequest) {
  const raw =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  return normalizeHostname(raw?.split(',')[0]);
}

function requestIsHttps(request: NextRequest) {
  const proto = request.headers
    .get('x-forwarded-proto')
    ?.split(',')[0]
    ?.trim()
    .toLowerCase();
  if (proto) return proto === 'https';
  return request.nextUrl.protocol === 'https:';
}

/**
 * One hop to https://wisenrise.com.
 * www and http are collapsed together so http://www does not chain through https://www.
 * Other hosts (localhost, webtest, wisenrise.com.tr) are left alone.
 */
function canonicalHostRedirect(request: NextRequest) {
  const hostname = requestHostname(request);
  const isWww = hostname === `www.${CANONICAL_HOSTNAME}`;
  const isApexHttp = hostname === CANONICAL_HOSTNAME && !requestIsHttps(request);

  if (!isWww && !isApexHttp) return null;

  const destination = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    `https://${CANONICAL_HOSTNAME}`,
  );
  return NextResponse.redirect(destination, 301);
}

const METADATA_PATHS = new Set(["/robots.txt", "/sitemap.xml"]);

/** Public pathname for server-rendered JSON-LD. Survives next-intl rewrites. */
function withPathnameHeader(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set(PATHNAME_HEADER, request.nextUrl.pathname);
  return new NextRequest(request, { headers });
}

export default function proxy(request: NextRequest) {
  const canonicalRedirect = canonicalHostRedirect(request);
  if (canonicalRedirect) return canonicalRedirect;

  // Metadata files are served by App Router. Skip locale rewriting so
  // `/robots.txt` and `/sitemap.xml` stay on the canonical host.
  if (METADATA_PATHS.has(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  request = withPathnameHeader(request);

  const host =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  const { pathname } = request.nextUrl;
  const normalizedPath = decodePathname(pathname).normalize('NFC');

  // Unicode `/eğitmenler` is rewritten to the ASCII App Router folder.
  // A `eğitmenler` folder 404s on macOS (NFD vs URL NFC) via `[teacherSlug]`.
  if (
    normalizedPath === `/${TEACHERS_UNICODE_SEGMENT}` ||
    normalizedPath === `/az/${TEACHERS_UNICODE_SEGMENT}`
  ) {
    const url = request.nextUrl.clone();
    url.pathname = normalizedPath.replace(
      TEACHERS_UNICODE_SEGMENT,
      'egitmenler',
    );
    return intlMiddleware(new NextRequest(url, request));
  }

  // TR-only known hosts: strip `/az` so they always stay Turkish
  if (isAzPathname(pathname) && !isAzAllowedOnHost(host)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/az/, '') || '/';
    return NextResponse.redirect(url);
  }

  const campaign = parseFreeCampaignPathname(pathname);
  if (campaign) {
    const url = request.nextUrl.clone();
    url.pathname = toInternalCampaignPathname(campaign);
    if (campaign.companyName) {
      url.searchParams.set('company', campaign.companyName);
    } else {
      url.searchParams.delete('company');
    }
    return NextResponse.rewrite(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    '/robots.txt',
    '/sitemap.xml',
  ],
};
