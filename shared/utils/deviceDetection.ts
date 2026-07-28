export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  userAgent: string;
}

export function detectDevice(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase();

  // Mobile detection
  const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile/i;
  const isMobile = mobileRegex.test(ua);

  // Tablet detection (iPad or Android tablets)
  const tabletRegex = /ipad|android(?!.*mobile)/i;
  const isTablet = tabletRegex.test(ua);

  // Desktop detection
  const isDesktop = !isMobile && !isTablet;

  let type: DeviceType;
  if (isMobile) {
    type = 'mobile';
  } else if (isTablet) {
    type = 'tablet';
  } else {
    type = 'desktop';
  }

  return {
    type,
    isMobile,
    isTablet,
    isDesktop,
    userAgent
  };
}

export function getDeviceTypeFromHeaders(headers: any): DeviceInfo {
  const userAgent = headers?.get('user-agent') || '';
  return detectDevice(userAgent);
}
