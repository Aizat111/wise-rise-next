import { useEffect, useState } from 'react';

import { gameBetsTypeItems } from '@/core/constants/switch.constants';
import Select from '@/shared/ui/selects/Select';
import { Switch } from '@/shared/ui/switch';
import Table from '@/shared/ui/tables/Table';

const GameBetsTable = () => {
  const [gameBetsType, setGameBetsType] = useState('mybets');
  const [loading, setLoading] = useState(true);
  const columns = [
    {
      title: 'game',
      dataIndex: 'game',
      key: 'game'
    },
    {
      title: 'user',
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: 'time',
      dataIndex: 'time',
      key: 'time'
    },
    {
      title: 'bet_amount',
      dataIndex: 'bet_amount',
      key: 'bet_amount'
    },
    {
      title: 'multiplier',
      dataIndex: 'multiplier',
      key: 'multiplier'
    },
    {
      title: 'payout',
      dataIndex: 'payout',
      key: 'payout'
    }
  ];

  const tableData = [
    {
      game: 'Japanese Big Fish',
      user: 'Mrbigdick1980',
      time: '10:30 PM',
      betAmount: '$2,500.00',
      multiplier: '100.2x',
      payout: '150,045.47',
      currency: 'BTC'
    },
    {
      game: 'Mines',
      user: 'Dippywhaledave198753',
      time: '10:30 PM',
      betAmount: '$2,500.00',
      multiplier: '100.2x',
      payout: '150,045.47',
      currency: 'ETH'
    },
    {
      game: 'Gator Hunters',
      user: 'karl123',
      time: '10:30 PM',
      betAmount: '$2,500.00',
      multiplier: '100.2x',
      payout: '150,045.47',
      currency: 'BTC'
    },
    {
      game: 'Dojo Dah',
      user: 'maddog1980',
      time: '10:30 PM',
      betAmount: '$35,500.00',
      multiplier: '100.2x',
      payout: '150,045.47',
      currency: 'USDT'
    },
    {
      game: 'Crash',
      user: 'Hidden',
      time: '10:30 PM',
      betAmount: '$35,500.00',
      multiplier: '100.2x',
      payout: '150,045.47',
      currency: 'USDT'
    },
    {
      game: 'Toshi Roulette',
      user: 'Hidden',
      time: '10:30 PM',
      betAmount: '$35,500.00',
      multiplier: '100.2x',
      payout: '150,045.47',
      currency: 'USDT'
    },
    {
      game: 'Suger Rish',
      user: 'Hidden',
      time: '10:30 PM',
      betAmount: '$35,500.00',
      multiplier: '100.2x',
      payout: '150,045.47',
      currency: 'USDT'
    },
    {
      game: 'Gates of Olympus 100',
      user: 'Hidden',
      time: '10:30 PM',
      betAmount: '$2,500.00',
      multiplier: '100.2x',
      payout: '150,045.47',
      currency: 'BTC'
    },
    {
      game: 'Soccer',
      user: 'Mrbigdick1980',
      time: '10:30 PM',
      betAmount: '$2,500.00',
      multiplier: '100.2x',
      payout: '150,045.47',
      currency: 'ETH'
    },
    {
      game: 'Wanted dead or alive',
      user: 'Hidden',
      time: '10:30 PM',
      betAmount: '$2,500.00',
      multiplier: '100.2x',
      payout: '150,045.47',
      currency: 'USDT'
    },
    {
      game: 'Sweet Bonanza',
      user: 'Hidden',
      time: '10:30 PM',
      betAmount: '$2,500.00',
      multiplier: '100.2x',
      payout: '150,045.47',
      currency: 'BTC'
    },
    {
      game: 'Super Scatter',
      user: 'Hidden',
      time: '10:30 PM',
      betAmount: '$2,500.00',
      multiplier: '100.2x',
      payout: '150,045.47',
      currency: 'BTC'
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
      <div className="flex justify-between items-center mb-4">
        <Switch
          items={gameBetsTypeItems}
          value={gameBetsType}
          size="sm"
          className="w-1/2"
          onChange={value => setGameBetsType(value as string)}
        />
        <div className="w-[70px]">
          <Select
            options={[
              { value: '0', label: '0' },
              { value: '10', label: '10' },
              { value: '20', label: '20 ' }
            ]}
            searchable={false}
            value="10"
            triggerClassName="bg-bg_menu"
          />
        </div>
      </div>
      <Table
        dataSource={tableData}
        columns={columns}
        loading={loading}
        rowClassName={(_, index) => (index % 2 === 0 ? 'bg-bg_menu' : 'bg-toshi_body')}
      />
    </div>
  );
};

export default GameBetsTable;
