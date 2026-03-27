export type UserRole = 'lead' | 'operator';

export type IncidentStatus = 'new' | 'investigating' | 'blocked' | 'resolved';

export type IncidentPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Session {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  owner: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  openCount: number;
  blockedCount: number;
  criticalCount: number;
  resolvedToday: number;
  averageAgeHours: number;
  activeOwners: number;
}

export interface DashboardSnapshot {
  summary: DashboardSummary;
  syncedAt: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  body: string;
  tone: 'neutral' | 'warn' | 'good';
  at: string;
}

export interface TeamLoadItem {
  id: string;
  name: string;
  focus: string;
  onCall: boolean;
  activeCount: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CreateIncidentPayload {
  title: string;
  service: string;
  owner: string;
  priority: IncidentPriority;
  description: string;
}

export interface UpdateIncidentPayload {
  title?: string;
  service?: string;
  owner?: string;
  priority?: IncidentPriority;
  status?: IncidentStatus;
  description?: string;
}

export interface IncidentFilters {
  status: IncidentStatus | 'all';
  priority: IncidentPriority | 'all';
  query: string;
}

export type ApiOperation =
  | 'login'
  | 'dashboard'
  | 'activity'
  | 'team'
  | 'incidents'
  | 'incidentDetail'
  | 'mutation';
