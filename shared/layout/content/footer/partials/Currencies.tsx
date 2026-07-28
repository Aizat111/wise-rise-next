import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { cryptoIcons } from '@/data/footers';
import Card from '@/shared/components/card/Card';
import Image from '@/shared/ui/Images/Image';

type CurrenciesProps = {
  showTitle?: boolean;
};

const Currencies = ({ showTitle = true }: CurrenciesProps) => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="mb-8 items-start justify-start w-full">
      {showTitle && <h3 className="text-sm font-bold text-white mb-4 text-left">{t('accepted_currencies')}</h3>}
      <div className="grid mt-3 @[768px]:mt-0 grid-cols-2 @[768px]:grid-cols-4 @[1024px]:grid-cols-8 gap-2">
        {cryptoIcons.map((crypto, index) => (
          <Card
            key={`${crypto.title}-${index}`}
            onClick={() => {
              router.push(`${pathname}?modal=deposit&currency=${crypto.title}`);
            }}
            className="flex cursor-pointer flex-col items-center p-2 py-5 border-none bg-bg_menu"
          >
            <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-3`}>
              <Image src={crypto.symbol} alt={crypto.title} width={50} height={50} />
            </div>
            <div className="flex flex-col items-center justify-center gap-0">
              <span className="text-gray-200 text-xs text-center">{crypto.title}</span>
              <span className="text-grey text-xs text-center">{crypto.description}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Currencies;
