import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

const HEAD = 1;
const TAIL = 0;

const Coinflip = ({
  game,
  floatResult,
  modal = false,
  maxCoins,
  maxRounds,
  currentRound,
  coinAmount
}: {
  game: string;
  floatResult: any;
  modal?: boolean;
  maxCoins: number;
  maxRounds: number;
  currentRound: number;
  coinAmount: number;
}) => {
  const t = useTranslations();

  // Byte'tan Rakama hesaplama
  const calculateByteToNumber = (bytes: number[], multiplier: number): any => {
    const calculations = bytes.map((byte, index) => {
      const divisor = Math.pow(256, index + 1);
      const value = byte / divisor;
      return { byte, value, divisor };
    });
    const sum = calculations.reduce((acc, calc) => acc + calc.value, 0);
    const multiplied = sum * multiplier;
    const numberResult = Math.floor(multiplied);

    return {
      calculations,
      sum,
      multiplied,
      numberResult
    };
  };

  const coinResults = useMemo(() => {
    if (!floatResult) return null;

    const coinflipResults: number[][] = [];
    for (let i = 0; i < maxRounds; i++) {
      const round: number[] = [];
      for (let j = 0; j < maxCoins; j++) {
        const floatIndex = i * maxCoins + j;
        if (floatIndex < floatResult.floats.length) {
          const coin = floatResult.floats[floatIndex] >= 0.5 ? HEAD : TAIL;
          round.push(coin);
        } else {
          round.push(TAIL); // fallback to TAIL
        }
      }
      coinflipResults.push(round);
    }

    // console.log(coinflipResults);

    return coinflipResults;
  }, [floatResult, maxRounds, maxCoins]);

  // Byte'tan Rakama hesaplamaları
  const byteToNumberResults = floatResult?.calculations.flatMap((step: any) =>
    step.floats.map((f: any) => {
      const multiplier = 52; // Blackjack için sabit multiplier
      return {
        bytes: f.byteGroup,
        ...calculateByteToNumber(f.byteGroup, multiplier)
      };
    })
  );

  // Coin rendering component
  const CoinDisplay = ({ result, index }: { result: number; index: number }) => (
    <div
      key={index}
      className={`w-15 h-15 rounded-full flex items-center justify-center shadow-lg border-2 m-1 ${
        result === HEAD
          ? 'bg-amber-600 border-amber-700' // Bronze for HEAD (1)
          : 'bg-gray-300 border-gray-400' // Silver for TAIL (0)
      }`}
    >
      <div className={`font-black text-sm uppercase ${result === HEAD ? 'text-white' : 'text-gray-800'}`}>
        {result === HEAD ? 'Tails' : 'Heads'} {/* Reversed text to match correct output */}
      </div>
    </div>
  );

  if (modal) {
    return (
      <div className="flex flex-row gap-2 mt-2 items-center justify-center flex-wrap max-w-xs">
        {coinResults &&
          coinResults[currentRound - 1] &&
          coinResults[currentRound - 1]
            .slice(0, coinAmount)
            .map((result: any, index: number) => <CoinDisplay key={index} result={result} index={index} />)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {floatResult && (
        <>
          {/* Nihai Sonuç */}
          <div className="flex mb-2">
            <div className="text-base font-normal leading-6 text-white">
              {t('provably-fair.calculation.finalResult', { defaultValue: 'Nihai Sonuç' })}
            </div>
          </div>
          <div className="text-white">
            <div className="flex flex-wrap gap-2 max-w-xs">
              {coinResults &&
                coinResults[currentRound - 1] &&
                coinResults[currentRound - 1]
                  .slice(0, coinAmount)
                  .map((result: any, index: number) => <CoinDisplay key={index} result={result} index={index} />)}
            </div>
          </div>

          {/* Casino Tohumundan Byte'lara */}
          <div className="flex mb-2">
            <div className="text-base font-normal leading-6 text-white">
              {t('provably-fair.calculation.seedToBytes', { defaultValue: "Casino Tohumundan Byte'lara" })}
            </div>
          </div>
          <div className="text-white">
            {floatResult.calculations.map((step: any, index: number) => (
              <div key={index} className="mb-4">
                <div>
                  HMAC_SHA256({floatResult.calculations[0].message.split(':')[0]},{step.message})
                </div>
                <div>Hex: {step.hex.match(/.{1,2}/g).join(' ')}</div>
                <div>Bytes: [{step.bytes.join(', ')}]</div>
              </div>
            ))}
          </div>

          {/* Byte'tan Rakama */}
          <div className="flex mb-2">
            <div className="text-base font-normal leading-6 text-white">
              {t('provably-fair.calculation.byteToNumber', { defaultValue: "Byte'tan Rakama" })}
            </div>
          </div>
          <div className="text-white">
            {byteToNumberResults.map((result: any, index: number) => (
              <div key={index} className="mb-4">
                <div>
                  ({result.bytes.join(', ')}) {'->'} [0, ..., 51] = {result.numberResult}
                </div>
                {result.calculations.map((calc: any, calcIndex: number) => (
                  <div key={calcIndex}>
                    + {calc.value.toFixed(12)} ({calc.byte} / (256 ^ {calcIndex + 1}))
                  </div>
                ))}
                <div>= {result.sum.toFixed(12)}</div>
                <div>= {result.multiplied.toFixed(12)} (* 52)</div>
              </div>
            ))}
          </div>

          {/* Random Floats */}
          <div className="flex mb-2">
            <div className="text-base font-normal leading-6 text-white">
              {t('provably-fair.calculation.randomFloats', { defaultValue: 'Random Floats' })}
            </div>
          </div>
          <div className="text-white">
            <div>Game Type: {game}</div>
            <div>Generated Floats: [{floatResult.floats.map((f: number) => f.toFixed(6)).join(', ')}]</div>
            <div>Cursor Max: {floatResult.cursorMax}</div>
            <div className="mt-2">Calculation Steps:</div>
            {floatResult.calculations.map((step: any, index: number) => (
              <div key={index} className="ml-4 mt-2">
                <div>
                  Step {index + 1} (Cursor: {index * 8}, {step.message})
                </div>
                <div>Hex: {step.hex.match(/.{1,2}/g).join(' ')}</div>
                <div>Bytes: [{step.bytes.join(', ')}]</div>
                <div>Floats:</div>
                {step.floats.map((f: any, i: number) => (
                  <div key={i} className="ml-4">
                    Float {floatResult.floats.indexOf(f.floatValue) + 1}: {f.floatValue.toFixed(6)} (Bytes: [
                    {f.byteGroup.join(', ')}])
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Coinflip;
