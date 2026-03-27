import {
  createAbortError,
  HttpRequestError,
  isAbortError,
  type PlaybookPayload,
  type PlaybookResponse,
  type RequestScenario,
} from './http-domain';

export type FetchPlaybookOptions = {
  query: string;
  scenario: RequestScenario;
  delayMs: number;
  signal?: AbortSignal;
};

export async function waitWithAbort(delayMs: number, signal?: AbortSignal) {
  if (delayMs <= 0) {
    return;
  }

  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }

    const timeout = window.setTimeout(() => {
      cleanup();
      resolve();
    }, delayMs);

    const onAbort = () => {
      window.clearTimeout(timeout);
      cleanup();
      reject(createAbortError());
    };

    const cleanup = () => {
      signal?.removeEventListener('abort', onAbort);
    };

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

export async function fetchPlaybookCatalog({
  query,
  scenario,
  delayMs,
  signal,
}: FetchPlaybookOptions): Promise<PlaybookResponse> {
  const startedAt = performance.now();

  // Здесь запрос специально замедляется, чтобы loading, abort и race conditions
  // были видны глазами, а не исчезали мгновенно на локальном JSON.
  await waitWithAbort(delayMs, signal);

  const response = await fetch('/data/http-react-playbook.json', {
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    throw new HttpRequestError(response.status, 'Сервер вернул неуспешный статус.');
  }

  const payload = (await response.json()) as PlaybookPayload;

  if (scenario === 'error') {
    throw new HttpRequestError(
      503,
      'Сервер временно недоступен. Попробуйте повторить запрос.',
      true,
    );
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = payload.items.filter((item) => {
    if (!normalizedQuery) {
      return true;
    }

    return [item.title, item.category, item.summary, item.note]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery);
  });

  const items = scenario === 'empty' ? [] : filteredItems;

  return {
    items,
    meta: {
      method: 'GET',
      url: '/data/http-react-playbook.json',
      status: items.length > 0 ? 200 : 204,
      ok: true,
      elapsedMs: Math.round(performance.now() - startedAt),
      query,
      scenario,
    },
  };
}

export function isRetryableRequestError(error: unknown) {
  return error instanceof HttpRequestError && error.retryable;
}

export function normalizeRequestFailure(error: unknown) {
  if (isAbortError(error)) {
    return { kind: 'aborted' as const, message: 'Запрос был отменён.' };
  }

  if (error instanceof HttpRequestError) {
    return { kind: 'http' as const, message: `${error.status}: ${error.message}` };
  }

  if (error instanceof Error) {
    return { kind: 'unknown' as const, message: error.message };
  }

  return { kind: 'unknown' as const, message: 'Неизвестная ошибка запроса.' };
}
