// Server component — NO 'use client' directive on purpose.
//
// Rendered by every root-layout <body> so the SSR HTML body-children
// structure is identical across them, preventing React #418 hydration
// mismatches when Next.js serializes an alternate root (e.g. not-found.tsx)
// into the RSC Flight payload as a fallback tree. See #588.
//
// The client-side controller that fades / removes this overlay after
// hydration lives in src/shared/layout/InitialFixedOverlay.tsx and is still
// mounted via src/shared/layout/Layout.tsx. Do not merge the two — this one
// has to be a server-component sibling of the body's first child.
export default function InitialOverlaySSR() {
  return (
    <div id="initial-overlay-ssr" className="fixed inset-0 z-[2000] bg-bg_color flex items-start justify-center">
      <div className="relative inline-flex items-center justify-center pt-[36vh]">
        <div className="relative w-[150px] h-[150px]">
          <img
            src="/assets/loading/spinnertext.svg"
            className="animate-spin w-[150px] h-[150px]"
            style={{ animationDuration: '6000ms' }}
            alt="Loading"
            width={150}
            height={150}
          />
          <img
            src="/assets/loading/toshiface.svg"
            width={150}
            height={150}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            alt="Toshi Icon"
          />
        </div>
      </div>
    </div>
  );
}
