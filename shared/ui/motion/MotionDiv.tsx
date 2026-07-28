'use client';

import React from 'react';

// Avoid importing framer-motion types into the type system to prevent toolchain issues
type MotionDivProps = React.ComponentPropsWithoutRef<'div'> & Record<string, unknown>;

export default function MotionDiv(props: MotionDivProps) {
  const [Motion, setMotion] = React.useState<any>(null);

  React.useEffect(() => {
    let mounted = true;
    import('framer-motion')
      .then(mod => {
        if (!mounted) return;
        setMotion(() => mod.motion);
      })
      .catch(() => {
        // no-op; fall back to div
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!Motion) return <div {...(props as any)} />;
  const MDiv = Motion.div as React.ComponentType<any>;
  return <MDiv {...(props as any)} />;
}
