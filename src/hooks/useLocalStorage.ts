import { useEffect, useState } from 'react';

// Persists any JSON-serializable value to localStorage and keeps it in sync.
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage might be full or unavailable — fail silently, app still works.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
