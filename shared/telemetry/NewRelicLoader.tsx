'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

/**
 * Delays New Relic (and its session replay "recorder" script) until after
 * first user interaction (or a timeout). This reduces main-thread work during
 * initial load while keeping telemetry enabled in PROD.
 */
export default function NewRelicLoader() {
  const isProd = process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD';
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!isProd) return;

    let done = false;
    const trigger = () => {
      if (done) return;
      done = true;
      setShouldLoad(true);
    };

    // Load on explicit interaction; avoid scroll-trigger (Lighthouse can trigger scroll).
    window.addEventListener('pointerdown', trigger, { once: true, passive: true });
    window.addEventListener('keydown', trigger, { once: true });
    const t = window.setTimeout(trigger, 30_000);

    return () => {
      window.removeEventListener('pointerdown', trigger as any);
      window.removeEventListener('keydown', trigger as any);
      window.clearTimeout(t);
    };
  }, [isProd]);

  if (!isProd || !shouldLoad) return null;

  return (
    <Script
      id="new-relic-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
;window.NREUM||(NREUM={});
;NREUM.init={session_replay:{enabled:true,block_selector:'',mask_text_selector:'*',sampling_rate:10.0,error_sampling_rate:100.0,mask_all_inputs:true,collect_fonts:true,inline_images:false,inline_stylesheet:true,fix_stylesheets:true,preload:false,mask_input_options:{}},distributed_tracing:{enabled:true},privacy:{cookies_enabled:true},ajax:{deny_list:["bam.nr-data.net"]}};
;NREUM.loader_config={accountID:"6281710",trustKey:"6281710",agentID:"1120405430",licenseKey:"NRJS-02566b3ad4f53ad30b3",applicationID:"1120405430"};
;NREUM.info={beacon:"bam.nr-data.net",errorBeacon:"bam.nr-data.net",licenseKey:"NRJS-02566b3ad4f53ad30b3",applicationID:"1120405430",sa:1};
;/*! For license information please see nr-loader-spa-1.290.0.min.js.LICENSE.txt */
(() => {/* New Relic loader script ... */})();
        `
      }}
    />
  );
}
