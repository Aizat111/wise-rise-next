import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { useSelector } from 'react-redux';

import { PAGE } from '@/core/config/public-page.config';
import { RootState } from '@/core/redux-toolkit/store';
import Card from '@/shared/components/card/Card';
import MultiplayGameCard from '@/shared/components/card/MultiplayGameCard';
import { Link } from '@/shared/ui/LoadingLink';
import { getGamelinkName } from '@/shared/utils/gamesUtils';

const MultiplayGames = () => {
  const t = useTranslations();
  const contentRef = useRef<HTMLDivElement>(null);
  const multiplayGames = useSelector((state: RootState) => state.game.multiplayGames);
  if (multiplayGames.length === 0) {
    return null;
  }
  return (
    <Card className="bg-bg_menu gap-0 pt-3 h-fit">
      <h3 className="text-white text-base text-white70 pb-4">{t('selected_games')}</h3>
      <div className="flex flex-col gap-2 w-fit">
        <div className="flex gap-2" ref={contentRef}>
          {multiplayGames.map(game => (
            <MultiplayGameCard key={game.id} id={game.id} title={game.name} image={game.image} />
          ))}
        </div>

        <Link
          href={PAGE.CASINO_GAME(multiplayGames?.map(game => getGamelinkName(game.name)).join('&'))}
          prefetch
          className="w-full"
        >
          <Button intent="primary" appearance="glossy" className="w-full">
            {t('play_all')}
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default MultiplayGames;
