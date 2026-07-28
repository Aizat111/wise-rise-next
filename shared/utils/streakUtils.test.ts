// Streak helper tests. The repo doesn't ship a jest/vitest runner, so these
// are written against `node --test` so they can be executed with the bundled
// Node test runner (Node >= 18). Run via:
//   npx tsx --test src/shared/utils/streakUtils.test.ts
// or transpile via ts-node / esbuild-register.
//
// The test coverage focuses on the milestone ladder and the date formatter,
// since those are the two pieces of business logic in the streaks UI.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  FIXED_MILESTONES,
  assignMilestoneStatuses,
  centsToDollars,
  centsToWholeDollars,
  formatStreakStartDate,
  milestoneFillFraction,
  milestoneLabel,
  nextMilestone,
  ordinal,
  prevMilestone
} from './streakUtils';

test('FIXED_MILESTONES are 30 / 60 / 180 / 365', () => {
  assert.deepEqual([...FIXED_MILESTONES], [30, 60, 180, 365]);
});

test('nextMilestone — fixed ladder below 365', () => {
  assert.equal(nextMilestone(0), 30);
  assert.equal(nextMilestone(1), 30);
  assert.equal(nextMilestone(29), 30);
  assert.equal(nextMilestone(30), 60);
  assert.equal(nextMilestone(59), 60);
  assert.equal(nextMilestone(60), 180);
  assert.equal(nextMilestone(124), 180); // canonical spec example
  assert.equal(nextMilestone(179), 180);
  assert.equal(nextMilestone(180), 365);
  assert.equal(nextMilestone(364), 365);
});

test('nextMilestone — yearly steps past 365', () => {
  assert.equal(nextMilestone(365), 730);
  assert.equal(nextMilestone(700), 730);
  assert.equal(nextMilestone(730), 1095);
  assert.equal(nextMilestone(1094), 1095);
  assert.equal(nextMilestone(1095), 1460);
});

test('prevMilestone — segment lower bound', () => {
  assert.equal(prevMilestone(0), 0);
  assert.equal(prevMilestone(10), 0);
  assert.equal(prevMilestone(30), 30);
  assert.equal(prevMilestone(45), 30);
  assert.equal(prevMilestone(124), 60);
  assert.equal(prevMilestone(200), 180);
  assert.equal(prevMilestone(365), 365);
  assert.equal(prevMilestone(400), 365);
  assert.equal(prevMilestone(730), 730);
  assert.equal(prevMilestone(900), 730);
});

test('milestoneLabel — day vs year format', () => {
  assert.equal(milestoneLabel(30), '30-day');
  assert.equal(milestoneLabel(60), '60-day');
  assert.equal(milestoneLabel(180), '180-day');
  assert.equal(milestoneLabel(365), '1-year');
  assert.equal(milestoneLabel(730), '2-year');
  assert.equal(milestoneLabel(1095), '3-year');
  assert.equal(milestoneLabel(1460), '4-year');
});

test('milestoneLabel for currentStreak=124 yields next-milestone label "180-day"', () => {
  const next = nextMilestone(124);
  assert.equal(next, 180);
  assert.equal(milestoneLabel(next), '180-day');
});

test('milestoneFillFraction — proportional fill clamped to [0, 1]', () => {
  // current 0 -> 0/30 = 0
  assert.equal(milestoneFillFraction(0), 0);
  // current 15 -> 15/30 = 0.5
  assert.equal(milestoneFillFraction(15), 0.5);
  // current 30 -> (30-30)/(60-30) = 0
  assert.equal(milestoneFillFraction(30), 0);
  // current 45 -> (45-30)/(60-30) = 0.5
  assert.equal(milestoneFillFraction(45), 0.5);
  // current 124 -> (124-60)/(180-60) = 64/120 ≈ 0.5333
  assert.ok(Math.abs(milestoneFillFraction(124) - 64 / 120) < 1e-9);
  // Yearly segment: current 730 -> 0
  assert.equal(milestoneFillFraction(730), 0);
  // current 900 -> (900-730)/(1095-730) = 170/365
  assert.ok(Math.abs(milestoneFillFraction(900) - 170 / 365) < 1e-9);
});

test('ordinal — day-of-month suffixes', () => {
  assert.equal(ordinal(1), '1st');
  assert.equal(ordinal(2), '2nd');
  assert.equal(ordinal(3), '3rd');
  assert.equal(ordinal(4), '4th');
  assert.equal(ordinal(11), '11th');
  assert.equal(ordinal(12), '12th');
  assert.equal(ordinal(13), '13th');
  assert.equal(ordinal(21), '21st');
  assert.equal(ordinal(22), '22nd');
  assert.equal(ordinal(23), '23rd');
  assert.equal(ordinal(31), '31st');
});

test('formatStreakStartDate — "2025-01-22" -> "22nd January 2025"', () => {
  assert.equal(formatStreakStartDate('2025-01-22'), '22nd January 2025');
  assert.equal(formatStreakStartDate('2024-03-01'), '1st March 2024');
  assert.equal(formatStreakStartDate('2024-12-31'), '31st December 2024');
});

test('formatStreakStartDate — invalid input falls back to the raw string', () => {
  assert.equal(formatStreakStartDate('not-a-date'), 'not-a-date');
});

test('centsToDollars — USD formatted with 2 decimals', () => {
  assert.equal(centsToDollars(0), '$0.00');
  assert.equal(centsToDollars(50), '$0.50');
  assert.equal(centsToDollars(100), '$1.00');
  assert.equal(centsToDollars(100000), '$1,000.00');
  assert.equal(centsToDollars(123456), '$1,234.56');
});

test('centsToWholeDollars — drops decimals on whole dollars, keeps them otherwise', () => {
  assert.equal(centsToWholeDollars(0), '$0');
  assert.equal(centsToWholeDollars(5000), '$50');
  assert.equal(centsToWholeDollars(10000), '$100');
  assert.equal(centsToWholeDollars(500000), '$5,000');
  assert.equal(centsToWholeDollars(4999), '$49.99');
});

test('assignMilestoneStatuses — Received / Next up / Locked assignment', () => {
  const rules = [
    { days: 3, payoutCents: 1000 },
    { days: 7, payoutCents: 5000 },
    { days: 14, payoutCents: 10000 },
    { days: 30, payoutCents: 50000 }
  ];

  // currentStreak = 5 -> only day-3 received, day-7 is next, rest locked
  const at5 = assignMilestoneStatuses(5, rules);
  assert.deepEqual(
    at5.map(r => r.status),
    ['received', 'next', 'locked', 'locked']
  );

  // Boundary: currentStreak == tier.days -> that tier IS received
  const at7 = assignMilestoneStatuses(7, rules);
  assert.deepEqual(
    at7.map(r => r.status),
    ['received', 'received', 'next', 'locked']
  );

  // currentStreak = 0 -> nothing received, first tier is next
  const at0 = assignMilestoneStatuses(0, rules);
  assert.deepEqual(
    at0.map(r => r.status),
    ['next', 'locked', 'locked', 'locked']
  );

  // currentStreak beyond every tier -> all received, no "next"
  const at100 = assignMilestoneStatuses(100, rules);
  assert.deepEqual(
    at100.map(r => r.status),
    ['received', 'received', 'received', 'received']
  );

  // Empty rules -> empty result (component hides the section)
  assert.deepEqual(assignMilestoneStatuses(5, []), []);

  // Payload passes through untouched (days + payoutCents preserved)
  assert.equal(at5[1].days, 7);
  assert.equal(at5[1].payoutCents, 5000);
});

test('assignMilestoneStatuses — bumping currentStreak 6 -> 7 flips day-7 from next to received', () => {
  const rules = [
    { days: 7, payoutCents: 5000 },
    { days: 14, payoutCents: 10000 }
  ];
  const before = assignMilestoneStatuses(6, rules);
  const after = assignMilestoneStatuses(7, rules);
  assert.equal(before[0].status, 'next');
  assert.equal(after[0].status, 'received');
  // day-14 stays "next" after the flip
  assert.equal(after[1].status, 'next');
});
