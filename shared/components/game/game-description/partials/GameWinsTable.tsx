import { useEffect, useState } from 'react';

import Table from '@/shared/ui/tables/Table';

const GameWinsTable = () => {
  const [gameBetsType, _setGameBetsType] = useState('mybets');
  const [loading, setLoading] = useState(true);
  const columns = [
    {
      title: 'rank',
      dataIndex: 'rank',
      key: 'rank',
      render: (row: any) => (
        <div
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
            row.rank === '1st'
              ? 'bg-yellow-500 text-black'
              : row.rank === '2nd'
                ? 'bg-gray-400 text-black'
                : 'bg-amber-600 text-white'
          }`}
        >
          {row.rank}
        </div>
      )
    },
    {
      title: 'user',
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: 'date',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'bet',
      dataIndex: 'bet',
      key: 'bet',
      render: (row: any) => (
        <div className="flex items-center gap-1">
          <span>{row.bet}</span>
          <span className="text-orange-500">₿</span>
        </div>
      )
    },
    {
      title: 'multiplier',
      dataIndex: 'multiplier',
      key: 'multiplier'
    },
    {
      title: 'payout',
      dataIndex: 'payout',
      key: 'payout',
      render: (row: any) => (
        <div className="flex items-center gap-1">
          <span>{row.payout}</span>
          <span className="text-orange-500">₿</span>
        </div>
      )
    }
  ];

  const tableData = [
    {
      rank: '1st',
      user: 'Mrbigdick1980',
      date: 'July 16, 2025',
      bet: '$2,500.00',
      multiplier: '100.2x',
      payout: '150,045.47'
    },
    {
      rank: '2nd',
      user: 'Dippywhaledave198753',
      date: 'July 16, 2025',
      bet: '$2,500.00',
      multiplier: '100.2x',
      payout: '150,045.47'
    },
    {
      rank: '3rd',
      user: 'karl123',
      date: 'July 16, 2025',
      bet: '$2,500.00',
      multiplier: '100.2x',
      payout: '150,045.47'
    }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [gameBetsType]);

  return (
    <div>
      <Table
        dataSource={tableData}
        columns={columns}
        loading={loading}
        rowClassName={(_, index) => (index % 2 === 0 ? 'bg-bg_menu' : 'bg-toshi_body')}
      />
    </div>
  );
};

export default GameWinsTable;
