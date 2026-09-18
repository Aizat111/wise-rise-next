import Script from "next/script";

import { TRACKING } from "@/config/tracking";

import {
  CUSTOMER_IO_SCRIPT,
  GTAG_SCRIPT,
  GTM_SCRIPT,
  HOTJAR_SCRIPT,
  LINKEDIN_INSIGHT_SCRIPT,
  LINKEDIN_PARTNER_SCRIPT,
  META_PIXEL_SCRIPT,
  OPTINMONSTER_SCRIPT,
  TIKTOK_PIXEL_SCRIPT,
} from "./tracking-snippets";

export function TrackingScripts() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {META_PIXEL_SCRIPT}
      </Script>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {GTM_SCRIPT}
      </Script>
      <Script id="tiktok-pixel" strategy="afterInteractive">
        {TIKTOK_PIXEL_SCRIPT}
      </Script>
      <Script id="hotjar" strategy="afterInteractive">
        {HOTJAR_SCRIPT}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${TRACKING.gaMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {GTAG_SCRIPT}
      </Script>
      <Script id="optinmonster" strategy="afterInteractive">
        {OPTINMONSTER_SCRIPT}
      </Script>
      <Script id="linkedin-partner" strategy="afterInteractive">
        {LINKEDIN_PARTNER_SCRIPT}
      </Script>
      <Script id="linkedin-insight" strategy="afterInteractive">
        {LINKEDIN_INSIGHT_SCRIPT}
      </Script>
      <Script id="customer-io" strategy="afterInteractive">
        {CUSTOMER_IO_SCRIPT}
      </Script>
    </>
  );
}
