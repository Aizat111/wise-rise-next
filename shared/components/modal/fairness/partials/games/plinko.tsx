import React from 'react';

// Triangle üretimi (görselleştirme için)
const generateTriangle = (levels: number) => {
  const triangle: number[][] = [];
  for (let i = 0; i < levels; i++) {
    triangle.push(Array(i + 1).fill(0));
  }
  return triangle;
};

// Multiplier hesaplama
const solve = (
  path: number[] = [],
  triangle: number[][],
  risk: 'low' | 'medium' | 'high',
  winMultipliers: Record<string, Record<string, number[]>>
) => {
  let pos = 0;
  path.forEach((move, index) => {
    triangle[index][pos] = 1;
    if (move === 1) pos += 1;
  });

  const levelKey = String(triangle.length);
  const multipliers = winMultipliers[levelKey]?.[risk] || [];

  const finalMultiplier = multipliers[pos] ?? 0;

  return {
    multiplier: finalMultiplier,
    triangle,
    path,
    payoutIndex: pos
  };
};

interface PlinkoProps {
  modal?: boolean;
  floatResult?: any; // randomizations veya floats gelebilir
  risk?: 'low' | 'medium' | 'high';
  info: {
    config: {
      winMultipliers: Record<string, Record<string, number[]>>;
    };
  };
}

const Plinko: React.FC<PlinkoProps> = ({ modal = true, floatResult, risk = 'low', info }) => {
  if (!floatResult) return null;

  // Kullanılacak path
  let path: number[] = [];

  // Eğer floats varsa onu kullan
  if (floatResult.floats?.length) {
    path = floatResult.floats;
  }
  // Yoksa randomizations içinden en son gameEvent path’i al
  else if (floatResult.randomizations?.length) {
    path = floatResult.randomizations[floatResult.randomizations.length - 1].gameEvent.path;
  }

  // Triangle path uzunluğuna göre
  const triangle = generateTriangle(path.length);

  // Multiplier hesaplama
  const result = solve(path, triangle, risk, info.config.winMultipliers);

  if (!modal) return null;

  return (
    <div className="bg-gray-700 flex flex-col py-2 px-4 rounded gap-1 mt-2 items-center">
      <div className="font-black text-base text-white">
        {/* Multiplier:  */}
        {result.multiplier}
      </div>
      {/* <div className="text-xs text-gray-300 mt-1">
        Path: {result.path.join(', ')}
      </div>
      <div className="text-xs text-gray-300">
        Payout Index: {result.payoutIndex}
      </div> */}
    </div>
  );
};

export default Plinko;
