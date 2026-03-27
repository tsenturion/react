import {
  buildDashboardSummary,
  buildTeamLoad,
  makeTemporaryIncident,
  sortIncidents,
} from './incidents-domain';
import type {
  ActivityItem,
  ApiOperation,
  CreateIncidentPayload,
  DashboardSnapshot,
  Incident,
  LoginPayload,
  Session,
  TeamLoadItem,
  UpdateIncidentPayload,
} from './types';

const credentials: Record<string, Session> = {
  'lead@sprintops.io': {
    id: 'lead-1',
    name: 'Ника Воронова',
    email: 'lead@sprintops.io',
    role: 'lead',
  },
  'ops@sprintops.io': {
    id: 'operator-1',
    name: 'Илья Новиков',
    email: 'ops@sprintops.io',
    role: 'operator',
  },
};

const seedIncidents: Incident[] = [
  {
    id: 'INC-401',
    title: 'Карточки заказов не доходят в Checkout API',
    service: 'Checkout API',
    owner: 'Ава Чен',
    priority: 'critical',
    status: 'investigating',
    description:
      'Очередь зависает под пиковым трафиком после последнего релиза риск-правил.',
    createdAt: '2026-03-25T06:40:00.000Z',
    updatedAt: '2026-03-26T08:12:00.000Z',
  },
  {
    id: 'INC-402',
    title: 'Подтверждение оплаты теряется на мобильном Safari',
    service: 'Payments UI',
    owner: 'Макс Петров',
    priority: 'high',
    status: 'blocked',
    description:
      'Команда ждёт hotfix от провайдера webview, без него реплей не стабилен.',
    createdAt: '2026-03-25T10:00:00.000Z',
    updatedAt: '2026-03-26T07:30:00.000Z',
  },
  {
    id: 'INC-403',
    title: 'Уведомления о возвратах приходят с задержкой',
    service: 'Notifications',
    owner: 'Лина Орлова',
    priority: 'medium',
    status: 'new',
    description:
      'Пиковая очередь email-задач приводит к каскадной задержке почти на 18 минут.',
    createdAt: '2026-03-26T03:10:00.000Z',
    updatedAt: '2026-03-26T05:45:00.000Z',
  },
  {
    id: 'INC-404',
    title: 'Fraud score возвращает старую модель для части запросов',
    service: 'Fraud checks',
    owner: 'Sam Ortega',
    priority: 'high',
    status: 'investigating',
    description:
      'Наблюдается split traffic между старой и новой моделью из-за cache invalidation.',
    createdAt: '2026-03-25T13:45:00.000Z',
    updatedAt: '2026-03-26T06:18:00.000Z',
  },
  {
    id: 'INC-398',
    title: 'График SLA на дашборде не обновлялся после ночного rollout',
    service: 'Analytics',
    owner: 'Ава Чен',
    priority: 'low',
    status: 'resolved',
    description: 'Причина закрыта: stale cache в edge-слое, данные уже выровнены.',
    createdAt: '2026-03-24T09:10:00.000Z',
    updatedAt: '2026-03-26T04:40:00.000Z',
  },
];

const seedActivity: ActivityItem[] = [
  {
    id: 'ACT-1',
    title: 'Checkout escalated',
    body: 'Критический инцидент переведён в investigation и попал в war room.',
    tone: 'warn',
    at: '2026-03-26T08:12:00.000Z',
  },
  {
    id: 'ACT-2',
    title: 'Analytics recovered',
    body: 'SLA chart вернулся в зелёную зону после ручного cache bust.',
    tone: 'good',
    at: '2026-03-26T04:40:00.000Z',
  },
  {
    id: 'ACT-3',
    title: 'Mobile payments blocked',
    body: 'Safari incident ждёт внешний hotfix, поэтому поток переведён в blocked.',
    tone: 'neutral',
    at: '2026-03-26T07:30:00.000Z',
  },
];

interface MockState {
  incidents: Incident[];
  activity: ActivityItem[];
  revision: number;
  nextId: number;
}

function createSeedState(): MockState {
  return {
    incidents: structuredClone(seedIncidents),
    activity: structuredClone(seedActivity),
    revision: 1,
    nextId: 405,
  };
}

let state = createSeedState();
let latencyFactor = 1;
const failurePlan = new Map<ApiOperation, number>();

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500,
    public readonly retryable: boolean = true,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function nextDelay(baseMs: number) {
  return Math.round(baseMs * latencyFactor);
}

function maybeFail(operation: ApiOperation, message: string) {
  const remaining = failurePlan.get(operation) ?? 0;
  if (remaining > 0) {
    failurePlan.set(operation, remaining - 1);
    throw new ApiError(message, 503, true);
  }
}

function mutateState<T>(producer: () => T) {
  state.revision += 1;
  return producer();
}

async function wait(delayMs: number, signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  if (delayMs <= 0) {
    return;
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

function pushActivity(item: Omit<ActivityItem, 'id' | 'at'>) {
  state.activity.unshift({
    id: `ACT-${Date.now()}`,
    at: new Date().toISOString(),
    ...item,
  });
  state.activity = state.activity.slice(0, 8);
}

function getIncidentOrThrow(id: string) {
  const incident = state.incidents.find((item) => item.id === id);

  if (!incident) {
    throw new ApiError(
      'Инцидент не найден. Возможно, он уже был удалён другой сессией.',
      404,
      false,
    );
  }

  return incident;
}

export function resetMockApi() {
  state = createSeedState();
  failurePlan.clear();
  latencyFactor = 1;
}

export function setMockLatencyFactor(value: number) {
  latencyFactor = value;
}

export function failNextRequest(operation: ApiOperation, count = 1) {
  failurePlan.set(operation, (failurePlan.get(operation) ?? 0) + count);
}

export function peekIncidents() {
  return clone(state.incidents);
}

export async function loginRequest(
  payload: LoginPayload,
  options: { signal?: AbortSignal } = {},
) {
  await wait(nextDelay(540), options.signal);
  maybeFail('login', 'Сервис аутентификации временно не отвечает. Попробуйте ещё раз.');

  const session = credentials[payload.email.trim().toLowerCase()];
  if (!session || payload.password !== 'react-ops') {
    throw new ApiError(
      'Неверный email или пароль. Используйте demo-учётки из README.',
      401,
      false,
    );
  }

  return clone(session);
}

export async function fetchDashboardSnapshot(options: { signal?: AbortSignal } = {}) {
  await wait(nextDelay(420), options.signal);
  maybeFail(
    'dashboard',
    'Dashboard snapshot не загрузился. Проверьте состояние сервера и повторите запрос.',
  );

  const snapshot: DashboardSnapshot = {
    summary: buildDashboardSummary(state.incidents),
    syncedAt: new Date().toISOString(),
  };

  return clone(snapshot);
}

export async function fetchActivityFeed(options: { signal?: AbortSignal } = {}) {
  await wait(nextDelay(560), options.signal);
  maybeFail(
    'activity',
    'Лента событий не ответила. Остальная часть экрана должна остаться живой.',
  );

  return clone(state.activity);
}

export async function fetchTeamLoad(options: { signal?: AbortSignal } = {}) {
  await wait(nextDelay(380), options.signal);
  maybeFail('team', 'Команда on-call сейчас недоступна. Повторите запрос позже.');

  const team: TeamLoadItem[] = buildTeamLoad(state.incidents);
  return clone(team);
}

export async function fetchIncidents(options: { signal?: AbortSignal } = {}) {
  await wait(nextDelay(700), options.signal);
  maybeFail('incidents', 'Список инцидентов не загрузился. Повторите запрос позже.');

  return clone(sortIncidents(state.incidents));
}

export async function fetchIncidentById(
  id: string,
  options: { signal?: AbortSignal } = {},
) {
  await wait(nextDelay(320), options.signal);
  maybeFail(
    'incidentDetail',
    'Детали инцидента не загрузились. Возможно, карточка была изменена или удалена.',
  );

  return clone(getIncidentOrThrow(id));
}

export async function createIncident(payload: CreateIncidentPayload) {
  await wait(nextDelay(780));
  maybeFail(
    'mutation',
    'Создание инцидента не удалось. Оптимистичное обновление будет откатано.',
  );

  return mutateState(() => {
    state.nextId += 1;
    const created = makeTemporaryIncident({
      id: `INC-${state.nextId}`,
      title: payload.title.trim(),
      service: payload.service.trim(),
      owner: payload.owner.trim(),
      priority: payload.priority,
      description: payload.description.trim(),
    });

    state.incidents.unshift(created);
    pushActivity({
      title: 'Incident created',
      body: `${created.id} появился в очереди ${created.service} и ждёт triage.`,
      tone: 'neutral',
    });

    return clone(created);
  });
}

export async function updateIncident(id: string, patch: UpdateIncidentPayload) {
  await wait(nextDelay(640));
  maybeFail(
    'mutation',
    'Сервер не принял изменение. Локальный optimistic state будет откатан.',
  );

  return mutateState(() => {
    const incident = getIncidentOrThrow(id);
    const previousStatus = incident.status;
    const previousOwner = incident.owner;

    Object.assign(incident, patch, { updatedAt: new Date().toISOString() });

    if (patch.status && patch.status !== previousStatus) {
      pushActivity({
        title: `${incident.id} status changed`,
        body: `Статус перешёл из ${previousStatus} в ${incident.status}.`,
        tone: incident.status === 'resolved' ? 'good' : 'warn',
      });
    } else if (patch.owner && patch.owner !== previousOwner) {
      pushActivity({
        title: `${incident.id} reassigned`,
        body: `Ответственный изменён: ${previousOwner} -> ${incident.owner}.`,
        tone: 'neutral',
      });
    }

    return clone(incident);
  });
}

export async function deleteIncident(id: string) {
  await wait(nextDelay(560));
  maybeFail(
    'mutation',
    'Удаление не удалось. Список должен восстановиться после rollback.',
  );

  return mutateState(() => {
    const incident = getIncidentOrThrow(id);
    state.incidents = state.incidents.filter((item) => item.id !== id);
    pushActivity({
      title: `${incident.id} archived`,
      body: `${incident.title} удалён из очереди реагирования.`,
      tone: 'neutral',
    });

    return { id };
  });
}
