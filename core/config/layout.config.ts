// Route-based layout configuration

// Any pathname matching one of these patterns will use fluid top padding
export const FLUID_TOP_PADDING_ROUTE_PATTERNS: RegExp[] = [
  // Matches /{locale}/casino/game and any subpath
  /^\/[a-zA-Z-]+\/casino\/game(?:\/|$)/
];

export function shouldUseFluidTopPadding(pathname: string): boolean {
  return FLUID_TOP_PADDING_ROUTE_PATTERNS.some(pattern => pattern.test(pathname));
}
