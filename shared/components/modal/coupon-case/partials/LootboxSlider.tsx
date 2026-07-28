'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { debounce } from 'lodash';
import { CopyIcon } from 'lucide-react';
import { FC, useEffect, useRef, useState } from 'react';

import { FreebetInfoModal } from './FreebetInfoModal';
import { useFetcher } from '@/core/api/rest-api';
import { TYPES } from '@/core/api/rest-api/api-config';
import { Case, CaseChance, chances } from '@/core/constants/coupon-chances.constants';
import { notify } from '@/core/lib/notify';

const MINIMUM_WIDTH = 150;
const CASES_ASPECT_RATIO = 1;
const END_POSITION = 60;
const WIDTH_RATIO = 0.2;
const GAP = 5;

interface LootboxSliderProps {
  links: Record<string, string>;
  posiblePrizes: CaseChance[];
  code?: string;
}

export const LootboxSlider: FC<LootboxSliderProps> = ({ links, posiblePrizes, code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const caseRef = useRef(0);

  const [prize, setPrize] = useState<CaseChance | null>(null);
  const [freeBetsAmount, setFreeBets] = useState(0);
  const [showFreebetInfoModal, setShowFreebetInfoModal] = useState(false);

  const [caseWidth, setCaseWidth] = useState(85);
  const [caseOpened, setCaseOpened] = useState(false);
  const [caseState, setCaseState] = useState<Case[]>([]);
  const [playingAnimation, setPlayingAnimation] = useState(false);
  const [finalAnimationPosition, setFinalAnimationPosition] = useState('translate(0,0)');
  const [isProcessing, setIsProcessing] = useState(false);

  const activatePromo = useFetcher(TYPES.USE_PROMO).action();

  const getRandomCase = (): CaseChance => {
    const float = Math.random();
    const riskCases = posiblePrizes ?? chances.easy;

    if (!riskCases || riskCases.length === 0) return chances.easy[0];

    const sortedCases = [...riskCases].sort((a, b) => a.chance - b.chance);
    let accumulated = 0;

    for (const c of sortedCases) {
      accumulated += c.chance;
      if (float < accumulated) return c;
    }
    return sortedCases.at(-1)!;
  };

  const createCasesRoll = () => {
    const roll: Case[] = [];

    for (let i = 0; i < 100; i++) {
      const c = getRandomCase();
      roll.push({
        id: caseRef.current++,
        name: c?.name?.split(' ')[0] || '',
        title: c?.title || '',
        category: c?.category || '',
        value: c?.value || '0'
      });
    }

    setCaseState(roll);
    return roll;
  };

  const spinCases = async (caseName: string, disableAnimation = false) =>
    new Promise(resolve => {
      setPlayingAnimation(false);
      const containerWidth = containerRef.current?.clientWidth || 400;

      const targetIndex = END_POSITION - 2;
      const centerOfTarget = targetIndex * (caseWidth + GAP) + caseWidth / 2;
      const finalPos = containerWidth / 2 - centerOfTarget;

      if (!disableAnimation) {
        setTimeout(() => {
          window.requestAnimationFrame(() => {
            setPlayingAnimation(true);
            setFinalAnimationPosition(`translate(${finalPos}px, 0) translateZ(0)`);
          });
        }, 350);
      }

      setTimeout(() => {
        setPlayingAnimation(false);
        resolve(true);
      }, 2600);
    });

  const handleBet = async () => {
    if (isProcessing || caseOpened) return;
    setIsProcessing(true);

    try {
      if (!code) {
        notify('error', 'errors.error', 'errors.no_coupon_code_provided');
        return;
      }

      const data: any = await activatePromo.mutateAsync([{ useCode: true }, [code]]);
      if (!data?.success || !data.lootboxResult) {
        notify('error', 'errors.error', data?.message || 'errors.failed_to_activate_promo');
        return;
      }

      const result = data.lootboxResult;
      setPrize(result);
      setCaseOpened(true);

      let current = [...caseState];
      if (current.length === 0) {
        current = createCasesRoll();
      }

      current[END_POSITION] = {
        id: 9999,
        name: result.name,
        title: result.title,
        category: result.category,
        value: result.value
      };

      setCaseState(current);
      await new Promise(r => setTimeout(r, 50));
      await spinCases(result.name);

      if (result.property === 'free_spin') {
        setFreeBets(result.nbRounds || 0);
        setTimeout(() => setShowFreebetInfoModal(true), 300);
      }

      notify('success', 'success.you_won', { key: 'success.you_won_description', params: { title: result.title } });
    } catch {
      notify('error', 'errors.error', 'errors.unexpected_error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResize = () => {
    if (!containerRef.current) return;
    const w = Math.max(containerRef.current.clientWidth * WIDTH_RATIO, MINIMUM_WIDTH);
    setCaseWidth(w);
  };

  const throttledResize = debounce(handleResize, 200);

  useEffect(() => {
    window.addEventListener('resize', throttledResize);
    handleResize();
    createCasesRoll();
    return () => window.removeEventListener('resize', throttledResize);
  }, []);

  useEffect(() => {
    if (posiblePrizes) {
      setCaseOpened(false);
      setPrize(null);
      setFinalAnimationPosition('translate(0,0)');
      setPlayingAnimation(false);
      createCasesRoll();
    }
  }, [posiblePrizes]);

  return (
    <div className="flex flex-col items-center justify-between w-full min-h-[300px] z-10">
      <div className="flex flex-col items-center justify-center flex-grow w-full relative min-h-[250px] max-h-[13em] overflow-hidden">
        <div className="w-full h-full flex items-center justify-center relative flex-1 bg-[#181d2b] rounded-2xl overflow-hidden">
          <div
            className="relative flex will-change-transform"
            ref={containerRef}
            style={{
              width: `calc(${caseWidth}px * ${caseState.length} + ${GAP}px)`,
              gap: `${GAP}px`,
              transform: finalAnimationPosition,
              transition: playingAnimation ? 'transform 2500ms cubic-bezier(0.24, 0.78, 0.15, 1)' : 'transform 0s'
            }}
          >
            {caseState.map((c, index) => (
              <div
                key={c.id + '-' + index}
                className="flex justify-center items-center relative bg-[#181d2b] rounded-2xl p-4"
                style={{
                  width: `${caseWidth}px`,
                  minHeight: `${caseWidth * CASES_ASPECT_RATIO}px`
                }}
              >
                <img
                  src={links[c.name] || '/placeholder.svg'}
                  alt={c.title}
                  className="h-[80%] w-auto object-contain"
                />

                {caseOpened && !playingAnimation && index === END_POSITION && prize && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-bg_menu z-20 rounded-2xl"
                    style={{ width: `${caseWidth}px`, minHeight: `${caseWidth * CASES_ASPECT_RATIO}px` }}
                  >
                    <img
                      src={links[prize.name] || '/placeholder.svg'}
                      className="h-[50%] w-auto object-contain mb-2"
                      alt={prize.title}
                    />

                    <div className="flex flex-col w-full px-2 items-center">
                      <span className="w-full font-medium text-xs text-center mb-1 truncate">
                        {prize.title}
                        {prize.property !== 'empty_box' ? ':' : ''}
                      </span>

                      {prize.property !== 'empty_box' && (
                        <div className="flex flex-row w-full justify-center items-center gap-2">
                          <span className="font-bold text-sm whitespace-nowrap">
                            {prize.property === 'coupon'
                              ? (prize as any).code?.split('').join(' ')
                              : prize.property === 'toshi_gold'
                                ? prize.amount?.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  })
                                : prize.amount?.toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  })}
                          </span>

                          {prize.property === 'coupon' && (
                            <Button
                              className="cursor-pointer hover:opacity-80 border-none bg-transparent p-0"
                              iconOnly
                              onClick={() => {
                                navigator.clipboard.writeText((prize as any).code || '');
                                notify('success', 'Success', 'Code copied to clipboard');
                              }}
                              type="button"
                              icon={<CopyIcon />}
                            />
                          )}

                          {prize.property === 'toshi_gold' && (
                            <div className="px-1 bg-[#F7B801] text-black rounded text-[10px] font-bold">
                              <span>TG</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="absolute top-0 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-[#72757c] z-20" />
          <div className="absolute bottom-0 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-[#72757c] z-20" />

          <div className="absolute w-full h-full inset-0 pointer-events-none shadow-[inset_0px_0px_40px_7px_rgba(0,0,0,0.4)] rounded-2xl z-10" />
        </div>
      </div>

      <Button onClick={handleBet} className="mx-auto cursor-pointer z-10">
        {isProcessing ? 'Opening...' : caseOpened ? 'Opened' : 'Unlock This Box'}
      </Button>

      <FreebetInfoModal
        isOpen={showFreebetInfoModal}
        onClose={() => setShowFreebetInfoModal(false)}
        freeSpinsAmount={freeBetsAmount}
        freeSpinsValue={prize?.amount || 0}
      />
    </div>
  );
};
