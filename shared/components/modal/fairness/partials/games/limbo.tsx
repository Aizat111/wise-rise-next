'use client';

import { useTranslations } from 'next-intl';

type HashItem = {
  hex: string;
  bytes: number[];
};

type Extraction = {
  cursor: number;
  hashIndex: number;
  offset: number;
  integer: number;
};

type LimboRandomization = {
  limit: number;
  extractions: Extraction[];
  randomNumber: number;
  gameEvent: {
    randomNumber: number;
    floatPoint: number; // 2.36199...
    crashPoint: number; // 2.36
    result: number; // 2.36
  };
};

type LimboProvablyFairResult = {
  hashes: HashItem[];
  randomizations: LimboRandomization[];
};

export default function Limbo({ hmacResult, modal = false }: { hmacResult: LimboProvablyFairResult; modal?: boolean }) {
  const t = useTranslations();

  const randomization = hmacResult.randomizations[hmacResult.randomizations.length - 1];

  const roll = randomization.gameEvent.result; // CRASH RESULT
  const floatPoint = randomization.gameEvent.floatPoint; // Raw float
  const crashPoint = randomization.gameEvent.crashPoint; // Rounded 2.36
  const hash = hmacResult.hashes[0];

  // MODAL (Sadece sonuç)
  if (modal) {
    return <div className="font-black text-white text-lg">{crashPoint.toFixed(2)}</div>;
  }

  return (
    <div className="flex flex-col gap-4 text-white">
      {/* Result */}
      <div>Result: {crashPoint.toFixed(2)}</div>

      {/* Hash */}
      <div>
        <div className="flex">
          <div className="text-base font-normal leading-6">
            {t('provably-fair.calculation.serverHash', {
              defaultValue: 'Server Hash'
            })}
          </div>
        </div>
        <div className="mt-1">
          <div>Hex: {hash.hex.match(/.{1,2}/g)?.join(' ')}</div>
          <div>Bytes: [{hash.bytes.join(', ')}]</div>
        </div>
      </div>

      {/* Randomization Calculations */}
      <div className="flex mb-2">
        <div className="text-base font-normal leading-6">
          {t('provably-fair.calculation.byteToNumber', {
            defaultValue: 'Integer to Number'
          })}
        </div>
      </div>

      <div>
        <div>
          Integer: {randomization.randomNumber} {'→'} Range: [0, {randomization.limit - 1}]
        </div>

        {randomization.extractions.map((ex, i) => (
          <div key={i}>
            integer[{i}] = {ex.integer} (cursor={ex.cursor}, offset={ex.offset})
          </div>
        ))}

        {/* Float result */}
        <div className="mt-3">Float: {floatPoint}</div>

        {/* Final crash point */}
        <div className="mt-1">Crash Point (rounded): {crashPoint}</div>

        <div className="mt-1 font-bold">Final Result: {roll.toFixed(2)}</div>
      </div>
    </div>
  );
}
