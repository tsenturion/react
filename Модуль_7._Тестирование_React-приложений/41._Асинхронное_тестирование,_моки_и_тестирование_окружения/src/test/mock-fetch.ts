import { vi } from 'vitest';

type FetchStep = Response | Error;

export function createJsonResponse<T>(
  body: T,
  init?: {
    ok?: boolean;
    status?: number;
    statusText?: string;
  },
) {
  return {
    ok: init?.ok ?? true,
    status: init?.status ?? 200,
    statusText: init?.statusText ?? 'OK',
    json: async () => body,
  } as Response;
}

export function mockFetchSequence(...steps: FetchStep[]) {
  const fetchMock = vi.fn();

  for (const step of steps) {
    if (step instanceof Error) {
      fetchMock.mockRejectedValueOnce(step);
      continue;
    }

    fetchMock.mockResolvedValueOnce(step);
  }

  vi.stubGlobal('fetch', fetchMock as typeof fetch);
  return fetchMock;
}
