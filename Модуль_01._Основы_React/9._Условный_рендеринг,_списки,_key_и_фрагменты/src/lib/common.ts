export type StatusTone = 'success' | 'warn' | 'error';

export const unique = <T>(items: T[]) => [...new Set(items)];

export const formatMinutes = (minutes: number) => `${minutes} мин`;

export const toErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Неизвестная ошибка запроса.';
