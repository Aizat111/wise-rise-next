import { HOPI_FIRST_PARTY_SCRIPT, VWO_SMARTCODE } from "./tracking-snippets";

/**
 * Critical head snippets that must run before paint/hydration:
 * Hopi first-party cookie + VWO SmartCode (hides body until experiments load).
 */
export function EarlyHeadTracking() {
  return (
    <>
      <link rel="preconnect" href="https://dev.visualwebsiteoptimizer.com" />
      <script
        dangerouslySetInnerHTML={{ __html: HOPI_FIRST_PARTY_SCRIPT }}
      />
      <script
        id="vwoCode"
        dangerouslySetInnerHTML={{ __html: VWO_SMARTCODE }}
      />
    </>
  );
}
