import type { RequestStatus } from './http-domain';
import type { StatusTone } from './learning-model';

export const requestStatusOrder: readonly RequestStatus[] = [
  'idle',
  'loading',
  'success',
  'empty',
  'error',
  'aborted',
] as const;

export function statusTone(status: RequestStatus): StatusTone {
  if (status === 'success') {
    return 'success';
  }
  if (status === 'error' || status === 'aborted') {
    return 'error';
  }
  return 'warn';
}

export function statusSummary(status: RequestStatus) {
  switch (status) {
    case 'idle':
      return 'Запрос ещё не стартовал.';
    case 'loading':
      return 'Запрос выполняется, UI ждёт ответ.';
    case 'success':
      return 'Данные получены и готовы к рендеру.';
    case 'empty':
      return 'Ответ успешный, но список пуст.';
    case 'error':
      return 'Запрос завершился ошибкой.';
    case 'aborted':
      return 'Запрос был отменён до завершения.';
  }
}
