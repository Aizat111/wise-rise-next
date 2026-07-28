'use client';

import { type FC, useState } from 'react';

// Types
interface TabItem {
  id: string;
  label: string;
}

interface VerticalTabsProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
  onTabChange?: (_tabId: string) => void;
  className?: string;
  containerClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
}

// Reusable components
const TabButton: FC<{
  tab: TabItem;
  isActive: boolean;
  onClick: () => void;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}> = ({ tab, isActive, onClick, className = '', activeClassName = '', inactiveClassName = '' }) => (
  <div
    className={`h-11 px-2.5 pt-3 pb-2.5 rounded-lg inline-flex justify-start items-center gap-2.5 cursor-pointer transition-colors shrink-0 w-auto @[768px]:w-full ${
      isActive
        ? `bg-primary-500/10 border border-1 border-primary-500 ${activeClassName}`
        : `bg-bg_menu @[768px]:bg-transparent @[768px]:hover:bg-transparent ${inactiveClassName}`
    } ${className}`}
    onClick={onClick}
    onKeyDown={e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
    role="button"
    tabIndex={0}
  >
    <div
      className={`justify-start text-base font-semibold leading-snug tracking-wide ${
        isActive ? 'text-white' : 'text-white70 @[768px]:text-white'
      }`}
    >
      {tab.label}
    </div>
  </div>
);

export const VerticalTabs: FC<VerticalTabsProps> = ({
  tabs,
  defaultActiveTab,
  onTabChange,
  className = '',
  containerClassName = '',
  tabClassName = '',
  activeTabClassName = '',
  inactiveTabClassName = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id || '');

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div
      className={`h-fit w-full  no-scrollbar @[768px]:rounded-2xl inline-flex justify-start items-start gap-2 overflow-x-auto whitespace-nowrap @[768px]:whitespace-normal @[768px]:overflow-visible @[768px]:flex-col @[768px]:gap-0 @[768px]:bg-bg_menu @[768px]:p-2.5 ${containerClassName} ${className}`}
    >
      {tabs.map(tab => (
        <TabButton
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={tabClassName}
          activeClassName={activeTabClassName}
          inactiveClassName={inactiveTabClassName}
        />
      ))}
    </div>
  );
};

export default VerticalTabs;
