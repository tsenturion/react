import { useEffect, useState } from 'react';

import { readQueryValue, writeQueryValue } from '../lib/url-state-model';

function notifyUrlStateChange() {
  window.dispatchEvent(new Event('app:url-state-change'));
}

export function useQueryParamState<T extends string>(
  key: string,
  fallback: T,
  allowedValues?: readonly T[],
) {
  const [value, setValue] = useState<T>(() =>
    readQueryValue(window.location.search, key, fallback, allowedValues),
  );

  useEffect(() => {
    const syncFromUrl = () => {
      setValue(readQueryValue(window.location.search, key, fallback, allowedValues));
    };

    window.addEventListener('popstate', syncFromUrl);
    window.addEventListener('app:url-state-change', syncFromUrl);

    return () => {
      window.removeEventListener('popstate', syncFromUrl);
      window.removeEventListener('app:url-state-change', syncFromUrl);
    };
  }, [allowedValues, fallback, key]);

  return [
    value,
    (nextValue: T, mode: 'push' | 'replace' = 'push') => {
      const nextSearch = writeQueryValue(
        window.location.search,
        key,
        nextValue,
        fallback,
      );
      const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`;
      window.history[mode === 'push' ? 'pushState' : 'replaceState']({}, '', nextUrl);
      // history.pushState сам не вызывает popstate, поэтому hook уведомляет
      // подписчиков отдельным событием и держит URL state живым внутри React.
      notifyUrlStateChange();
    },
  ] as const;
}
