import React, { useState } from 'react';

import Switch, { type SwitchItem } from './Switch';

// Simple test component to verify Switch works
const SwitchTest: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState('login');

  const loginItems: SwitchItem[] = [
    { id: 'login', label: 'Login', value: 'login' },
    { id: 'register', label: 'Register', value: 'register' }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white">Switch Component Test (Toshi UI Buttons)</h1>

      {/* Basic Test */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-white">Basic Switch</h2>
        <Switch items={loginItems} value={selectedValue} onChange={value => setSelectedValue(value as string)} />
      </div>
    </div>
  );
};

export default SwitchTest;
