'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Modal, ModalContent } from '../Modal';

import { cn } from '@/core/lib/utils';

const PL_DRAW_CARD_COSTS: [number, number][] = [
  [1, 50],
  [2, 100],
  [3, 150],
  [4, 200],
  [5, 250],
  [6, 300],
  [7, 350],
  [8, 400],
  [9, 450],
  [10, 500],
  [11, 1000],
  [12, 2000],
  [13, 4000],
  [14, 8000],
  [15, 16000]
];

const FINAL_PL_DRAW_CARD_COST = 20000;

const WC_DRAW_CARD_COSTS: [number, number][] = [
  [1, 50],
  [2, 100],
  [3, 200],
  [4, 300],
  [5, 500],
  [6, 1000],
  [7, 1800],
  [8, 2500],
  [9, 3500],
  [10, 5000]
];

const LIFELINE_COSTS: [string, number | null][] = [
  ['rules_lifeline_row_2', 300],
  ['Round 3', 600],
  ['Round 4', 900],
  ['Round 5', 1500],
  ['Round 6', 2400],
  ['Round 7', 3600],
  ['Round 8', 5400],
  ['Round 9', 7500],
  ['Round 10', 10500],
  ['Round 11', 15000],
  ['Round 12', 21000],
  ['Round 13', 25500],
  ['Round 14', 30000],
  ['rules_lifeline_row_15_16', null]
];

interface LmsRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  props?: {
    scrollToDrawCard?: boolean;
  };
}

const RulesTable = ({
  roundHeader,
  costHeader,
  rows,
  finalRow
}: {
  roundHeader: string;
  costHeader: string;
  rows: [number, number][];
  finalRow?: { round: string; cost: number };
}) => (
  <div className="overflow-x-auto mb-3">
    <table className="w-full text-sm text-toshi_text_secondary border border-white/10 rounded-lg">
      <thead>
        <tr className="bg-white/5">
          <th className="text-left font-semibold text-toshi_text_primary px-3 py-2 border-b border-white/10">
            {roundHeader}
          </th>
          <th className="text-left font-semibold text-toshi_text_primary px-3 py-2 border-b border-white/10">
            {costHeader}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([round, points]) => (
          <tr key={round} className="border-t border-white/10">
            <td className="px-3 py-2">Round {round}</td>
            <td className="px-3 py-2">{points.toLocaleString()}</td>
          </tr>
        ))}
        {finalRow && (
          <tr className="border-t border-white/10">
            <td className="px-3 py-2">{finalRow.round}</td>
            <td className="px-3 py-2">{finalRow.cost.toLocaleString()}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const LmsRulesModal = ({ isOpen, onClose, props }: LmsRulesModalProps) => {
  const t = useTranslations('last_man_standing');

  useEffect(() => {
    if (!isOpen || !props?.scrollToDrawCard) return;
    const timer = window.setTimeout(() => {
      document.getElementById('lms-rules-draw-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [isOpen, props?.scrollToDrawCard]);

  const p = 'text-white70 mb-3 text-[15px] leading-6 ';
  const h3 = 'text-toshi_text_primary pt-2 font-semibold mt-0 mb-3 text-[25px]';
  const h4 = 'text-white90 font-medium mt-6 mb-2 text-[18px]';
  const h5 = 'text-white90 font-medium mt-4 mb-2 text-[16px]';
  const ul = 'text-white70 list-disc pl-6 space-y-2 mb-3 text-[15px]';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      size="full"
      variant="default"
      closeButtonSize="md"
      header={t('rules_modal_title')}
      headerClassName="text-left text-[17px] tracking-[0.08em]"
      mainClassName="!p-0"
      modalClassName="bg-toshi_body h-[85vh] w-full max-w-[450px] max-md:max-w-full"
    >
      <ModalContent className="p-0 overflow-y-scroll w-full h-[75vh] pb-10 pt-0">
        <div className="pb-10 max-w-none">
          <p className={cn(p, 'pt-0')}>{t('rules_summary_p1')}</p>
          <p className={cn(p, 'font-semibold italic')}>{t('rules_summary_tagline')}</p>
          <p className={p}>{t('rules_summary_p2')}</p>

          <h3 className={h3}>{t('rules_heading_core')}</h3>
          <p className={p}>{t('rules_core_p1')}</p>
          <p className={p}>{t('rules_core_intro')}</p>
          <ul className={ul}>
            <li>{t('rules_core_b1')}</li>
            <li>{t('rules_core_b2')}</li>
            <li>{t('rules_core_b3')}</li>
            <li>{t('rules_core_b4')}</li>
            <li>{t('rules_core_b5')}</li>
          </ul>

          <h4 className={h4}>{t('rules_heading_eligibility')}</h4>
          <p className={p}>{t('rules_eligibility_p1')}</p>
          <ul className={ul}>
            <li>{t('rules_eligibility_b1')}</li>
            <li>{t('rules_eligibility_b2')}</li>
          </ul>

          <h4 className={h4}>{t('rules_heading_tournament_entry')}</h4>
          <p className={p}>{t('rules_entry_p1')}</p>
          <ul className={ul}>
            <li>{t('rules_entry_b1')}</li>
            <li>{t('rules_entry_b2')}</li>
            <li>{t('rules_entry_b3')}</li>
          </ul>
          <p className={p}>{t('rules_entry_p2')}</p>

          <h4 className={h4}>{t('rules_heading_rounds')}</h4>
          <p className={p}>{t('rules_rounds_p1')}</p>
          <h5 className={h5}>{t('rules_rounds_pl_title')}</h5>
          <ul className={ul}>
            <li>{t('rules_rounds_pl_b1')}</li>
            <li>{t('rules_rounds_pl_b2')}</li>
          </ul>
          <h5 className={h5}>{t('rules_rounds_wc_title')}</h5>
          <ul className={ul}>
            <li>{t('rules_rounds_wc_b1')}</li>
            <li>{t('rules_rounds_wc_b2')}</li>
          </ul>
          <h5 className={h5}>{t('rules_rounds_wc_phases_title')}</h5>
          <p className={p}>{t('rules_rounds_wc_phases_p1')}</p>
          <ul className={ul}>
            <li>{t('rules_rounds_wc_phase1')}</li>
            <li>{t('rules_rounds_wc_phase2')}</li>
            <li>{t('rules_rounds_wc_phase3')}</li>
          </ul>

          <h4 id="lms-rules-team-selection" className={h4}>
            {t('rules_heading_team_selection')}
          </h4>
          <p className={p}>{t('rules_team_p1')}</p>
          <ul className={ul}>
            <li>{t('rules_team_pl')}</li>
            <li>{t('rules_team_wc')}</li>
          </ul>
          <p className={p}>{t('rules_team_p2')}</p>

          <h4 className={h4}>{t('rules_heading_results')}</h4>
          <p className={p}>{t('rules_results_p1')}</p>
          <p className={p}>{t('rules_results_p2')}</p>
          <ul className={ul}>
            <li>{t('rules_results_pl')}</li>
            <li>{t('rules_results_wc')}</li>
          </ul>

          <h4 id="lms-rules-draw-card" className={h4}>
            {t('rules_heading_draw_card')}
          </h4>
          <p className={p}>{t('rules_draw_p1')}</p>
          <p className={p}>{t('rules_draw_p2')}</p>

          <h5 className={h5}>{t('rules_draw_pl_cost_title')}</h5>
          <p className={p}>{t('rules_draw_pl_cost_intro')}</p>
          <RulesTable
            roundHeader={t('rules_draw_cost_col_round')}
            costHeader={t('rules_draw_cost_col_lms_points')}
            rows={PL_DRAW_CARD_COSTS}
            finalRow={{ round: t('rules_draw_cost_row_16_plus'), cost: FINAL_PL_DRAW_CARD_COST }}
          />

          <h5 className={h5}>{t('rules_draw_wc_cost_title')}</h5>
          <p className={p}>{t('rules_draw_wc_cost_intro')}</p>
          <RulesTable
            roundHeader={t('rules_draw_cost_col_round')}
            costHeader={t('rules_draw_cost_col_wc_points')}
            rows={WC_DRAW_CARD_COSTS}
          />

          <h4 id="lms-rules-lifeline" className={h4}>
            {t('rules_heading_lifeline')}
          </h4>
          <p className={p}>{t('rules_lifeline_p1')}</p>
          <p className={p}>{t('rules_lifeline_p2')}</p>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-sm text-toshi_text_secondary border border-white/10 rounded-lg">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left font-semibold text-toshi_text_primary px-3 py-2 border-b border-white/10">
                    {t('rules_lifeline_col_reenter')}
                  </th>
                  <th className="text-left font-semibold text-toshi_text_primary px-3 py-2 border-b border-white/10">
                    {t('rules_lifeline_col_cost')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {LIFELINE_COSTS.map(([label, cost]) => (
                  <tr key={label} className="border-t border-white/10">
                    <td className="px-3 py-2">
                      {label.startsWith('rules_') ? t(label as 'rules_lifeline_row_2') : label}
                    </td>
                    <td className="px-3 py-2">
                      {cost == null ? t('rules_lifeline_no_buyback') : cost.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className={h4}>{t('rules_heading_points')}</h4>
          <p className={p}>{t('rules_points_p1')}</p>
          <p className={p}>{t('rules_points_p2')}</p>
          <ul className={ul}>
            <li>{t('rules_points_pl')}</li>
            <li>{t('rules_points_wc')}</li>
          </ul>

          <h4 className={h4}>{t('rules_heading_postponed')}</h4>
          <p className={p}>{t('rules_postponed_p1')}</p>
          <ul className={ul}>
            <li>{t('rules_postponed_p2')}</li>
            <li>{t('rules_postponed_p3')}</li>
            <li>{t('rules_postponed_p4')}</li>
          </ul>

          <h4 className={h4}>{t('rules_heading_visibility')}</h4>
          <p className={p}>{t('rules_visibility_p1')}</p>

          <h4 className={h4}>{t('rules_heading_end_tournament')}</h4>
          <p className={p}>{t('rules_end_p1')}</p>
          <p className={p}>{t('rules_end_intro')}</p>
          <ul className={ul}>
            <li>{t('rules_end_b1')}</li>
            <li>{t('rules_end_b2')}</li>
            <li>{t('rules_end_b3')}</li>
          </ul>

          <h4 className={h4}>{t('rules_heading_fair_play')}</h4>
          <p className={p}>{t('rules_fair_p1')}</p>
          <p className={p}>{t('rules_fair_p2')}</p>
          <p className={p}>{t('rules_fair_p3')}</p>
          <p className={p}>{t('rules_fair_p4')}</p>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default LmsRulesModal;
