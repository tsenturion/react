export type RequestScenario = 'success' | 'empty' | 'error';
export type RequestStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'empty'
  | 'error'
  | 'aborted';

export type PlaybookEntry = {
  id: string;
  title: string;
  category: string;
  summary: string;
  note: string;
  risk: 'low' | 'medium' | 'high';
};

export type PlaybookPayload = {
  items: PlaybookEntry[];
};

export type RequestMeta = {
  method: 'GET';
  url: string;
  status: 200 | 204;
  ok: boolean;
  elapsedMs: number;
  query: string;
  scenario: RequestScenario;
};

export type PlaybookResponse = {
  items: PlaybookEntry[];
  meta: RequestMeta;
};

export class HttpRequestError extends Error {
  status: number;
  retryable: boolean;

  constructor(status: number, message: string, retryable = false) {
    super(message);
    this.name = 'HttpRequestError';
    this.status = status;
    this.retryable = retryable;
  }
}

export function createAbortError() {
  const error = new Error('Запрос был отменён до завершения.');
  error.name = 'AbortError';
  return error;
}

export function isAbortError(error: unknown) {
  return error instanceof Error && error.name === 'AbortError';
}

export function readRequestError(error: unknown) {
  if (error instanceof HttpRequestError) {
    return `${error.status}: ${error.message}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Неизвестная ошибка запроса.';
}
