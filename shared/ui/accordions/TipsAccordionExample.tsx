'use client';

import { type FC } from 'react';

import TipsAccordion from './TipsAccordion';

const TipsAccordionExample: FC = () => {
  const tipsData = [
    {
      id: '1',
      number: '1',
      question: 'Stay Consistent',
      answer:
        'Consistency is key to maximizing your gold earnings. Make sure to log in daily and complete your tasks regularly to build momentum and unlock better rewards.'
    },
    {
      id: '2',
      number: '2',
      question: 'Start Early',
      answer:
        'The earlier you start your daily activities, the more opportunities you have to earn gold throughout the day. Early birds get the best rewards!'
    },
    {
      id: '3',
      number: '3',
      question: 'Level Up Your VIP',
      answer:
        'Higher VIP levels provide better rewards and multipliers. Focus on activities that increase your VIP progress to unlock exclusive benefits.'
    },
    {
      id: '4',
      number: '4',
      question: 'Complete High-Reward Missions',
      answer:
        'Every friday Toshi rewards its users with a bonus based on their activity on the platform and within the community for that week. The reward is based on your previous 7 days activity when you claim it, make sure to claim it fast! These can be upgraded by progressing as a VIP.',
      isExpanded: true
    },
    {
      id: '5',
      number: '5',
      question: 'Build Your Referral Army',
      answer:
        'Refer friends to earn additional gold. The more active referrals you have, the more passive income you generate from their activities.'
    },
    {
      id: '6',
      number: '6',
      question: 'Spin Your Coupons',
      answer:
        "Use your daily spins on coupons to potentially win big rewards. Don't let your spins go to waste - they reset daily!"
    }
  ];

  const handleLearnMore = () => {
    console.log('Learn more about token farming clicked');
    // Add your navigation or modal logic here
  };

  return (
    <TipsAccordion
      title="Tips to Gain Maximum Gold"
      tips={tipsData}
      learnMoreText="Learn more about token farming"
      onLearnMoreClick={handleLearnMore}
    />
  );
};

export default TipsAccordionExample;
