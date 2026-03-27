export type AdvancedEffectEntry = {
  id: string;
  title: string;
  track: 'async' | 'race' | 'closures' | 'architecture';
  summary: string;
  tags: readonly string[];
};

export type WorkshopLevel = 'base' | 'intermediate' | 'advanced';

export type WorkshopModule = {
  id: string;
  title: string;
  level: WorkshopLevel;
  summary: string;
};

export type ThemeMode = 'light' | 'dark' | 'contrast';

export type EffectEventMode = 'stale-theme' | 'theme-dependency' | 'effect-event';

export type ManualConnection = {
  emitConnected: () => void;
  disconnect: () => void;
};

export const quickQueries = ['async', 'abort', 'effect'] as const;

export const workshopModules: readonly WorkshopModule[] = [
  {
    id: 'a1',
    title: 'Effect cleanup checklist',
    level: 'base',
    summary: 'Где нужен cleanup и как он закрывает таймеры, listeners и запросы.',
  },
  {
    id: 'a2',
    title: 'Race condition playbook',
    level: 'advanced',
    summary: 'Как распознавать гонки и выбирать ignore или abort.',
  },
  {
    id: 'a3',
    title: 'Effect event recipes',
    level: 'advanced',
    summary: 'Как читать актуальные props внутри внешних callbacks без лишних reconnect.',
  },
  {
    id: 'a4',
    title: 'Derived state smells',
    level: 'intermediate',
    summary: 'Когда эффект дублирует вычисление и создаёт drift.',
  },
  {
    id: 'a5',
    title: 'Stale closure drills',
    level: 'intermediate',
    summary: 'Почему interval и listeners часто читают устаревший snapshot.',
  },
  {
    id: 'a6',
    title: 'Event-first side effects',
    level: 'base',
    summary: 'Как отделять действие пользователя от фоновой синхронизации.',
  },
] as const;

export async function loadAdvancedEffectPlaybook(
  signal?: AbortSignal,
): Promise<AdvancedEffectEntry[]> {
  const response = await fetch('/data/advanced-effects-playbook.json', { signal });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить playbook: ${response.status}`);
  }

  return (await response.json()) as AdvancedEffectEntry[];
}

export function filterPlaybook(
  entries: readonly AdvancedEffectEntry[],
  query: string,
): AdvancedEffectEntry[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [...entries];
  }

  return entries.filter((entry) => {
    const haystack = [entry.title, entry.summary, ...entry.tags].join(' ').toLowerCase();
    return haystack.includes(normalized);
  });
}

export function getPlaybookLatency(query: string) {
  const normalized = query.trim().toLowerCase();

  if (normalized === 'async') {
    return 620;
  }

  if (normalized === 'abort') {
    return 260;
  }

  if (normalized === 'effect') {
    return 420;
  }

  return Math.max(180, 760 - normalized.length * 60);
}

async function delayWithAbort(ms: number, signal?: AbortSignal) {
  if (!signal) {
    await new Promise((resolve) => window.setTimeout(resolve, ms));
    return;
  }

  if (signal.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  await new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      signal.removeEventListener('abort', handleAbort);
      resolve();
    }, ms);

    const handleAbort = () => {
      window.clearTimeout(timeoutId);
      signal.removeEventListener('abort', handleAbort);
      reject(new DOMException('Aborted', 'AbortError'));
    };

    signal.addEventListener('abort', handleAbort, { once: true });
  });
}

export async function searchAdvancedEffectPlaybook(
  query: string,
  signal?: AbortSignal,
): Promise<AdvancedEffectEntry[]> {
  const entries = await loadAdvancedEffectPlaybook(signal);
  await delayWithAbort(getPlaybookLatency(query), signal);
  return filterPlaybook(entries, query);
}

export function filterWorkshopModules(query: string, level: WorkshopLevel | 'all') {
  const normalized = query.trim().toLowerCase();

  return workshopModules.filter((module) => {
    const levelMatch = level === 'all' ? true : module.level === level;
    const queryMatch =
      normalized.length === 0
        ? true
        : `${module.title} ${module.summary}`.toLowerCase().includes(normalized);

    return levelMatch && queryMatch;
  });
}

export function buildWorkshopSummary(modules: readonly WorkshopModule[]) {
  if (modules.length === 0) {
    return 'Нет совпадений. В корректной архитектуре это тоже обычное вычисление, а не отдельный effect.';
  }

  const advancedCount = modules.filter((module) => module.level === 'advanced').length;
  return `Найдено ${modules.length} модулей, из них advanced: ${advancedCount}.`;
}

export function createManualConnection(
  roomId: string,
  onLog: (message: string) => void,
  onConnected: () => void,
): ManualConnection {
  let active = true;
  onLog(`connect → ${roomId}`);

  return {
    emitConnected() {
      if (!active) {
        onLog(`signal ignored → ${roomId}`);
        return;
      }

      onLog(`external event → ${roomId}`);
      onConnected();
    },
    disconnect() {
      if (!active) {
        return;
      }

      active = false;
      onLog(`disconnect → ${roomId}`);
    },
  };
}
