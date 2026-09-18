import { TRACKING } from "@/config/tracking";

export function TrackingNoscript() {
  return (
    <>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${TRACKING.gtmId}`}
          height={0}
          width={0}
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height={1}
          width={1}
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${TRACKING.metaPixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height={1}
          width={1}
          style={{ display: "none" }}
          alt=""
          src={`https://px.ads.linkedin.com/collect/?pid=${TRACKING.linkedinPartnerId}&fmt=gif`}
        />
      </noscript>
    </>
  );
}
