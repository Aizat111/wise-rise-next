import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react';
import { useEffect, useState } from 'react';

import { EnumTokens } from '@/core/types/auth.types';
import tokenStorage from '@/shared/utils/tokenStorage';

export function useFingerprint() {
  const [requestId, setRequestId] = useState('');
  const { error, data, getData } = useVisitorData({ extendedResult: true }, { immediate: false });

  useEffect(() => {
    getData({ ignoreCache: true });
  }, [getData]);

  useEffect(() => {
    if (!data) return;
    if (error) console.error('Fingerprint error', error);

    tokenStorage.setItem(EnumTokens.FINGERPRINT_ID, data.requestId);
    setRequestId(data.requestId);
  }, [data, error]);

  return requestId;
}
