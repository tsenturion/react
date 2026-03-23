import type {
  CatalogResource,
  CatalogResponse,
  CatalogScope,
  FreshnessProfileId,
  HealthSnapshot,
  LessonRecord,
  LessonTrack,
  SummaryResponse,
} from './server-state-domain';

const catalogSeed: LessonRecord[] = [
  {
    id: 'catalog-1',
    title: 'React environment audit',
    track: 'foundations',
    status: 'published',
    seats: 120,
    owner: 'Server',
  },
  {
    id: 'catalog-2',
    title: 'State architecture review',
    track: 'state',
    status: 'draft',
    seats: 36,
    owner: 'Server',
  },
  {
    id: 'catalog-3',
    title: 'Effect cleanup workshop',
    track: 'effects',
    status: 'published',
    seats: 94,
    owner: 'Server',
  },
];

const mutationSeed: LessonRecord[] = [
  {
    id: 'mutation-1',
    title: 'Server cache primer',
    track: 'foundations',
    status: 'draft',
    seats: 18,
    owner: 'Server',
  },
  {
    id: 'mutation-2',
    title: 'Query invalidation map',
    track: 'state',
    status: 'published',
    seats: 60,
    owner: 'Server',
  },
];

const consistencySeed: LessonRecord[] = [
  {
    id: 'consistency-1',
    title: 'Summary cache watch',
    track: 'state',
    status: 'draft',
    seats: 28,
    owner: 'Server',
  },
  {
    id: 'consistency-2',
    title: 'Published dashboard card',
    track: 'effects',
    status: 'published',
    seats: 77,
    owner: 'Server',
  },
];

const resourceDb: Record<CatalogResource, LessonRecord[]> = {
  catalog: catalogSeed.map((item) => ({ ...item })),
  'mutation-board': mutationSeed.map((item) => ({ ...item })),
  'consistency-board': consistencySeed.map((item) => ({ ...item })),
};

const requestCounters = {
  catalog: 0,
  summary: 0,
  health: 0,
};

let serverVersion = 1;
let healthVersion = 1;
let lessonCounter = 20;

const healthAttempts = new Map<string, number>();

export class ServerStateRequestError extends Error {
  constructor(
    message: string,
    public readonly retryable: boolean = true,
  ) {
    super(message);
    this.name = 'ServerStateRequestError';
  }
}

function cloneLesson(item: LessonRecord) {
  return { ...item };
}

function cloneLessons(items: readonly LessonRecord[]) {
  return items.map(cloneLesson);
}

// Query functions в TanStack Query получают AbortSignal.
// Этот helper делает задержку cancellable, чтобы aborted запрос не считался
// "обычной ошибкой" и не продолжал жить после смены ключа или unmount.
async function waitWithSignal(delayMs: number, signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  await new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort);
      resolve();
    }, delayMs);

    const handleAbort = () => {
      window.clearTimeout(timer);
      signal?.removeEventListener('abort', handleAbort);
      reject(new DOMException('Aborted', 'AbortError'));
    };

    signal?.addEventListener('abort', handleAbort);
  });
}

function nextMeta(kind: keyof typeof requestCounters) {
  requestCounters[kind] += 1;

  return {
    requestNo: requestCounters[kind],
    serverVersion,
    fetchedAt: Date.now(),
  };
}

function getResourceItems(resource: CatalogResource) {
  return resourceDb[resource];
}

function filterByScope(items: readonly LessonRecord[], scope: CatalogScope) {
  if (scope === 'published') {
    return items.filter((item) => item.status === 'published');
  }

  if (scope === 'draft') {
    return items.filter((item) => item.status === 'draft');
  }

  return items;
}

export function peekServerDiagnostics() {
  return {
    serverVersion,
    healthVersion,
    requestCounters: { ...requestCounters },
  };
}

export function advanceHealthVersion() {
  healthVersion += 1;
  return healthVersion;
}

export async function fetchLessonCatalog(options: {
  resource: CatalogResource;
  scope: CatalogScope;
  signal?: AbortSignal;
  delayMs?: number;
}): Promise<CatalogResponse> {
  const { resource, scope, signal, delayMs = 650 } = options;
  await waitWithSignal(delayMs, signal);

  const meta = nextMeta('catalog');
  const items = filterByScope(getResourceItems(resource), scope);

  return {
    items: cloneLessons(items),
    meta,
  };
}

export async function fetchCatalogSummary(options: {
  resource: CatalogResource;
  signal?: AbortSignal;
  delayMs?: number;
}): Promise<SummaryResponse> {
  const { resource, signal, delayMs = 420 } = options;
  await waitWithSignal(delayMs, signal);

  const meta = nextMeta('summary');
  const items = getResourceItems(resource);

  return {
    draftCount: items.filter((item) => item.status === 'draft').length,
    publishedCount: items.filter((item) => item.status === 'published').length,
    totalSeats: items.reduce((total, item) => total + item.seats, 0),
    meta,
  };
}

export async function fetchHealthSnapshot(options: {
  profile: FreshnessProfileId;
  failBeforeSuccess: number;
  signal?: AbortSignal;
  delayMs?: number;
}): Promise<HealthSnapshot> {
  const { profile, failBeforeSuccess, signal, delayMs = 720 } = options;
  const attemptKey = `${profile}:${failBeforeSuccess}:${healthVersion}`;
  const attempt = (healthAttempts.get(attemptKey) ?? 0) + 1;
  healthAttempts.set(attemptKey, attempt);

  await waitWithSignal(delayMs, signal);

  if (attempt <= failBeforeSuccess) {
    throw new ServerStateRequestError(
      'Серверный snapshot временно недоступен. Query layer может повторить запрос без ручной оркестрации в компоненте.',
    );
  }

  requestCounters.health += 1;

  return {
    status:
      profile === 'aggressive'
        ? 'recovering'
        : profile === 'balanced'
          ? 'healthy'
          : 'slow',
    note:
      healthVersion > 1
        ? 'Сервер уже изменил snapshot. Кэш покажет новую версию только после refetch или invalidation.'
        : 'Сейчас в кэше и на сервере одна и та же версия snapshot.',
    meta: {
      requestNo: requestCounters.health,
      serverVersion: healthVersion,
      fetchedAt: Date.now(),
      attempt,
    },
  };
}

export async function createDraftLessonOnServer(options: {
  resource: CatalogResource;
  title: string;
  track: LessonTrack;
  delayMs?: number;
}) {
  const { resource, title, track, delayMs = 700 } = options;
  await waitWithSignal(delayMs);

  lessonCounter += 1;
  serverVersion += 1;

  const nextLesson: LessonRecord = {
    id: `${resource}-${lessonCounter}`,
    title: title.trim(),
    track,
    status: 'draft',
    seats: 12,
    owner: 'Server',
  };

  getResourceItems(resource).unshift(nextLesson);
  return cloneLesson(nextLesson);
}

export async function publishLessonOnServer(options: {
  resource: CatalogResource;
  id: string;
  delayMs?: number;
}) {
  const { resource, id, delayMs = 760 } = options;
  await waitWithSignal(delayMs);

  const lesson = getResourceItems(resource).find((item) => item.id === id);

  if (!lesson) {
    throw new ServerStateRequestError(
      'Сервер не нашёл lesson для publish mutation.',
      false,
    );
  }

  if (lesson.status === 'published') {
    return cloneLesson(lesson);
  }

  lesson.status = 'published';
  lesson.seats += 24;
  serverVersion += 1;

  return cloneLesson(lesson);
}
