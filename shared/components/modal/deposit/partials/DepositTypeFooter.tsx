import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';

import { useAppDispatch } from '@/core/redux-toolkit/hooks';
import { openModal } from '@/core/redux-toolkit/slices/modalSlice';
import type { CurrencyDep } from '@/core/types/deposit.types';
import Card from '@/shared/components/card/Card';
import Image from '@/shared/ui/Images/Image';

type DepositTypeFooterProps = {
  selectedCurrency: CurrencyDep;
};

const cryptoIcons = [
  { symbol: '/assets/svgs/visa.svg', name: 'Visa', title: 'Visa' },
  { symbol: '/assets/svgs/mastercard.svg', name: 'Mastercard', title: 'Mastercard' },
  { symbol: '/assets/svgs/applepay.svg', name: 'Apple Pay', title: 'Apple Pay' },
  { symbol: '/assets/svgs/gpay.svg', name: 'Google Pay', title: 'Google Pay' }
];

const DepositTypeFooter = ({ selectedCurrency }: DepositTypeFooterProps) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  return (
    <Card className="border-none rounded-md px-3 pt-2 pb-3 ">
      <div className="flex justify-between items-center flex-col lg:flex-row gap-2">
        <div className="flex flex-row gap-2 items-center md:flex-col py-1 md:-mt-1 justify-center md:items-start">
          <h4 className="text-sm font-semibold text-white70 ">
            {t('dont_have_coin', { coin: selectedCurrency?.name || '' })}
          </h4>
          <Button
            className="text-sm !px-0 !h-auto"
            intent="primary"
            appearance="link"
            borderRadius="md"
            onClick={() =>
              dispatch(openModal({ modalName: 'depositCurrency', type: 'buycrypto', props: { currency: 'SOL' } }))
            }
          >
            {t('buy_crypto')}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {cryptoIcons.map((crypto, index) => (
            <div
              key={`${crypto.title}-${index}`}
              className="w-[58px] h-[40px] flex items-center justify-center bg-bg_menu rounded-md"
            >
              <Image src={crypto.symbol} alt={crypto.title} width={40} height={13} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default DepositTypeFooter;
