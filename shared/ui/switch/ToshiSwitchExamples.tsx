import React, { useState } from 'react';

import Switch, { type SwitchItem } from './Switch';

// Advanced examples showing Toshi UI Button integration
const ToshiSwitchExamples: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState('login');
  const [themeValue, setThemeValue] = useState('light');
  const [gameValue, setGameValue] = useState('casino');

  // Basic login/register switch
  const loginItems: SwitchItem[] = [
    { id: 'login', label: 'Login', value: 'login' },
    { id: 'register', label: 'Register', value: 'register' }
  ];

  // Theme switch with icons
  const themeItems: SwitchItem[] = [
    { id: 'light', label: '☀️ Light', value: 'light' },
    { id: 'dark', label: '🌙 Dark', value: 'dark' },
    { id: 'auto', label: '🔄 Auto', value: 'auto' }
  ];

  // Game type switch
  const gameItems: SwitchItem[] = [
    { id: 'casino', label: '🎰 Casino', value: 'casino' },
    { id: 'sports', label: '⚽ Sports', value: 'sports' },
    { id: 'live', label: '📺 Live', value: 'live' }
  ];

  // Language switch
  const languageItems: SwitchItem[] = [
    { id: 'en', label: 'English', value: 'en' },
    { id: 'tr', label: 'Türkçe', value: 'tr' },
    { id: 'nl', label: 'Nederlands', value: 'nl' },
    { id: 'ru', label: 'Русский', value: 'ru' },
    { id: 'fa', label: 'فارسی', value: 'fa' }
  ];

  return (
    <div className="space-y-8 p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8">Toshi UI Switch Component Examples</h1>

      {/* Basic Switch with Toshi UI Buttons */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Basic Switch (Login/Register)</h2>
        <p className="text-gray-400 text-sm">
          Uses Toshi UI Button with primary/gray intent and glossy/solid appearance
        </p>
        <Switch
          items={loginItems}
          value={selectedValue}
          onChange={value => setSelectedValue(value as string)}
          variant="primary"
        />
        <p className="text-gray-400">Selected: {selectedValue}</p>
      </div>

      {/* Theme Switch */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Theme Switch (3 options)</h2>
        <p className="text-gray-400 text-sm">Shows how Toshi UI Buttons adapt to different content lengths</p>
        <Switch
          items={themeItems}
          value={themeValue}
          onChange={value => setThemeValue(value as string)}
          variant="default"
          size="lg"
        />
        <p className="text-gray-400">Selected: {themeValue}</p>
      </div>

      {/* Game Type Switch */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Game Type Switch</h2>
        <p className="text-gray-400 text-sm">Perfect for casino/sports/live game selection</p>
        <Switch
          items={gameItems}
          value={gameValue}
          onChange={value => setGameValue(value as string)}
          variant="primary"
          fullWidth
        />
        <p className="text-gray-400">Selected: {gameValue}</p>
      </div>

      {/* Language Switch */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Language Switch (4 options)</h2>
        <p className="text-gray-400 text-sm">
          Shows how the component handles multiple options with different text lengths
        </p>
        <Switch items={languageItems} value="en" onChange={() => {}} variant="outlined" fullWidth />
      </div>

      {/* Different Sizes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Different Sizes</h2>
        <p className="text-gray-400 text-sm">Toshi UI Button sizes: sm, md, lg</p>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">Small</p>
            <Switch
              items={loginItems}
              value={selectedValue}
              onChange={value => setSelectedValue(value as string)}
              size="sm"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Medium (default)</p>
            <Switch
              items={loginItems}
              value={selectedValue}
              onChange={value => setSelectedValue(value as string)}
              size="md"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Large</p>
            <Switch
              items={loginItems}
              value={selectedValue}
              onChange={value => setSelectedValue(value as string)}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* Different Variants */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Different Container Variants</h2>
        <p className="text-gray-400 text-sm">Container styling while buttons use Toshi UI styling</p>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">Default</p>
            <Switch
              items={loginItems}
              value={selectedValue}
              onChange={value => setSelectedValue(value as string)}
              variant="default"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Primary</p>
            <Switch
              items={loginItems}
              value={selectedValue}
              onChange={value => setSelectedValue(value as string)}
              variant="primary"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Minimal</p>
            <Switch
              items={loginItems}
              value={selectedValue}
              onChange={value => setSelectedValue(value as string)}
              variant="minimal"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Outlined</p>
            <Switch
              items={loginItems}
              value={selectedValue}
              onChange={value => setSelectedValue(value as string)}
              variant="outlined"
            />
          </div>
        </div>
      </div>

      {/* Without Indicator */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Without Indicator</h2>
        <p className="text-gray-400 text-sm">Pure Toshi UI Button styling without background indicator</p>
        <Switch
          items={loginItems}
          value={selectedValue}
          onChange={value => setSelectedValue(value as string)}
          variant="outlined"
        />
      </div>

      {/* Custom Styling */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Custom Styling</h2>
        <p className="text-gray-400 text-sm">Custom container styling with Toshi UI Buttons</p>
        <Switch
          items={loginItems}
          value={selectedValue}
          onChange={value => setSelectedValue(value as string)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 p-1"
          buttonClassName="font-bold"
        />
      </div>
    </div>
  );
};

export default ToshiSwitchExamples;
