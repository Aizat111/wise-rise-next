'use client';

import dynamic from 'next/dynamic';

// Create a shared, cacheable client chunk for the Toshi SVG to avoid
// embedding the SVG code into multiple route/page bundles.
const ToshiIcon = dynamic(() => import('@/shared/assets/loading/Toshi'), { ssr: false });

export default ToshiIcon;
