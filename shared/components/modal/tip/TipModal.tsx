'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { type FC, useEffect, useState } from 'react';

import { Modal } from '../Modal';

import { notify } from '@/core/lib/notify';
import { EnumTokens } from '@/core/types/auth.types';
import Image from '@/shared/ui/Images/Image';
import Input from '@/shared/ui/inputs/Input';
import tokenStorage from '@/shared/utils/tokenStorage';

export interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  props: Record<string, unknown>;
}
const TipModal: FC<TipModalProps> = ({ isOpen, onClose, props }) => {
  const t = useTranslations();
  const [amount, setAmount] = useState<number>(0);
  const [sending, setSending] = useState(false);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);

  const getGraphqlBase = () => {
    const raw = process.env.NEXT_PUBLIC_TOSHIGRAPH_URL || '';
    return raw.replace(/\/@$/, '').replace(/\/$/, '');
  };
  const GRAPHQL_HTTP = `${getGraphqlBase()}/@`;

  const DEFAULT_ROOM_QUERY = `
    query {
      defaultChatRoom {
        id
      }
    }
  `;

  const TIP_MUTATION = `
    mutation SendTip($chat_room_id: ID!, $to_user_id: ID!, $amount: Float!) {
      sendTipChatMessage(input: {
        chat_room_id: $chat_room_id,
        to_user_id: $to_user_id,
        amount: $amount
      }) {
        id
      }
    }
  `;

  const fetchGraphQL = async (query: string, variables?: Record<string, any>) => {
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

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    fetchGraphQL(DEFAULT_ROOM_QUERY)
      .then((data: any) => {
        if (!active) return;
        setChatRoomId(data?.defaultChatRoom?.id || null);
      })
      .catch(() => {
        if (!active) return;
        setChatRoomId(null);
      });
    return () => {
      active = false;
    };
  }, [isOpen]);

  const handleTip = async () => {
    if (amount <= 0) {
      notify('error', 'errors.invalid_amount', 'errors.invalid_amount_description');
      return;
    }
    if (!chatRoomId) {
      notify('error', 'errors.error', 'Chat room not found');
      return;
    }
    setSending(true);
    try {
      await fetchGraphQL(TIP_MUTATION, {
        chat_room_id: chatRoomId,
        to_user_id: props.userId as string,
        amount: Number(amount)
      });
      onClose();
    } finally {
      setSending(false);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      variant="default"
      header={t('tip_modal.title', { username: (props.username as string) || '' })}
      headerClassName="uppercase font-byrd text-base font-semibold"
      modalClassName="bg-toshi_body flex flex-col  justify-between"
      contentClassName="h-auto no-scrollbar "
    >
      <div className="flex flex-col h-full w-auto gap-1 mb-2">
        <div className="flex flex-col justify-start  rounded-xl  items-start gap-4">
          <Input
            label={t('tip_modal.amount')}
            placeholder="0.00"
            size="lg"
            background="dark"
            leftIcon={<Image src="/assets/currencies/dollar.svg" alt="dollar" width={20} height={20} />}
            value={amount.toString()}
            onChange={e => setAmount(parseFloat((e.target.value || '0').replace(',', '.')) || 0)}
          />
          <Button
            intent="primary"
            appearance="glossy"
            borderRadius="md"
            className="w-full mt-1"
            onClick={handleTip}
            isLoading={sending}
          >
            {t('tip_modal.send')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default TipModal;
