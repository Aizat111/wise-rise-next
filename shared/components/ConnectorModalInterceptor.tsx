'use client';

import { useConnectorModalInterceptor } from '@/shared/hooks/useConnectorModalInterceptor';

/**
 * Component that intercepts third-party connector modals
 * and displays them in a custom styled modal
 */
export const ConnectorModalInterceptor = () => {
  useConnectorModalInterceptor();
  return null;
};
