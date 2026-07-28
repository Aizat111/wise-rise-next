import { useTranslations } from 'next-intl';

interface Hash {
  hex: string;
  bytes: number[];
}

interface Extraction {
  cursor: number;
  hashIndex: number;
  offset: number;
  integer: number;
}

interface Randomization {
  limit: number;
  extractions: Extraction[];
  randomNumber: number;
  gameEvent: any;
}

interface FloatResult {
  hashes: Hash[];
  randomizations: Randomization[];
}

const Keno = ({
  game,
  floatResult,
  minesCount = 10,
  modal = false
}: {
  game: string;
  floatResult: FloatResult | null;
  minesCount?: number;
  modal?: boolean;
}) => {
  const t = useTranslations();

  const calculateByteToNumber = (bytes: number[], multiplier: number) => {
    const calculations = bytes.map((byte, index) => {
      const divisor = 256 ** (index + 1);
      return {
        byte,
        value: byte / divisor,
        divisor
      };
    });

    const sum = calculations.reduce((acc, c) => acc + c.value, 0);
    const multiplied = sum * multiplier;
    const numberResult = Math.floor(multiplied);

    return { calculations, sum, multiplied, numberResult };
  };

  const calculateKenoNumbers = (rngList: number[], minesCount: number) => {
    const grid = Array.from({ length: 40 }, (_, i) => i);
    const kenoPositions: number[] = [];

    for (let i = 0; i < rngList.length && kenoPositions.length < minesCount; i++) {
      const pos = rngList[i];
      if (grid.includes(pos)) {
        kenoPositions.push(pos);
        grid.splice(grid.indexOf(pos), 1);
      }
    }

    return { numbers: kenoPositions };
  };

  if (!floatResult) return null;

  const extractedRandoms = floatResult.randomizations.map(r => r.randomNumber);

  const { numbers } = calculateKenoNumbers(extractedRandoms, minesCount);

  const byteToNumberResults = floatResult.hashes.flatMap((hash, index) => {
    const multiplier = 40 - index;
    return {
      bytes: hash.bytes,
      ...calculateByteToNumber(hash.bytes, multiplier)
    };
  });

  if (modal) {
    const gridCells = Array.from({ length: 40 }, (_, i) => i);

    return (
      <div className="flex flex-col gap-1 mt-2 items-center">
        <div
          className="grid grid-cols-8 gap-0.5 justify-center"
          style={{ gridTemplateColumns: 'repeat(8, 40px)', gridTemplateRows: 'repeat(5, 40px)' }}
        >
          {gridCells.map(cell => (
            <div
              key={cell}
              className="w-10 h-10 rounded flex items-center justify-center text-white text-sm"
              style={{
                backgroundColor: numbers.includes(cell) ? '#181d2b' : '#2c3550'
              }}
            >
              {cell}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /** NORMAL GÖRÜNÜM */
  return (
    <div className="flex flex-col gap-4 text-white">
      {/* Seed → Bytes */}
      <div className="text-lg font-semibold">{t('provably-fair.calculation.seedToBytes')}</div>
      {floatResult.hashes.map((h, i) => (
        <div key={i} className="mb-4">
          <div>Hex: {h.hex.match(/.{1,2}/g)?.join(' ')}</div>
          <div>Bytes: [{h.bytes.join(', ')}]</div>
        </div>
      ))}

      {/* Byte → Number */}
      <div className="text-lg font-semibold">{t('provably-fair.calculation.byteToNumber')}</div>
      {byteToNumberResults.map((result, i) => (
        <div key={i} className="mb-4">
          <div>
            ({result.bytes.join(', ')}) → [0..{40 - i}] = {result.numberResult}
          </div>

          {result.calculations.map((c, ii) => (
            <div key={ii}>
              + {c.value.toFixed(12)} ({c.byte} / 256^{ii + 1})
            </div>
          ))}

          <div>= {result.sum.toFixed(12)}</div>
          <div>
            = {result.multiplied.toFixed(12)} (* {40 - i})
          </div>
        </div>
      ))}

      <div className="text-lg font-semibold">{t('provably-fair.calculation.finalResult')}</div>
      <div>Keno Tiles: [{numbers.join(', ')}]</div>

      <div className="text-lg font-semibold mt-4">{t('provably-fair.calculation.randomFloats')}</div>

      <div>Game Type: {game}</div>
      <div>Random Numbers: [{extractedRandoms.join(', ')}]</div>

      {floatResult.randomizations.map((rand, i) => (
        <div key={i} className="mt-2">
          <div>
            Step {i + 1} - Limit {rand.limit}
          </div>
          <div>Random Number: {rand.randomNumber}</div>

          {rand.extractions.map((ex, ii) => (
            <div key={ii} className="ml-4">
              Integer: {ex.integer} | hashIndex: {ex.hashIndex} | offset: {ex.offset}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keno;
