import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import {
  isAzAllowedOnHost,
  isAzPathname,
} from '@/core/config/domain-locale.config';
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

export default function proxy(request: NextRequest) {
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
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
