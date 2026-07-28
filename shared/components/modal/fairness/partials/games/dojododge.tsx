import { useEffect, useState } from 'react';

type Risk = 'low' | 'medium' | 'hard' | 'hardcore';

interface DojoDodgeProps {
  hmacResult: any;
  risk: Risk;
  modal?: boolean;
  data: any;
  connector: any;
}

const DojoDodge = ({ hmacResult, risk = 'low' as Risk, modal = false, data, connector }: DojoDodgeProps) => {
  const [multiplier, setMultiplier] = useState<number>(0);

  useEffect(() => {
    if (!hmacResult?.randomizations?.length) return;
    if (!data) return;
    if (!connector) return;

    const buffer = hmacResult.randomizations[hmacResult.randomizations.length - 1].gameEvent.lanesWithObstaclesBuffer;
    const numberOfObstacles = data.config.numberOfObstaclesByRisk[risk];
    const obstacle = Math.min(...buffer.slice(0, numberOfObstacles));
    const numberOfLanes = data.config.multipliersByRisk[risk].length;
    let isWin = false;
    if (obstacle >= numberOfLanes) {
      isWin = true;
    }
    const multiplier = connector
      .floor(data.config.multipliersByRisk[risk][isWin ? obstacle - 1 : obstacle], 2)
      .toFixed(2);
    setMultiplier(multiplier);
  }, [hmacResult, risk]);

  if (!modal) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="font-black text-white text-lg">Multiplier: {multiplier}</div>
    </div>
  );
};

export default DojoDodge;
