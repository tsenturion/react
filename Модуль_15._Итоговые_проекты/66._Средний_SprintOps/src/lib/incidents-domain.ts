import type {
  DashboardSummary,
  Incident,
  IncidentFilters,
  IncidentPriority,
  IncidentStatus,
  TeamLoadItem,
  UserRole,
} from './types';

const priorityRank: Record<IncidentPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const teamDirectory = [
  { id: 'ava', name: 'Ава Чен', focus: 'Checkout API', onCall: true },
  { id: 'maks', name: 'Макс Петров', focus: 'Payments UI', onCall: false },
  { id: 'lina', name: 'Лина Орлова', focus: 'Notifications', onCall: true },
  { id: 'sam', name: 'Sam Ortega', focus: 'Fraud checks', onCall: false },
];

export const statusLabels: Record<IncidentStatus, string> = {
  new: 'Новый',
  investigating: 'В работе',
  blocked: 'Заблокирован',
  resolved: 'Решён',
};

export const priorityLabels: Record<IncidentPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const roleLabels: Record<UserRole, string> = {
  lead: 'Lead',
  operator: 'Operator',
};

export const statusTone: Record<IncidentStatus, 'slate' | 'blue' | 'amber' | 'green'> = {
  new: 'slate',
  investigating: 'blue',
  blocked: 'amber',
  resolved: 'green',
};

export const priorityTone: Record<IncidentPriority, 'slate' | 'blue' | 'amber' | 'rose'> =
  {
    low: 'slate',
    medium: 'blue',
    high: 'amber',
    critical: 'rose',
  };

export function sortIncidents(items: readonly Incident[]) {
  return [...items].sort((left, right) => {
    const priorityDelta = priorityRank[right.priority] - priorityRank[left.priority];

    if (priorityDelta !== 0) {
      return priorityDelta;
    }

    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });
}

export function filterIncidents(items: readonly Incident[], filters: IncidentFilters) {
  const query = filters.query.trim().toLowerCase();

  return items.filter((item) => {
    if (filters.status !== 'all' && item.status !== filters.status) {
      return false;
    }

    if (filters.priority !== 'all' && item.priority !== filters.priority) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack =
      `${item.title} ${item.service} ${item.owner} ${item.description}`.toLowerCase();
    return haystack.includes(query);
  });
}

export function buildDashboardSummary(items: readonly Incident[]): DashboardSummary {
  const now = Date.now();
  const openItems = items.filter((item) => item.status !== 'resolved');
  const resolvedToday = items.filter((item) => {
    if (item.status !== 'resolved') {
      return false;
    }

    return now - new Date(item.updatedAt).getTime() < 24 * 60 * 60 * 1000;
  }).length;

  const averageAgeHours = openItems.length
    ? Math.round(
        openItems.reduce((total, item) => {
          return total + (now - new Date(item.createdAt).getTime()) / (60 * 60 * 1000);
        }, 0) / openItems.length,
      )
    : 0;

  return {
    openCount: openItems.length,
    blockedCount: items.filter((item) => item.status === 'blocked').length,
    criticalCount: items.filter((item) => item.priority === 'critical').length,
    resolvedToday,
    averageAgeHours,
    activeOwners: new Set(openItems.map((item) => item.owner)).size,
  };
}

export function buildTeamLoad(items: readonly Incident[]): TeamLoadItem[] {
  return teamDirectory.map((member) => ({
    ...member,
    activeCount: items.filter(
      (item) => item.owner === member.name && item.status !== 'resolved',
    ).length,
  }));
}

export function makeTemporaryIncident(input: {
  id: string;
  title: string;
  service: string;
  owner: string;
  priority: IncidentPriority;
  description: string;
}): Incident {
  const stamp = new Date().toISOString();

  return {
    id: input.id,
    title: input.title,
    service: input.service,
    owner: input.owner,
    priority: input.priority,
    description: input.description,
    status: 'new',
    createdAt: stamp,
    updatedAt: stamp,
  };
}
