import React, { useState } from 'react';

import Switch, { type SwitchItem } from './Switch';

// Example usage component showing different Switch configurations
const SwitchExamples: React.FC = () => {
  const [loginValue, setLoginValue] = useState('login');
  const [themeValue, setThemeValue] = useState('light');
  const [languageValue, setLanguageValue] = useState('en');
  const [statusValue, setStatusValue] = useState('active');

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

  // Language switch
  const languageItems: SwitchItem[] = [
    { id: 'en', label: 'English', value: 'en' },
    { id: 'tr', label: 'Türkçe', value: 'tr' },
    { id: 'nl', label: 'Nederlands', value: 'nl' },
    { id: 'ru', label: 'Русский', value: 'ru' },
    { id: 'fa', label: 'فارسی', value: 'fa' }
  ];

  // Status switch with disabled option
  const statusItems: SwitchItem[] = [
    { id: 'active', label: 'Active', value: 'active' },
    { id: 'inactive', label: 'Inactive', value: 'inactive' },
    { id: 'pending', label: 'Pending', value: 'pending', disabled: true }
  ];

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Switch Component Examples (Using Toshi UI Buttons)</h2>

      {/* Basic Switch */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Basic Switch (Login/Register)</h3>
        <Switch
          items={loginItems}
          value={loginValue}
          onChange={value => setLoginValue(value as string)}
          variant="primary"
        />
        <p className="text-gray-400">Selected: {loginValue}</p>
      </div>

      {/* Theme Switch */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Theme Switch (3 options)</h3>
        <Switch
          items={themeItems}
          value={themeValue}
          onChange={value => setThemeValue(value as string)}
          variant="default"
          size="lg"
        />
        <p className="text-gray-400">Selected: {themeValue}</p>
      </div>

      {/* Language Switch */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Language Switch (4 options)</h3>
        <Switch
          items={languageItems}
          value={languageValue}
          onChange={value => setLanguageValue(value as string)}
          variant="outlined"
          fullWidth
        />
        <p className="text-gray-400">Selected: {languageValue}</p>
      </div>

      {/* Status Switch with Disabled */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Status Switch (with disabled option)</h3>
        <Switch
          items={statusItems}
          value={statusValue}
          onChange={value => setStatusValue(value as string)}
          variant="minimal"
          size="sm"
        />
        <p className="text-gray-400">Selected: {statusValue}</p>
      </div>

      {/* Different Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Different Sizes</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">Small</p>
            <Switch
              items={loginItems}
              value={loginValue}
              onChange={value => setLoginValue(value as string)}
              size="sm"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Medium (default)</p>
            <Switch
              items={loginItems}
              value={loginValue}
              onChange={value => setLoginValue(value as string)}
              size="md"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Large</p>
            <Switch
              items={loginItems}
              value={loginValue}
              onChange={value => setLoginValue(value as string)}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* Different Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Different Variants</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">Default</p>
            <Switch
              items={loginItems}
              value={loginValue}
              onChange={value => setLoginValue(value as string)}
              variant="default"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Primary</p>
            <Switch
              items={loginItems}
              value={loginValue}
              onChange={value => setLoginValue(value as string)}
              variant="primary"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Minimal</p>
            <Switch
              items={loginItems}
              value={loginValue}
              onChange={value => setLoginValue(value as string)}
              variant="minimal"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Outlined</p>
            <Switch
              items={loginItems}
              value={loginValue}
              onChange={value => setLoginValue(value as string)}
              variant="outlined"
            />
          </div>
        </div>
      </div>

      {/* Without Indicator */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Without Indicator</h3>
        <Switch
          items={loginItems}
          value={loginValue}
          onChange={value => setLoginValue(value as string)}
          variant="outlined"
        />
      </div>

      {/* Custom Styling */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Custom Styling</h3>
        <Switch
          items={loginItems}
          value={loginValue}
          onChange={value => setLoginValue(value as string)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 p-1"
          buttonClassName="text-white font-bold"
        />
      </div>
    </div>
  );
};

export default SwitchExamples;
