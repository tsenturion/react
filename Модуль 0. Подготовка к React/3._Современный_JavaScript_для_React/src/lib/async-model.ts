import { toErrorMessage } from './common';
import type { LessonCard } from './js-module-catalog';

export type FetchMode = 'ready' | 'slow' | 'empty' | 'error';

export type RemoteCatalog = {
  generatedAt: string;
  lessons: LessonCard[];
};

export const fetchModes: FetchMode[] = ['ready', 'slow', 'empty', 'error'];

const wait = (timeoutMs: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, timeoutMs);
  });

const resolveCatalogUrl = (mode: FetchMode) => {
  if (mode === 'empty') {
    return '/data/js-react-catalog-empty.json';
  }

  if (mode === 'error') {
    return '/data/js-react-catalog-missing.json';
  }

  return '/data/js-react-catalog.json';
};

// Запрос вынесен отдельно, чтобы async/await и fetch были самостоятельной частью
// темы, а не случайной строкой кода внутри страницы.
export const fetchCatalog = async (mode: FetchMode): Promise<RemoteCatalog> => {
  if (mode === 'slow') {
    await wait(900);
  }

  const response = await fetch(resolveCatalogUrl(mode));

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: каталог не загрузился`);
  }

  return (await response.json()) as RemoteCatalog;
};

export const filterRemoteLessons = (
  payload: RemoteCatalog,
  filters: { query: string; onlyReady: boolean },
) => {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return payload.lessons.filter((lesson) => {
    if (filters.onlyReady && !lesson.ready) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return [lesson.title, lesson.summary, ...lesson.tags]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery);
  });
};

export const buildPromiseTimeline = ({
  mode,
  status,
  visibleCount,
  error,
}: {
  mode: FetchMode;
  status: 'idle' | 'loading' | 'success' | 'error';
  visibleCount: number;
  error?: string;
}) => [
  `mode: ${mode}`,
  `status: ${status}`,
  status === 'success'
    ? `visible lessons: ${visibleCount}`
    : status === 'error'
      ? `error: ${error ?? 'unknown'}`
      : 'ожидание результата',
];

export const toRequestError = (error: unknown) => toErrorMessage(error);
