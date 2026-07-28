import Cookies from 'js-cookie';

type CookieOptions = {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
};

const createTokenStorage = () => {
  const getDefaultCookieOptions = (): CookieOptions => {
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    return {
      secure: isSecure,
      sameSite: isSafari ? 'lax' : 'strict',
      path: '/'
    };
  };

  const getLegacyDomainCookieOptions = (): CookieOptions | null => {
    if (typeof window === 'undefined') return null;
    return { path: '/', domain: window.location.hostname };
  };

  return {
    getItem(_key: string) {
      return Cookies.get(_key);
    },
    setItem(_key: string, value: string, options?: CookieOptions) {
      const defaultOptions = getDefaultCookieOptions();
      const mergedOptions = { ...defaultOptions, ...options };

      try {
        const legacyOptions = getLegacyDomainCookieOptions();
        if (legacyOptions) Cookies.remove(_key, legacyOptions);
        return Cookies.set(_key, value, mergedOptions);
      } catch {
        try {
          return Cookies.set(_key, value, { path: '/' });
        } catch {
          return false;
        }
      }
    },
    removeItem(_key: string) {
      const defaultOptions = getDefaultCookieOptions();
      try {
        Cookies.remove(_key, defaultOptions);
        const legacyOptions = getLegacyDomainCookieOptions();
        if (legacyOptions) Cookies.remove(_key, legacyOptions);
        return true;
      } catch {
        try {
          return Cookies.remove(_key, { path: '/' });
        } catch {
          return false;
        }
      }
    }
  };
};

const tokenStorage = createTokenStorage();

export default tokenStorage;
