'use client';

import { type FC } from 'react';

import Image from '@/shared/ui/Images/Image';

type DepositeTypeProps = {};

const LoginOptions: FC<DepositeTypeProps> = () => {
  const handleTelegramLogin = () => {
    const botId = process.env.NEXT_PUBLIC_ENVIRONMENT == 'PROD' ? '7883388070' : '7009671318';
    const origin =
      process.env.NEXT_PUBLIC_ENVIRONMENT == 'PROD' ? 'https://toshi.bet' : 'https://frontend.polearmesto.com';
    const url = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${origin}`;

    // window.open(url, '_self');
    const popup = window.open(url, 'telegramLogin', 'width=600,height=700');

    window.addEventListener('message', event => {
      if (event.origin !== 'https://oauth.telegram.org') return;
      const userString = event.data;
      const userObj = typeof userString === 'string' ? JSON.parse(userString) : userString;
      // eslint-disable-next-line no-undef
      const base64Payload = btoa(JSON.stringify(userObj?.result)); // base64 encode
      window.location.href = `https://user.${process.env.NEXT_PUBLIC_ENVIRONMENT == 'PROD' ? 'toshi.bet' : 'polearmesto.com'}/login/telegramCallback?telegram=${encodeURIComponent(base64Payload)}`;
      popup?.close();
    });
  };
  return (
    <div className="flex flex-row gap-4 justify-center p-0">
      <div className="items-center justify-center p-2 pb-3 border border-white10 rounded-lg relative flex flex-row gap-2.5 w-full">
        <Image
          className="w-[22px] h-[22px] rounded-xl relative mix-blend-lighten cursor-pointer"
          src="/assets/svgs/telegram-icon.svg"
          alt="Weekly Crypto Raffle No KYC Casino"
          height={22}
          width={22}
          onClick={handleTelegramLogin}
        />
        <p className="text-base text-white">Telegram</p>
      </div>
      {/* <Image
        className="w-[22px] h-[22px] rounded-xl relative mix-blend-lighten"
        src="https://static.toshi.bet/banners/raffle-1749507185425.png?w=600&fit=min&auto=format"
        alt="Weekly Crypto Raffle No KYC Casino"
        height={22}
        width={22}
      />
      <Image
        className="w-[22px] h-[22px] rounded-xl relative mix-blend-lighten"
        src="https://static.toshi.bet/banners/raffle-1749507185425.png?w=600&fit=min&auto=format"
        alt="Weekly Crypto Raffle No KYC Casino"
        height={22}
        width={22}
      />
      <Image
        className="w-[22px] h-[22px] rounded-xl relative mix-blend-lighten"
        src="https://static.toshi.bet/banners/raffle-1749507185425.png?w=600&fit=min&auto=format"
        alt="Weekly Crypto Raffle No KYC Casino"
        height={22}
        width={22}
      />
      <Image
        className="w-[22px] h-[22px] rounded-xl relative mix-blend-lighten"
        src="https://static.toshi.bet/banners/raffle-1749507185425.png?w=600&fit=min&auto=format"
        alt="Weekly Crypto Raffle No KYC Casino"
        height={22}
        width={22}
      />
      <Image
        className="w-[22px] h-[22px] rounded-xl relative mix-blend-lighten"
        src="https://static.toshi.bet/banners/raffle-1749507185425.png?w=600&fit=min&auto=format"
        alt="Weekly Crypto Raffle No KYC Casino"
        height={22}
        width={22}
      />
      <Image
        className="w-[22px] h-[22px] rounded-xl relative mix-blend-lighten"
        src="https://static.toshi.bet/banners/raffle-1749507185425.png?w=600&fit=min&auto=format"
        alt="Weekly Crypto Raffle No KYC Casino"
        height={22}
        width={22}
      /> */}
    </div>
  );
};

export default LoginOptions;
