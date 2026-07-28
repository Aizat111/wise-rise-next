'use client';

import Script from 'next/script';
import { useCallback, useEffect } from 'react';

import { PAGE } from '../../../../core/config/public-page.config';

import Currencies from './partials/Currencies';
import FooterItem from './partials/FooterItem';
import { aboutUs, communities, currencies, games, toshiDojo } from '@/data/footers';
import { Provablyfair, Responsiblegaming } from '@/shared/assets/footer';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import Image from '@/shared/ui/Images/Image';

export const Footer = () => {
  const { width } = useWindowSize();

  const applySealA11y = useCallback(() => {
    const container = document.getElementById('anj-9386ede8-b6dd-459c-9ac3-e3eb6e0d147d');
    if (!container) return;

    const sealLink = container.querySelector('a');
    if (sealLink) {
      sealLink.setAttribute('aria-label', 'Validate Toshi Bet gaming license');
      sealLink.setAttribute('title', 'Validate Toshi Bet gaming license');
    }

    const sealImage = container.querySelector('img');
    if (sealImage) {
      if (!sealImage.getAttribute('alt')) {
        sealImage.setAttribute('alt', 'Anjouan Gaming Board license validation seal');
      }

      // Reserve image space before load to prevent CLS from injected seal markup.
      sealImage.setAttribute('width', '32');
      sealImage.setAttribute('height', '32');
      sealImage.style.width = '32px';
      sealImage.style.height = '32px';
      sealImage.style.maxWidth = '32px';
      sealImage.style.maxHeight = '32px';
      sealImage.style.objectFit = 'contain';
    }
  }, []);

  const initSeal = useCallback(() => {
    if (typeof window !== 'undefined' && window.anj_9386ede8_b6dd_459c_9ac3_e3eb6e0d147d) {
      window.anj_9386ede8_b6dd_459c_9ac3_e3eb6e0d147d.init();

      // Force toshibet.com domain if we are on a development/staging domain
      const container = document.getElementById('anj-9386ede8-b6dd-459c-9ac3-e3eb6e0d147d');
      const currentHost = window.location.host;
      const targetHost = 'toshibet.com';

      if (container && currentHost !== targetHost) {
        // The script generates URLs using window.location.host.
        // We replace those occurrences to point to the licensed domain.
        const originalHtml = container.innerHTML;
        const fixedHtml = originalHtml.split(currentHost).join(targetHost);

        if (originalHtml !== fixedHtml) {
          container.innerHTML = fixedHtml;
        }
      }

      applySealA11y();
    }
  }, [applySealA11y]);

  useEffect(() => {
    initSeal();
  }, [initSeal]);

  return (
    <footer className="text-white m-[3vw] @[768px]:m-0 @[768px]:rounded-none rounded-2xl bg-toshi_body @[768px]:pt-12 pt-10 pb-5 @[768px]:px-[3vw] px-0 mb-[6rem] @[768px]:mb-0">
      <Script
        src="https://9386ede8-b6dd-459c-9ac3-e3eb6e0d147d.snippet.anjcdn.org/anj-seal.js"
        strategy="afterInteractive"
        onLoad={initSeal}
      />
      <div className="max-w-[1200px] mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 @[768px]:grid-cols-2 @[768px]:grid-cols-6 gap-10 mb-8">
          {/* Logo Section */}
          <div className="flex @[768px]:justify-start justify-center col-span-1">
            <Image
              src={'/assets/svgs/footer-logo.svg'}
              alt="Toshi Bet Logo"
              className="object-contain max-w-full max-h-full w-[109px] h-[108px] hover-roulette-spin"
              width={109}
              height={108}
            />
          </div>
          <div className=" @[768px]:col-span-5 grid grid-cols-1 @[768px]:grid-cols-5 @[768px]:gap-8 gap-0 mb-8">
            {/* Games */}
            <FooterItem title="games" links={games} isTranslated={false} width={width} />

            {/* Toshi's Dojo */}
            <FooterItem title="toshi_dojo" links={toshiDojo} isTranslated={false} width={width} />

            {/* Useful Links */}
            {/* <FooterItem title="useful_links" links={usefulLinks} width={width} /> */}

            {/* About Us */}
            <FooterItem title="about_us" links={aboutUs} width={width} />

            {/* Communities */}
            <FooterItem title="communities" links={communities} isTranslated={false} width={width} />

            {/* Currencies */}
            <FooterItem
              title="currencies"
              links={currencies}
              isTranslated={false}
              width={width}
              mobileContent={<Currencies showTitle={false} />}
            />
          </div>
        </div>

        {/* Accepted Currencies Section */}
        <div className="text-center pt-0 gap-6 justify-center items-center w-full px-4 flex flex-col mt-8">
          <div className="@[768px]:block hidden w-full">
            <Currencies />
          </div>

          <hr className="w-full pt-4 justify-center border-white10" />
          {/* Copyright */}
          <div className=" md:flex-row flex-col flex w-full gap-4">
            <div className="flex flex-row bg-bg_menu p-4 w-full rounded-lg items-center justify-start gap-4">
              <div
                id="anj-9386ede8-b6dd-459c-9ac3-e3eb6e0d147d"
                data-anj-seal-id="9386ede8-b6dd-459c-9ac3-e3eb6e0d147d"
                data-anj-image-size="32"
                data-anj-image-type="basic-small"
                className="w-8 h-8 min-w-8 min-h-8"
              ></div>
              <p className="text-white text-sm max-w-[500px]">Licensed</p>
            </div>

            <div className="flex flex-row bg-bg_menu p-4 w-full rounded-lg items-center justify-start gap-4">
              <Provablyfair />
              <p className="text-white text-sm max-w-[500px]"> Provably Fair</p>
            </div>

            <a
              href={PAGE.RESPONSIBLE_GAMBLING}
              className="flex flex-row bg-bg_menu p-4 w-full  rounded-lg items-center justify-start gap-4"
            >
              <Responsiblegaming />
              <p className="text-white text-sm max-w-[500px]">Responsible Gaming</p>
            </a>
          </div>

          <p className="text-white50 text-sm max-w-[800px] mb-[1rem] @[768px]:mb-0">
            Toshi Bet, crypto's best casino for real money slots, is a brand of BowToYourSensei LTD. Company Address:
            Suite 305, Griffith Corporate Centre, Kingstown, St Vincent and the Grenadines.
          </p>

          <p className="text-white50 text-sm max-w-[800px] mb-[1rem] @[768px]:mb-0">
            Toshi Bet is committed to responsible gambling, for more information visit{' '}
            <a
              href="https://gamblingtherapy.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white70 hover:underline focus:outline-none focus:underline"
            >
              gamblingtherapy.org
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
