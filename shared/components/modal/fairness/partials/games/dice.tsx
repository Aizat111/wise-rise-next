'use client';

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

type DiceRandomization = {
  limit: number;
  extractions: Extraction[];
  randomNumber: number;
  gameEvent: {
    roll: number; // ör: 92.33
  };
};

type DiceProvablyFairResult = {
  hashes: HashItem[];
  randomizations: DiceRandomization[];
};

interface DiceProps {
  hmacResult: DiceProvablyFairResult;
  modal?: boolean;
}

const Dice = ({ hmacResult, modal = false }: DiceProps) => {
  // const t = useTranslations();

  // 1) Son step'i al (şu an tek step var ama future-proof olsun)
  const lastRandomization = hmacResult.randomizations[hmacResult.randomizations.length - 1];

  const roll = lastRandomization.gameEvent.roll; // 92.33 gibi

  if (modal) {
    return <div className="font-black text-white text-lg">{roll.toFixed(2)}</div>;
  }
};

export default Dice;
