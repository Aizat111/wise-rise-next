import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import {
  isAzAllowedOnHost,
  isAzPathname,
} from '@/core/config/domain-locale.config';
import { routing } from '@/core/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const host =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  const { pathname } = request.nextUrl;

  // TR-only known hosts: strip `/az` so they always stay Turkish
  if (isAzPathname(pathname) && !isAzAllowedOnHost(host)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/az/, '') || '/';
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
