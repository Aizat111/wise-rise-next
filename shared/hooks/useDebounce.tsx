import { useEffect, useState } from 'react';

/**
 * useDebounce
 * @param value - value to track (string, number, object vs.)
 * @param delay - delay in ms (default: 500ms)
 * @returns debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup: value or delay changes, previous timeout is cancelled
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
