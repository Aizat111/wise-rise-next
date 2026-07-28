// import { useTranslations } from 'next-intl';

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

type Randomization = {
  limit: number;
  extractions: Extraction[];
  randomNumber: number;
  gameEvent: {
    swappedIndices: number[];
    minesPositionsBuffer: number[];
  };
};

type ProvablyFairResult = {
  hashes: HashItem[];
  randomizations: Randomization[];
};

const Mines = ({
  modal = false,
  provablyResult,
  mineCount = 1
}: {
  modal?: boolean;
  provablyResult: ProvablyFairResult;
  mineCount?: number;
}) => {
  // const t = useTranslations();

  const finalBuffer =
    provablyResult.randomizations[provablyResult.randomizations.length - 1].gameEvent.minesPositionsBuffer;

  const minePositions = finalBuffer.slice(0, mineCount);

  if (modal) {
    return (
      <div className="flex flex-col gap-2 mt-2">
        <div
          className="grid grid-cols-5 gap-0.5"
          style={{
            gridTemplateColumns: 'repeat(5, 40px)',
            gridTemplateRows: 'repeat(5, 40px)'
          }}
        >
          {Array.from({ length: 25 }, (_, index) => (
            <div
              key={index}
              className="w-10 h-10 rounded"
              style={{
                backgroundColor: minePositions.includes(index) ? '#ff861c' : '#2c3550'
              }}
            />
          ))}
        </div>
      </div>
    );
  }
};

export default Mines;
