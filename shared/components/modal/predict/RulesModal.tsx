'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { Modal, ModalContent } from '../Modal';

import { PAGE } from '@/core/config/public-page.config';
import { cn } from '@/core/lib/utils';
import { Link } from '@/shared/ui/LoadingLink';

const PREDICT_RULES_LINK_CLASS =
  'text-white underline underline-offset-2 decoration-white/50 transition-colors hover:decoration-white';

const PRIZE_ROWS = [
  ['roundJackpot', 'roundJackpotAmount', 'roundJackpotAwarded'],
  ['roundConsolation', 'roundConsolationAmount', 'roundConsolationAwarded'],
  ['overall1st', 'overall1stAmount', 'overall1stAwarded'],
  ['overall2nd', 'overall2ndAmount', 'overall2ndAwarded'],
  ['overall3rd', 'overall3rdAmount', 'overall3rdAwarded']
] as const;

const ROUNDS_ROWS = [
  ['rounds1to13', 'rounds1to13Stage', 'rounds1to13Fixtures'],
  ['round14', 'round14Stage', 'round14Fixtures'],
  ['round15', 'round15Stage', 'round15Fixtures'],
  ['round16', 'round16Stage', 'round16Fixtures']
] as const;

interface PredictRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PredictRulesModal = ({ isOpen, onClose }: PredictRulesModalProps) => {
  const t = useTranslations('predict.rules');

  const richParts = {
    toshibet: (chunks: ReactNode) => (
      <a href="https://toshi.bet/" className={PREDICT_RULES_LINK_CLASS} target="_blank" rel="noopener noreferrer">
        {chunks}
      </a>
    ),
    worldCupBets: (chunks: ReactNode) => (
      <Link href={PAGE.WORLD_CUP_SPORTSBOOK} className={PREDICT_RULES_LINK_CLASS}>
        {chunks}
      </Link>
    ),
    premierLeagueBets: (chunks: ReactNode) => (
      <Link href={PAGE.PREMIER_LEAGUE} className={PREDICT_RULES_LINK_CLASS}>
        {chunks}
      </Link>
    )
  };

  const p = 'text-white70 mb-3 text-[15px] leading-6';
  const h3 = 'text-toshi_text_primary pt-2 font-semibold mt-0 mb-3 text-[25px]';
  const h4 = 'text-white90 font-medium mt-6 mb-2 text-[18px]';
  const ul = 'text-white70 list-disc pl-6 space-y-2 mb-3 text-[15px]';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      size="xl"
      variant="default"
      closeButtonSize="md"
      header={t('modalTitle')}
      headerClassName="text-left text-[17px] tracking-[0.08em]"
      mainClassName="!p-0"
      modalClassName="bg-toshi_body"
    >
      <ModalContent className="p-0 overflow-y-scroll w-full h-[75vh] pb-10 pt-0">
        <div className="pb-10 max-w-none px-4">
          <p className={cn(p, 'pt-0')}>{t.rich('summaryP1', richParts)}</p>
          <p className={cn(p, 'font-semibold italic')}>{t('summaryTagline')}</p>
          <p className={p}>{t.rich('summaryP2', richParts)}</p>

          <h3 className={h3}>{t('aboutHeading')}</h3>
          <p className={p}>{t.rich('aboutP1', richParts)}</p>
          <ul className={ul}>
            <li>{t.rich('aboutB1', richParts)}</li>
            <li>{t('aboutB2')}</li>
            <li>{t('aboutB3')}</li>
            <li>{t('aboutB4')}</li>
            <li>{t('aboutB5')}</li>
          </ul>

          <h4 className={h4}>{t('freeEntryHeading')}</h4>
          <p className={p}>{t('freeEntryP1')}</p>
          <ul className={ul}>
            <li>{t('freeEntryB1')}</li>
            <li>{t('freeEntryB2')}</li>
            <li>{t('freeEntryB3')}</li>
          </ul>
          <p className={p}>{t.rich('freeEntryP2', richParts)}</p>

          <h4 className={h4}>{t('prizesHeading')}</h4>
          <p className={p}>{t('prizesP1')}</p>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-sm text-toshi_text_secondary border border-white/10 rounded-lg">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left font-semibold text-toshi_text_primary px-3 py-2 border-b border-white/10">
                    {t('prizesTableColPrize')}
                  </th>
                  <th className="text-left font-semibold text-toshi_text_primary px-3 py-2 border-b border-white/10">
                    {t('prizesTableColAmount')}
                  </th>
                  <th className="text-left font-semibold text-toshi_text_primary px-3 py-2 border-b border-white/10">
                    {t('prizesTableColAwarded')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRIZE_ROWS.map(([prize, amount, awarded]) => (
                  <tr key={prize} className="border-t border-white/10">
                    <td className="px-3 py-2">{t(prize)}</td>
                    <td className="px-3 py-2">{t(amount)}</td>
                    <td className="px-3 py-2">{t(awarded)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={p}>{t('prizesP2')}</p>
          <p className={p}>{t.rich('prizesP3', richParts)}</p>

          <h4 className={h4}>{t('roundsHeading')}</h4>
          <p className={p}>{t.rich('roundsP1', richParts)}</p>
          <ul className={ul}>
            <li>{t('roundsB1')}</li>
            <li>{t('roundsB2')}</li>
            <li>{t('roundsB3')}</li>
          </ul>
          <p className={p}>{t('roundsP2')}</p>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-sm text-toshi_text_secondary border border-white/10 rounded-lg">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left font-semibold text-toshi_text_primary px-3 py-2 border-b border-white/10">
                    {t('roundsTableColRounds')}
                  </th>
                  <th className="text-left font-semibold text-toshi_text_primary px-3 py-2 border-b border-white/10">
                    {t('roundsTableColStage')}
                  </th>
                  <th className="text-left font-semibold text-toshi_text_primary px-3 py-2 border-b border-white/10">
                    {t('roundsTableColFixtures')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROUNDS_ROWS.map(([rounds, stage, fixtures]) => (
                  <tr key={rounds} className="border-t border-white/10">
                    <td className="px-3 py-2">{t(rounds)}</td>
                    <td className="px-3 py-2">{t(stage)}</td>
                    <td className="px-3 py-2">{t(fixtures)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className={h4}>{t('pointsHeading')}</h4>
          <p className={p}>{t('pointsP1')}</p>
          <ul className={ul}>
            <li>{t('pointsB1')}</li>
            <li>{t('pointsB2')}</li>
            <li>{t.rich('pointsB3', richParts)}</li>
          </ul>
          <p className={p}>{t.rich('pointsP2', richParts)}</p>

          <h4 className={h4}>{t('scoringHeading')}</h4>
          <p className={p}>{t('scoringP1')}</p>

          <h4 className={h4}>{t('eligibilityHeading')}</h4>
          <p className={p}>{t('eligibilityP1')}</p>
          <ul className={ul}>
            <li>{t('eligibilityB1')}</li>
            <li>{t('eligibilityB2')}</li>
          </ul>

          <h4 className={h4}>{t('postponedHeading')}</h4>
          <p className={p}>{t('postponedP1')}</p>

          <h4 className={h4}>{t('fairPlayHeading')}</h4>
          <p className={p}>{t.rich('fairPlayP1', richParts)}</p>
          <p className={p}>{t.rich('fairPlayP2', richParts)}</p>
          <p className={p}>{t.rich('fairPlayP3', richParts)}</p>

          <h4 className={h4}>{t('ctaHeading')}</h4>
          <p className={p}>{t.rich('ctaP1', richParts)}</p>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default PredictRulesModal;
