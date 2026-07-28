// Function to get profile image based on VIP level
const getProfileImageForLevel = (level: number) => {
  const profileImages: { [key: number]: string } = {
    0: 'https://static.toshi.bet/profiles/level_0.png?w=350&fit=min&auto=format',
    1: 'https://static.toshi.bet/profiles/level_1.png?w=350&fit=min&auto=format',
    5: 'https://static.toshi.bet/profiles/level_5.png?w=350&fit=min&auto=format',
    10: 'https://static.toshi.bet/profiles/level_10.png?w=350&fit=min&auto=format',
    15: 'https://static.toshi.bet/profiles/level_15.png?w=350&fit=min&auto=format',
    20: 'https://static.toshi.bet/profiles/level_20.png?w=350&fit=min&auto=format',
    22: 'https://static.toshi.bet/profiles/level_22.png?w=350&fit=min&auto=format',
    24: 'https://static.toshi.bet/profiles/level_24.png?w=350&fit=min&auto=format',
    25: 'https://static.toshi.bet/profiles/level_25.png?w=350&fit=min&auto=format',
    28: 'https://static.toshi.bet/profiles/level_28.png?w=350&fit=min&auto=format',
    30: 'https://static.toshi.bet/profiles/level_30.png?w=350&fit=min&auto=format',
    35: 'https://static.toshi.bet/profiles/level_35.png?w=350&fit=min&auto=format'
  };

  // Find the closest level that has an image
  const availableLevels = Object.keys(profileImages)
    .map(Number)
    .sort((a, b) => a - b);
  let closestLevel = 0;

  for (const availableLevel of availableLevels) {
    if (level >= availableLevel) {
      closestLevel = availableLevel;
    } else {
      break;
    }
  }

  return profileImages[closestLevel] || profileImages[0];
};

const toRoman = (num: number) => {
  const romanNumerals = [
    ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'],
    ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'],
    ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'],
    ['', 'M', 'MM', 'MMM']
  ];
  const digits = String(num).split('').reverse();
  let roman = '';

  for (let i = 0; i < digits.length; i++) {
    roman = romanNumerals[i][Number.parseInt(digits[i])] + roman;
  }
  return roman;
};

const getLevelSource = (level: number) => {
  if (level === 0) return `Tadpole`;
  if (level >= 1 && level <= 4) return `Fish ${toRoman(level)}`;
  if (level >= 5 && level <= 9) return `Seal ${toRoman(level - 4)}`;
  if (level >= 10 && level <= 14) return `Piranha ${toRoman(level - 9)}`;
  if (level >= 15 && level <= 19) return `Shark ${toRoman(level - 14)}`;
  if (level >= 20 && level <= 24) return `Whale ${toRoman(level - 19)}`;
  if (level >= 25 && level <= 29) return `Plat Whale ${toRoman(level - 24)}`;
  if (level >= 30 && level <= 34) return `Dmnd Whale ${toRoman(level - 29)}`;
  if (level >= 35 && level <= 40) return `Poseidon ${toRoman(level - 34)}`;
  return '';
};

const getUserTitleForChallenges = (level: number) => {
  if (level == 0) return 'Everyone';
  if (level >= 1 && level <= 4) return `Fish ${toRoman(level)}`;
  if (level >= 5 && level <= 9) return `Seal ${toRoman(level - 4)}`;
  if (level >= 10 && level <= 14) return `Piranha ${toRoman(level - 9)}`;
  if (level >= 15 && level <= 19) return `Shark ${toRoman(level - 14)}`;
  if (level >= 20 && level <= 24) return `Whale ${toRoman(level - 19)}`;
  if (level >= 25 && level <= 29) return `Platinum Whale ${toRoman(level - 24)}`;
  if (level >= 30 && level <= 34) return `Diamond Whale ${toRoman(level - 29)}`;
  if (level >= 35 && level <= 40) return `Poseidon ${toRoman(level - 34)}`;
  return '';
};

const getUserMultiplier = (level: number) => {
  if (level >= 1 && level <= 4) return '1.2x'; // Fish
  if (level >= 5 && level <= 9) return '1.4x'; // Seal
  if (level >= 10 && level <= 14) return '1.6x'; // Piranha
  if (level >= 15 && level <= 19) return '1.8x'; // Shark
  if (level >= 20 && level <= 24) return '2x'; // Whale
  if (level >= 25 && level <= 29) return '3x'; // Platinum Whale
  if (level >= 30 && level <= 34) return '4x'; // Diamond Whale
  if (level >= 35 && level <= 40) return '5x'; // Poseidon
  return '1x';
};

const getUserTextColor = (level: number): string => {
  if (level < 1) {
    return '#FFFFFF';
  }

  // Fish (levels 1-4)
  if (level >= 1 && level <= 4) {
    return '#FFFFFF';
  }

  // Seal (levels 5-9)
  if (level >= 5 && level <= 9) {
    return '#00bf63';
  }

  // Piranha (levels 10-14)
  if (level >= 10 && level <= 14) {
    return '#ff3131';
  }

  // Shark (levels 15-19)
  if (level >= 15 && level <= 19) {
    return '#004aad';
  }

  // Whale (levels 20-21)
  if (level >= 20 && level <= 21) {
    return '#8c52ff';
  }

  // Whale (levels 22-23)
  if (level >= 22 && level <= 23) {
    // Use the first color from the gradient
    return '#004aad';
  }

  // Whale (level 24)
  if (level === 24) {
    // Use the first color from the gradient
    return '#5de0e6';
  }

  // Platinum Whale (levels 25-27)
  if (level >= 25 && level <= 27) {
    // Use a bright silver color
    return '#C7BFBF';
  }

  // Platinum Whale (levels 28-29)
  if (level >= 28 && level <= 29) {
    return '#8c52ff';
  }

  // Diamond Whale (levels 30-34)
  if (level >= 30 && level <= 34) {
    return '#8c52ff';
  }

  // Poseidon (levels 35-40)
  if (level >= 35 && level <= 40) {
    // Use a bright silver/white color
    return '#ffffff';
  }

  // Default color
  return '#808080';
};

export { getLevelSource, getProfileImageForLevel, getUserMultiplier, getUserTextColor, getUserTitleForChallenges };
