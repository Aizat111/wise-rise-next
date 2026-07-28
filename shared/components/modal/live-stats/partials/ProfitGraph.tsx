'use client';

import { ChartLine } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import Card from '@/shared/components/card/Card';

export default function ProfitGraph() {
  const t = useTranslations();
  const { profithistory } = useSelector((state: any) => state.bets);

  const formatXAxis = (tickItem: number) => {
    return `${tickItem}`;
  };

  interface ProfitDataPoint {
    event: number;
    profit: number;
  }

  const profitData: ProfitDataPoint[] = (profithistory || []).map((profit: number, index: number) => ({
    event: index + 1,
    profit: profit
  }));

  const yDomain =
    profitData.length > 0
      ? [
          Math.min(-1, Math.floor(Math.min(...profitData.map(d => d.profit)))),
          Math.max(1, Math.ceil(Math.max(...profitData.map(d => d.profit))))
        ]
      : [-1, 1];

  const maxAbsValue = Math.max(Math.abs(yDomain[0]), Math.abs(yDomain[1]));
  const symmetricalDomain = [-maxAbsValue, maxAbsValue];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const profitValue = payload[0].value;
      const profitColor = profitValue >= 0 ? '#34C342' : '#E53E3E';
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: 'rgba(58, 70, 102, 0.7)',
            borderRadius: '4px',
            padding: '4px',
            border: '1px solid #3A4666'
          }}
        >
          <p className="label" style={{ color: '#c1c5d0', fontWeight: '800', fontSize: '12px', margin: '0' }}>
            {t('bet')}: <span style={{ color: '#ffffff' }}>{`#${label}`}</span>
          </p>
          <p className="intro" style={{ color: '#c1c5d0', fontWeight: '800', fontSize: '12px', margin: '0' }}>
            {t('profit')}: <span style={{ color: profitColor }}>${profitValue.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-3 gap-2 rounded-md bg-toshi_body/70">
      <div className="flex flex-row gap-1 items-center">
        <ChartLine className="h-4" />
        <span className="text-sm text-white">Graph</span>
      </div>

      <div
        className="w-full h-[180px] p-4 rounded-md overflow-hidden"
        style={{
          background: 'var(--color-grey40)'
        }}
      >
        <ResponsiveContainer width="100%" height={144}>
          <AreaChart data={profitData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <YAxis domain={symmetricalDomain} axisLine={false} tick={false} tickLine={false} width={0} />
            <XAxis
              dataKey="event"
              axisLine={false}
              tick={false}
              height={0}
              tickLine={false}
              tickFormatter={formatXAxis}
            />
            <Tooltip position={{ x: 0, y: 110 }} content={<CustomTooltip />} />
            <defs>
              <mask id="upperHalf">
                <rect x="0" y="0" width="100%" height="50%" fill="white" />
              </mask>
              <mask id="lowerHalf">
                <rect x="0" y="50%" width="100%" height="50%" fill="white" />
              </mask>
            </defs>
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#34C342"
              fill="#1D6B24"
              fillOpacity={0.5}
              activeDot={{ r: 4, fill: '#ffffff' }}
              strokeWidth={2}
              isAnimationActive={false}
              mask="url(#upperHalf)"
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#E53E3E"
              fill="#7E2222"
              strokeWidth={2}
              activeDot={{ r: 4, fill: '#ffffff' }}
              fillOpacity={0.5}
              isAnimationActive={false}
              mask="url(#lowerHalf)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
