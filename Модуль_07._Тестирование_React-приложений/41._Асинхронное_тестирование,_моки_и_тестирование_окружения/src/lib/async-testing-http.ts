export type AsyncPlaybookEntry = {
  id: string;
  title: string;
  detail: string;
};

export type AsyncPlaybookPayload = {
  items: AsyncPlaybookEntry[];
};

function isAsyncPlaybookPayload(value: unknown): value is AsyncPlaybookPayload {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<AsyncPlaybookPayload>;
  return Array.isArray(candidate.items);
}

export async function fetchAsyncPlaybook(
  endpoint: string,
  signal?: AbortSignal,
): Promise<AsyncPlaybookEntry[]> {
  const response = await fetch(endpoint, { signal });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const payload: unknown = await response.json();

  if (!isAsyncPlaybookPayload(payload)) {
    throw new Error('Playbook payload has unexpected structure.');
  }

  return payload.items;
}
