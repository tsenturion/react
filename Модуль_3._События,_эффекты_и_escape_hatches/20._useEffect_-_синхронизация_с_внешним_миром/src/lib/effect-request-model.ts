import type { EffectArticle, RequestMode } from './effect-domain';
import type { StatusTone } from './learning-model';

export type RequestReport = {
  tone: StatusTone;
  title: string;
  summary: string;
  snippet: string;
};

export function buildRequestReport(mode: RequestMode): RequestReport {
  if (mode === 'cancel-stale') {
    return {
      tone: 'success',
      title: 'Устаревшие запросы останавливаются в cleanup',
      summary:
        'При смене query предыдущий запрос отменяется или помечается устаревшим, поэтому более старый ответ не может затереть новый результат.',
      snippet: [
        'useEffect(() => {',
        '  const controller = new AbortController();',
        '  request(query, controller.signal);',
        '  return () => controller.abort();',
        '}, [query]);',
      ].join('\n'),
    };
  }

  return {
    tone: 'warn',
    title: 'Без cleanup старые ответы могут вернуться позже',
    summary:
      'Если запросы не отменять, медленный старый ответ способен прийти после нового и перезаписать уже актуальное состояние интерфейса.',
    snippet: [
      'useEffect(() => {',
      '  request(query).then(setResults);',
      '}, [query]);',
    ].join('\n'),
  };
}

export function filterGlossary(entries: readonly EffectArticle[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [...entries];
  }

  return entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(normalized) ||
      entry.summary.toLowerCase().includes(normalized) ||
      entry.kind.toLowerCase().includes(normalized),
  );
}

export function getRequestLatency(query: string) {
  const normalized = query.trim().toLowerCase();

  if (normalized === 'use') {
    return 900;
  }

  if (normalized === 'usee') {
    return 450;
  }

  if (normalized === 'useeffect') {
    return 220;
  }

  return 550;
}

async function waitWithAbort(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    function cleanup() {
      signal.removeEventListener('abort', abort);
    }

    const id = window.setTimeout(() => {
      cleanup();
      resolve();
    }, ms);

    function abort() {
      cleanup();
      window.clearTimeout(id);
      reject(new DOMException('Aborted', 'AbortError'));
    }

    if (signal.aborted) {
      abort();
      return;
    }

    signal.addEventListener('abort', abort, { once: true });
  });
}

export async function searchEffectGlossary(query: string, signal: AbortSignal) {
  const response = await fetch('/data/effect-glossary.json', { signal });
  const entries = (await response.json()) as EffectArticle[];

  await waitWithAbort(getRequestLatency(query), signal);
  return filterGlossary(entries, query);
}
