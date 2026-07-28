import { useTranslations } from 'next-intl';

import {
  DRAGONS_TOWER_CONFIG,
  DragonsTowerDifficulty,
  getDragonsTowerRowConfig
} from '@/core/constants/games/dragonsTower.constants';

const Tower = ({
  floatResult,
  roundCount = DRAGONS_TOWER_CONFIG.rows,
  risk = 'hard',
  modal = false
}: {
  hmacResult: any;
  game: string;
  floatResult: any;
  roundCount?: number;
  risk?: DragonsTowerDifficulty;
  modal?: boolean;
}) => {
  const t = useTranslations();

  // Yeni Backend Yapısı: rowEggsBuffer final shuffle edilmiş dizidir.
  const getRows = () => {
    if (!floatResult?.randomizations) return [];

    const rows: number[][] = [];

    for (let i = 0; i < roundCount; i++) {
      const r = floatResult.randomizations.find((x: any) => x.gameEvent?.row === i);

      // Bulamazsa fallback
      rows.push(r?.gameEvent?.rowEggsBuffer ?? [0, 1, 2, 3]);
    }

    return rows;
  };

  const finalRows = getRows();

  // Modal içi sade gösterim
  if (modal) {
    return (
      <div className="flex flex-col gap-1 mt-2 items-center">
        {finalRows
          .slice()
          .reverse()
          .map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-0.5 justify-center"
              style={{ gridTemplateColumns: `repeat(${row.length}, 40px)` }}
            >
              {row.map((tileIndex, idx) => (
                <div
                  key={idx}
                  className="w-10 h-5 rounded"
                  style={{
                    backgroundColor: tileIndex < getDragonsTowerRowConfig(risk).eggs ? '#2c3550' : '#ff861c'
                  }}
                />
              ))}
            </div>
          ))}
      </div>
    );
  }

  // Provably Fair Ekranı
  return (
    <div className="flex flex-col gap-4">
      {floatResult && (
        <>
          {/* HMAC / Bytes Gösterimi */}
          <div className="flex mb-2">
            <div className="text-base font-normal leading-6 text-white">
              {t('provably-fair.calculation.seedToBytes', {
                defaultValue: "Casino Tohumundan Byte'lara"
              })}
            </div>
          </div>

          <div className="text-white">
            {floatResult?.randomizations?.map((step: any, index: number) => (
              <div key={index} className="mb-4">
                <div>HMAC_SHA256({step.message})</div>
                <div>Hex: {step.hex}</div>
                <div>Bytes: [{step.bytes?.join(', ')}]</div>
              </div>
            ))}
          </div>

          {/* Nihai Sonuç */}
          <div className="flex mb-2">
            <div className="text-base font-normal leading-6 text-white">
              {t('provably-fair.calculation.finalResult', {
                defaultValue: 'Nihai Sonuç'
              })}
            </div>
          </div>

          <div className="text-white">
            <div>Her turda backend tarafından gönderilen final karıştırılmış sıra (rowEggsBuffer) gösterilir.</div>
            <div>Değerler: {JSON.stringify(finalRows)}</div>

            {finalRows
              .slice()
              .reverse()
              .map((row, index) => (
                <div key={index}>
                  {roundCount - index} - [{row.join(', ')}]
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Tower;
