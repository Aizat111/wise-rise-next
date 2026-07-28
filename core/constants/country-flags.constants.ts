export type CountryCode =
  | 'CA' // Canada
  | 'AT' // Austria
  | 'FI' // Finland
  | 'MX' // Mexico
  | 'CH' // Switzerland
  | 'TH' // Thailand
  | 'GB' // United Kingdom
  | 'US' // United States
  | 'UA' // Ukraine
  | 'AE' // United Arab Emirates
  | 'TR' // Turkey
  | 'MX' // Mexico
  | 'CH' // Switzerland
  | 'TH' // Thailand
  | 'GB' // United Kingdom
  | 'US' // United States
  | 'UA' // Ukraine
  | 'AE' // United Arab Emirates
  | 'TR' // Turkey
  | 'MX' // Mexico
  | 'CH' // Switzerland
  | 'TH' // Thailand
  | 'AU' // Australia
  | 'NZ' // New Zealand
  | 'IE' // Ireland
  | 'ZA' // South Africa
  | 'NG' // Nigeria
  | 'KE' // Kenya
  | 'GH' // Ghana
  | 'UG' // Uganda
  | 'TZ' // Tanzania
  | 'PH' // Philippines
  | 'SG' // Singapore
  | 'MY' // Malaysia
  | 'IN' // India
  | 'PK' // Pakistan
  | 'BD' // Bangladesh
  | 'JM' // Jamaica
  | 'TT' // Trinidad and Tobago
  | 'BB' // Barbados
  | 'BS' // Bahamas
  | 'BZ' // Belize
  | 'ES' // Spain
  | 'MX' // Mexico
  | 'CO' // Colombia
  | 'AR' // Argentina
  | 'PE' // Peru
  | 'VE' // Venezuela
  | 'CL' // Chile
  | 'EC' // Ecuador
  | 'GT' // Guatemala
  | 'CU' // Cuba
  | 'BO' // Bolivia
  | 'DO' // Dominican Republic
  | 'HN' // Honduras
  | 'PY' // Paraguay
  | 'SV' // El Salvador
  | 'NI' // Nicaragua
  | 'CR' // Costa Rica
  | 'PA' // Panama
  | 'UY' // Uruguay
  | 'PR' // Puerto Rico
  | 'GQ' // Equatorial Guinea
  | 'IR' // Iran
  | 'IQ' // Iraq
  | 'MM' // Myanmar (Burma)
  | 'KP' // North Korea
  | 'SS' // South Sudan
  | 'SD' // Sudan
  | 'SY' // Syria
  | 'TW' // Taiwan
  | 'SE' // Sweden
  | 'CH' // Switzerland
  | 'TH' // Thailand
  | 'GB' // United Kingdom
  | 'US' // United States
  | 'UA' // Ukraine
  | 'AE' // United Arab Emirates
  | 'TR' // Turkey
  | 'MX' // Mexico
  | 'CH' // Switzerland
  | 'TH' // Thailand
  | 'AU' // Australia
  | 'NZ' // New Zealand
  | 'IE' // Ireland
  | 'ZA' // South Africa
  | 'NG' // Nigeria
  | 'KE' // Kenya
  | 'GH' // Ghana
  | 'MX'; // Mexico

export interface CountryFlagInfo {
  code: CountryCode;
  name: string;
  // Path under public/; if a flag svg/png is not present, leave undefined to use fallback
  flagSrc?: string;
}

// Note: Place corresponding flag assets under public/assets/flags if available.
// Example path format used below: /assets/flags/{code.toLowerCase()}.svg
export const COUNTRY_FLAGS: Record<CountryCode, CountryFlagInfo> = {
  TR: { code: 'TR', name: 'Turkey', flagSrc: '/assets/flags/tr.svg' },
  CA: { code: 'CA', name: 'Canada', flagSrc: '/assets/flags/ca.svg' },
  AT: { code: 'AT', name: 'Austria', flagSrc: '/assets/flags/at.svg' },
  FI: { code: 'FI', name: 'Finland', flagSrc: '/assets/flags/fi.svg' },
  MX: { code: 'MX', name: 'Mexico', flagSrc: '/assets/flags/mx.svg' },
  CH: { code: 'CH', name: 'Switzerland', flagSrc: '/assets/flags/ch.svg' },
  TH: { code: 'TH', name: 'Thailand', flagSrc: '/assets/flags/th.svg' },
  GB: { code: 'GB', name: 'United Kingdom', flagSrc: '/assets/flags/gb.svg' },
  US: { code: 'US', name: 'United States', flagSrc: '/assets/flags/us.svg' },
  UA: { code: 'UA', name: 'Ukraine', flagSrc: '/assets/flags/ua.svg' },
  AU: { code: 'AU', name: 'Australia', flagSrc: '/assets/flags/au.svg' },
  NZ: { code: 'NZ', name: 'New Zealand', flagSrc: '/assets/flags/nz.svg' },
  IE: { code: 'IE', name: 'Ireland', flagSrc: '/assets/flags/ie.svg' },
  ZA: { code: 'ZA', name: 'South Africa', flagSrc: '/assets/flags/za.svg' },
  NG: { code: 'NG', name: 'Nigeria', flagSrc: '/assets/flags/ng.svg' },
  KE: { code: 'KE', name: 'Kenya', flagSrc: '/assets/flags/ke.svg' },
  GH: { code: 'GH', name: 'Ghana', flagSrc: '/assets/flags/gh.svg' },
  UG: { code: 'UG', name: 'Uganda', flagSrc: '/assets/flags/ug.svg' },
  TZ: { code: 'TZ', name: 'Tanzania', flagSrc: '/assets/flags/tz.svg' },
  PH: { code: 'PH', name: 'Philippines', flagSrc: '/assets/flags/ph.svg' },
  SG: { code: 'SG', name: 'Singapore', flagSrc: '/assets/flags/sg.svg' },
  MY: { code: 'MY', name: 'Malaysia', flagSrc: '/assets/flags/my.svg' },
  IN: { code: 'IN', name: 'India', flagSrc: '/assets/flags/in.svg' },
  PK: { code: 'PK', name: 'Pakistan', flagSrc: '/assets/flags/pk.svg' },
  BD: { code: 'BD', name: 'Bangladesh', flagSrc: '/assets/flags/bd.svg' },
  JM: { code: 'JM', name: 'Jamaica', flagSrc: '/assets/flags/jm.svg' },
  TT: { code: 'TT', name: 'Trinidad and Tobago', flagSrc: '/assets/flags/tt.svg' },
  BB: { code: 'BB', name: 'Barbados', flagSrc: '/assets/flags/bb.svg' },
  BS: { code: 'BS', name: 'Bahamas', flagSrc: '/assets/flags/bs.svg' },
  BZ: { code: 'BZ', name: 'Belize', flagSrc: '/assets/flags/bz.svg' },
  ES: { code: 'ES', name: 'Spain', flagSrc: '/assets/flags/es.svg' },
  CO: { code: 'CO', name: 'Colombia', flagSrc: '/assets/flags/co.svg' },
  AR: { code: 'AR', name: 'Argentina', flagSrc: '/assets/flags/ar.svg' },
  PE: { code: 'PE', name: 'Peru', flagSrc: '/assets/flags/pe.svg' },
  VE: { code: 'VE', name: 'Venezuela', flagSrc: '/assets/flags/ve.svg' },
  CL: { code: 'CL', name: 'Chile', flagSrc: '/assets/flags/cl.svg' },
  EC: { code: 'EC', name: 'Ecuador', flagSrc: '/assets/flags/ec.svg' },
  GT: { code: 'GT', name: 'Guatemala', flagSrc: '/assets/flags/gt.svg' },
  CU: { code: 'CU', name: 'Cuba', flagSrc: '/assets/flags/cu.svg' },
  BO: { code: 'BO', name: 'Bolivia', flagSrc: '/assets/flags/bo.svg' },
  DO: { code: 'DO', name: 'Dominican Republic', flagSrc: '/assets/flags/do.svg' },
  HN: { code: 'HN', name: 'Honduras', flagSrc: '/assets/flags/hn.svg' },
  PY: { code: 'PY', name: 'Paraguay', flagSrc: '/assets/flags/py.svg' },
  SV: { code: 'SV', name: 'El Salvador', flagSrc: '/assets/flags/sv.svg' },
  NI: { code: 'NI', name: 'Nicaragua', flagSrc: '/assets/flags/ni.svg' },
  CR: { code: 'CR', name: 'Costa Rica', flagSrc: '/assets/flags/cr.svg' },
  PA: { code: 'PA', name: 'Panama', flagSrc: '/assets/flags/pa.svg' },
  UY: { code: 'UY', name: 'Uruguay', flagSrc: '/assets/flags/uy.svg' },
  PR: { code: 'PR', name: 'Puerto Rico', flagSrc: '/assets/flags/pr.svg' },
  GQ: { code: 'GQ', name: 'Equatorial Guinea', flagSrc: '/assets/flags/gq.svg' },
  IR: { code: 'IR', name: 'Iran', flagSrc: '/assets/flags/ir.svg' },
  IQ: { code: 'IQ', name: 'Iraq', flagSrc: '/assets/flags/iq.svg' },
  MM: { code: 'MM', name: 'Myanmar (Burma)', flagSrc: '/assets/flags/mm.svg' },
  KP: { code: 'KP', name: 'North Korea', flagSrc: '/assets/flags/kp.svg' },
  SS: { code: 'SS', name: 'South Sudan', flagSrc: '/assets/flags/ss.svg' },
  SD: { code: 'SD', name: 'Sudan', flagSrc: '/assets/flags/sd.svg' },
  SY: { code: 'SY', name: 'Syria', flagSrc: '/assets/flags/sy.svg' },
  TW: { code: 'TW', name: 'Taiwan', flagSrc: '/assets/flags/tw.svg' },
  SE: { code: 'SE', name: 'Sweden', flagSrc: '/assets/flags/se.svg' },
  AE: { code: 'AE', name: 'United Arab Emirates', flagSrc: '/assets/flags/ae.svg' }
};

export function getCountryFlagInfo(code: string): CountryFlagInfo | undefined {
  const normalized = code?.toUpperCase() as CountryCode;
  return COUNTRY_FLAGS[normalized];
}

export function getCountryFlagInfoByName(name: string): CountryFlagInfo | undefined {
  if (!name) return undefined;
  const lower = name.toLowerCase();
  for (const info of Object.values(COUNTRY_FLAGS)) {
    if (info.name.toLowerCase() === lower) {
      return info;
    }
  }
  return undefined;
}

export function getCountryFlagInfoFromCodeOrName(value: string): CountryFlagInfo | undefined {
  return getCountryFlagInfo(value) ?? getCountryFlagInfoByName(value);
}
