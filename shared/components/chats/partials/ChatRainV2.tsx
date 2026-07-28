import { Button } from '@investorcentretb/toshi-ui';
import { createClient } from 'graphql-ws';
import { useEffect, useState } from 'react';

import { notify } from '@/core/lib/notify';
import { EnumTokens } from '@/core/types/auth.types';
import Input from '@/shared/ui/inputs/Input';
import tokenStorage from '@/shared/utils/tokenStorage';

const getGraphqlBase = () => {
  const raw = process.env.NEXT_PUBLIC_TOSHIGRAPH_URL || '';
  return raw.replace(/\/@$/, '').replace(/\/$/, '');
};
const GRAPHQL_HTTP = `${getGraphqlBase()}/@`;
const GRAPHQL_WS = `${getGraphqlBase()}`.replace(/^http/, 'ws') + '/@';

interface ChatRainJoin {
  rainId: string;
  jackpot: number;
  title: string;
  timer: number;
  level: number;
  allowedClaims: number;
  state: string;
}

const RAIN_JOIN_QUERY = `
  query {
    chatRainJoin {
      rainId
      jackpot
      title
      timer
      level
      allowedClaims
      state
    }
  }
`;

const RAIN_UPDATED_SUB = `
  subscription {
    chatRainUpdated {
      rainId
      jackpot
      title
      timer
      level
      allowedClaims
      state
    }
  }
`;

const RAIN_TIP_MUTATION = `
  mutation TipRain($amount: Float!) {
    chatRainTip(amount: $amount)
  }
`;

const RAIN_CLAIM_MUTATION = `
  mutation ClaimRain($rainId: ID!) {
    chatRainClaim(rainId: $rainId)
  }
`;

const fetchGraphQL = async <T,>(query: string, variables?: Record<string, any>): Promise<T> => {
  const token = tokenStorage?.getItem(EnumTokens.ACCESS_TOKEN);
  const fingerprint = tokenStorage?.getItem(EnumTokens.FINGERPRINT_ID);
  const res = await fetch(GRAPHQL_HTTP, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`,
      'x-request-id': fingerprint || '',
      Accept: 'application/json'
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json?.errors?.length) {
    notify('error', 'errors.error', json.errors[0]?.message || 'errors.errordesc');
    throw new Error(json.errors[0]?.message || 'GraphQL error');
  }
  return json.data;
};

const ChatRainV2 = () => {
  const [rain, setRain] = useState<ChatRainJoin | null>(null);
  const [amount, setAmount] = useState('1');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    fetchGraphQL<{ chatRainJoin: ChatRainJoin }>(RAIN_JOIN_QUERY)
      .then(data => {
        if (!active) return;
        setRain(data.chatRainJoin || null);
      })
      .catch(() => {
        if (!active) return;
        setRain(null);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const token = tokenStorage?.getItem(EnumTokens.ACCESS_TOKEN);
    if (!token) return;
    const client = createClient({
      url: GRAPHQL_WS,
      connectionParams: {
        authorization: `Bearer ${token}`
      }
    });

    const unsub = client.subscribe(
      { query: RAIN_UPDATED_SUB },
      {
        next: data => {
          const nextRain = (data as any)?.data?.chatRainUpdated as ChatRainJoin;
          if (nextRain) setRain(nextRain);
        },
        error: () => undefined,
        complete: () => undefined
      }
    );

    return () => {
      unsub();
      client.dispose();
    };
  }, []);

  const tipRain = async () => {
    if (!amount) return;
    setLoading(true);
    try {
      await fetchGraphQL(RAIN_TIP_MUTATION, { amount: parseFloat(amount) });
    } finally {
      setLoading(false);
    }
  };

  const claimRain = async () => {
    if (!rain?.rainId) return;
    setLoading(true);
    try {
      await fetchGraphQL(RAIN_CLAIM_MUTATION, { rainId: rain.rainId });
    } finally {
      setLoading(false);
    }
  };

  if (!rain) return null;

  return (
    <div className="rounded-md bg-bg_menu p-3 text-xs text-white70">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-white">{rain.title}</span>
        <span className="text-white50">{rain.state}</span>
      </div>
      <div className="mt-1">
        Jackpot: <span className="text-white">${Number(rain.jackpot).toFixed(2)}</span>
      </div>
      <div className="mt-1">
        Claims left: <span className="text-white">{rain.allowedClaims}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Input
          variant="default"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="h-8 text-xs"
          type="number"
          min={0}
        />
        <Button intent="gray" size="xs" isLoading={loading} onClick={tipRain} borderRadius="md">
          Tip
        </Button>
        <Button intent="green" size="xs" isLoading={loading} onClick={claimRain} borderRadius="md">
          Claim
        </Button>
      </div>
    </div>
  );
};

export default ChatRainV2;
