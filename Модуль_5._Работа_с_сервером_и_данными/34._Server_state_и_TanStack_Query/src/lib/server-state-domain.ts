export type CatalogResource = 'catalog' | 'mutation-board' | 'consistency-board';
export type CatalogScope = 'all' | 'published' | 'draft';
export type LessonTrack = 'foundations' | 'state' | 'effects';
export type LessonStatus = 'draft' | 'published';
export type FreshnessProfileId = 'aggressive' | 'balanced' | 'resilient';
export type ConsistencyScope = 'catalog-only' | 'catalog-and-summary';

export type LessonRecord = {
  id: string;
  title: string;
  track: LessonTrack;
  status: LessonStatus;
  seats: number;
  owner: string;
};

export type RequestMeta = {
  requestNo: number;
  serverVersion: number;
  fetchedAt: number;
};

export type CatalogResponse = {
  items: LessonRecord[];
  meta: RequestMeta;
};

export type SummaryResponse = {
  draftCount: number;
  publishedCount: number;
  totalSeats: number;
  meta: RequestMeta;
};

export type HealthSnapshot = {
  status: 'healthy' | 'slow' | 'recovering';
  note: string;
  meta: RequestMeta & {
    attempt: number;
  };
};

export const trackLabels: Record<LessonTrack, string> = {
  foundations: 'Foundations',
  state: 'State',
  effects: 'Effects',
};
