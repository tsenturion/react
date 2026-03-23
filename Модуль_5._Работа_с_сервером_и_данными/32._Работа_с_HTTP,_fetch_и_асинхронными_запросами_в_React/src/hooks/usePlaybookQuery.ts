import { useEffect, useRef, useState } from 'react';

import {
  fetchPlaybookCatalog,
  normalizeRequestFailure,
  type FetchPlaybookOptions,
} from '../lib/http-client';
import type { PlaybookEntry, RequestMeta, RequestStatus } from '../lib/http-domain';

type UsePlaybookQueryOptions = {
  query: string;
  scenario: FetchPlaybookOptions['scenario'];
  delayMs: number;
  enabled: boolean;
};

type QueryState = {
  status: RequestStatus;
  items: PlaybookEntry[];
  error: string | null;
  meta: RequestMeta | null;
};

const initialState: QueryState = {
  status: 'idle',
  items: [],
  error: null,
  meta: null,
};

export function usePlaybookQuery({
  query,
  scenario,
  delayMs,
  enabled,
}: UsePlaybookQueryOptions) {
  const [state, setState] = useState<QueryState>(initialState);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    void (async () => {
      setState((current) => ({
        ...current,
        status: 'loading',
        error: null,
      }));

      try {
        const result = await fetchPlaybookCatalog({
          query,
          scenario,
          delayMs,
          signal: controller.signal,
        });

        // Даже если старый запрос завершился позже нового, он не должен
        // перезаписать более свежий результат в интерфейсе.
        if (requestId !== requestIdRef.current) {
          return;
        }

        setState({
          status: result.items.length > 0 ? 'success' : 'empty',
          items: result.items,
          error: null,
          meta: result.meta,
        });
      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        const failure = normalizeRequestFailure(error);

        if (failure.kind === 'aborted') {
          setState((current) => ({
            ...current,
            status: 'aborted',
            error: failure.message,
          }));
          return;
        }

        setState((current) => ({
          ...current,
          status: 'error',
          error: failure.message,
        }));
      }
    })();

    return () => {
      controller.abort();
    };
  }, [delayMs, enabled, query, scenario]);

  return enabled ? state : initialState;
}
