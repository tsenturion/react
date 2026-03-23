export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'layer'
  | 'cache'
  | 'stale'
  | 'mutations'
  | 'consistency'
  | 'architecture';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
}[] = [
  {
    id: 'layer',
    label: '1. Server vs client state',
    blurb: 'Где заканчивается локальный UI-state и начинается server-owned data.',
  },
  {
    id: 'cache',
    label: '2. Caching',
    blurb: 'Shared query cache, один query key и несколько UI-потребителей.',
  },
  {
    id: 'stale',
    label: '3. Stale and retries',
    blurb: 'StaleTime, retries и стратегия обращения с устаревающими данными.',
  },
  {
    id: 'mutations',
    label: '4. Mutations',
    blurb: 'useMutation, invalidation и mutation flow поверх server state.',
  },
  {
    id: 'consistency',
    label: '5. Consistency',
    blurb: 'Кэш и согласованность связанных query keys после server mutations.',
  },
  {
    id: 'architecture',
    label: '6. Architecture',
    blurb: 'Когда TanStack Query нужен, а когда ручной fetch-слой ещё достаточен.',
  },
] as const;
