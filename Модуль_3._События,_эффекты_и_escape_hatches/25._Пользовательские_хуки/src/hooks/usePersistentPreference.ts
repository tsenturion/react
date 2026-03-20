import { useEffect, useState } from 'react';

export function usePersistentPreference<T extends string>(
  storageKey: string,
  initialValue: T,
) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const storedValue = window.localStorage.getItem(storageKey);
      return (storedValue as T | null) ?? initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      // Для учебного проекта важнее сохранить рабочий UI,
      // даже если storage в текущей среде недоступен.
    }
  }, [storageKey, value]);

  return [value, setValue] as const;
}
