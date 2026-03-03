import { useEffect, useState } from 'react';

export function useLocalStorageState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) {
        return defaultValue;
      }
      return JSON.parse(stored) as T;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage access can fail in restricted environments.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
