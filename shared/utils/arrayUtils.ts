export const checkLoseAtSameIndex = (nums: any, words: any, type: 'lose' | 'coin') => {
  return nums.some((num: any, index: any) => num === type && words[index] === 1);
};
