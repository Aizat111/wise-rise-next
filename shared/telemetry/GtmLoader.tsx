'use client';

import Script from 'next/script';

/**
 * Loads Google Tag Manager after hydration.
 *
 * Previously this was gated behind the first user interaction (pointerdown /
 * keydown / 30s timeout), which meant every visitor who bounced before
 * clicking or pressing a key was invisible to GA4 — the page_view hit never
 * fired. See #574.
 *
 * `afterInteractive` still defers the script until after hydration (so it
 * doesn't compete with the initial render for main-thread time) but fires
 * for every visitor, not just the ones who interact. This is Next.js's
 * default recommendation for analytics loaders.
 */
export default function GtmLoader() {
  const isProd = process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD';
  if (!isProd) return null;

  return (
    <Script
      id="gtm-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-P99QK95K');`
      }}
    />
  );
}
