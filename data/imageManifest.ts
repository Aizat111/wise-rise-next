// Typed registry for all externally hosted (S3 via Imgix) assets.
// Keep paths RELATIVE to the S3 bucket root configured in your Imgix Source.
// Example layout suggestions:
// - home/..., logos/..., avatars/..., providers/..., games/...
// - Use kebab-case for file names; version via suffix if needed (e.g., name-v2.webp)

export const IMAGE_MANIFEST = {
  // Auth
  'auth.login': '/public/login.jpg',
  'auth.register': '/public/signup.jpg',

  'games.lock': '/public/locked.png',
  // Home
  'home.signupBanner': '/public/signupbg.png',
  'home.casino': '/public/casino.jpg',
  'home.sports': '/public/sports.jpg',
  'home.raffle': '/public/raffle.jpg',
  'home.affiliate': '/public/affiliate.jpg',
  'home.rewardsclaim': '/public/rewardsclaim.jpg',
  // Logos
  'logos.footer': 'logos/footer-logo.svg',
  'logos.header': 'logos/header-logo.svg'
} as const;

export type ImageKey = keyof typeof IMAGE_MANIFEST;
