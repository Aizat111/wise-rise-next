import { usePathname } from 'next/navigation';

import { GAME_DESCRIPTIONS } from '@/core/constants/game.constants';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { ModalItem } from '@/core/redux-toolkit/slices/miniGameModalSlice';
import { RootState } from '@/core/redux-toolkit/store';
import CurrencyValue from '@/shared/ui/CurrencyValue';
import Image from '@/shared/ui/Images/Image';

const BalanceComponent = () => {
  const pathname = usePathname();

  const { balance } = useAppSelector((state: RootState) => state.balance);
  const { modals } = useAppSelector((state: RootState) => state.miniGameModal);

  const gameKey = pathname?.split('/').pop() as keyof typeof GAME_DESCRIPTIONS;
  const isGameInDescriptions = !!GAME_DESCRIPTIONS?.[gameKey];

  // Eğer modal sayısı 1'den büyükse
  if (modals.length > 0) {
    if (
      isGameInDescriptions ||
      modals.some(
        (modal: ModalItem) =>
          GAME_DESCRIPTIONS?.[modal.type.toLowerCase().replaceAll(' ', '-') as keyof typeof GAME_DESCRIPTIONS]
      )
    ) {
      return <CurrencyValue value={balance} />;
    }
    // Oyun GAME_DESCRIPTIONS'da yoksa "in play" göster
    return (
      <span className="text-white flex items-center gap-1 no-wrap">
        In Play <Image src="/assets/currencies/dollar.svg" alt="Dollars" width={16} height={16} />
      </span>
    );
  }

  if (!pathname?.includes('/casino/game')) {
    return <CurrencyValue value={balance} />;
  }

  // Modal sayısı 1 veya daha azsa eski mantık
  const isHouseGame = isGameInDescriptions;
  return isHouseGame ? (
    <CurrencyValue value={balance} />
  ) : (
    <span className="text-white flex items-center gap-1 no-wrap">
      In Play <Image src="/assets/currencies/dollar.svg" alt="Dollars" width={16} height={16} />
    </span>
  );
};

export default BalanceComponent;
