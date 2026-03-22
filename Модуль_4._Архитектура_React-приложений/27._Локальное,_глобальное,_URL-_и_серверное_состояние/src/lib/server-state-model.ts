import type { ServerItem } from './state-domain';
import type { StatusTone } from './learning-model';

export type ServerSnapshot = {
  status: 'idle' | 'loading' | 'success' | 'error';
  items: ServerItem[];
  error: string | null;
  requestCount: number;
  lastUpdated: number | null;
};

export function filterServerItems(
  items: readonly ServerItem[],
  track: string,
  query: string,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    const matchesTrack = track === 'all' || item.track.toLowerCase() === track;
    const searchableText = `${item.title} ${item.summary} ${item.owner}`.toLowerCase();
    const matchesQuery =
      normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

    return matchesTrack && matchesQuery;
  });
}

export function summarizeServerSnapshot(snapshot: ServerSnapshot): {
  headline: string;
  tone: StatusTone;
  detail: string;
} {
  if (snapshot.status === 'loading') {
    return {
      headline: 'Данные загружаются',
      tone: 'warn',
      detail:
        'Server state живёт отдельно от UI: в этот момент экран знает про loading и не притворяется, что данные уже на месте.',
    };
  }

  if (snapshot.status === 'error') {
    return {
      headline: 'Загрузка завершилась ошибкой',
      tone: 'error',
      detail:
        'Ошибка относится к серверному слою, а не к локальному UI-состоянию формы или раскрытия.',
    };
  }

  if (snapshot.status === 'success') {
    return {
      headline: `${snapshot.items.length} серверных записей`,
      tone: 'success',
      detail:
        'Серверный источник остаётся внешней истиной: локальный UI может фильтровать и аннотировать его, но не становится владельцем этих данных.',
    };
  }

  return {
    headline: 'Данные ещё не запрошены',
    tone: 'warn',
    detail: 'Server state пока не инициализирован.',
  };
}
