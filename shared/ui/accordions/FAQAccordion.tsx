'use client';

import { type FC } from 'react';

import TipsAccordion from './TipsAccordion';

const FAQAccordionExample: FC = () => {
  const faqsData = [
    {
      id: '1',
      number: '1',
      question: 'What is Token Farming?',
      answer:
        'Token Farming is your route to the $GAMBLE airdrop. Play, refer, and complete on-site tasks to earn Toshi Gold — our highest-value farming currency that converts directly into $GAMBLE at the end of the farming season.'
    },
    {
      id: '2',
      number: '2',
      question: 'What is $GAMBLE?',
      answer:
        "$GAMBLE is Toshi.Bet's native token. It's deflationary with industry leading utilities and built to reward the platform's most loyal players. When the farming season ends, $GAMBLE becomes the most valuable asset in crypto gambling — and you'll want as much as you can get."
    },
    {
      id: '3',
      number: '3',
      question: 'Where do I start farming Toshi Gold?',
      answer:
        "Log in to your Toshi.Bet account and head over to your personal farming dashboard — you'll find it in the left-hand menu. The dashboard is your command centre to earn Toshi Gold, track progress, smash missions and secure your share of $GAMBLE."
    },
    {
      id: '4',
      number: '4',
      question: 'What tasks and quests do I complete to earn Toshi Gold?',
      answer:
        "Check in daily. Keep your 8-hour farm active. Refer your friends. Complete challenges. You'll also get high-reward missions like wager targets and Plinko drops. Stack as much Toshi Gold as possible before the season ends — every bit increases your $GAMBLE payout",
      isExpanded: true
    },
    {
      id: '5',
      number: '5',
      question: 'How do coupons work?',
      answer:
        'Earn them while farming. Use them in the Lootbox Game to win more Toshi Gold, free spins, or real crypto credited directly to your account.'
    },
    {
      id: '6',
      number: '6',
      question: 'What happens to my Toshi Gold at the end of the season?',
      answer:
        "Every piece of Toshi Gold gets converted into $GAMBLE during the airdrop. The more you've farmed, the bigger your bag."
    },
    {
      id: '7',
      number: '7',
      question: 'Do VIP levels give me a farming boost?',
      answer:
        'Yes. The higher your VIP level, the bigger your Toshi Gold multiplier. VIPs get rewarded for playing hard. Hit VIP milestones to boost your Gold earnings and climb the airdrop leaderboard'
    }
  ];

  const handleLearnMore = () => {
    console.log('Learn more about token farming clicked');
    // Add your navigation or modal logic here
  };

  return (
    <TipsAccordion
      title="Frequently Asked Questions"
      tips={faqsData}
      learnMoreText="Learn more about token farming"
      onLearnMoreClick={handleLearnMore}
    />
  );
};

export default FAQAccordionExample;
