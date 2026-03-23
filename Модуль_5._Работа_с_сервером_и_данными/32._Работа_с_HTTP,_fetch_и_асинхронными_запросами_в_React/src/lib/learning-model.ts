export type StatusTone = 'success' | 'warn' | 'error';

export type LabId = 'http' | 'states' | 'lifecycle' | 'retry' | 'race' | 'architecture';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
}[] = [
  {
    id: 'http',
    label: '1. HTTP basics',
    blurb:
      'Как GET-запрос, query, статус ответа и payload связываются с клиентским кодом.',
  },
  {
    id: 'states',
    label: '2. UI states',
    blurb: 'Loading, error, empty и success states на реальном fetch-хуке.',
  },
  {
    id: 'lifecycle',
    label: '3. Request lifecycle',
    blurb: 'Idle, loading, success, error и aborted как явные состояния запроса.',
  },
  {
    id: 'retry',
    label: '4. Retries & abort',
    blurb:
      'Когда retry уместен, как работает abort и почему они должны жить рядом с запросом.',
  },
  {
    id: 'race',
    label: '5. Race conditions',
    blurb:
      'Как устаревшие ответы ломают интерфейс и как abort плюс stale-guard это исправляют.',
  },
  {
    id: 'architecture',
    label: '6. Architecture',
    blurb: 'Как вынести data fetching из useEffect-хаоса в читаемую и устойчивую модель.',
  },
] as const;
