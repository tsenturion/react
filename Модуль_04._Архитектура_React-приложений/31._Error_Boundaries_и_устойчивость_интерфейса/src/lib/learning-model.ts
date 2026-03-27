export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'boundaries'
  | 'isolation'
  | 'reset'
  | 'non-caught'
  | 'fallback'
  | 'architecture';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
}[] = [
  {
    id: 'boundaries',
    label: '1. Boundary basics',
    blurb: 'Как boundary перехватывает render-ошибку и заменяет subtree на fallback.',
  },
  {
    id: 'isolation',
    label: '2. Isolation',
    blurb:
      'Как placement boundary меняет blast radius и сколько интерфейса остаётся живым.',
  },
  {
    id: 'reset',
    label: '3. Reset strategies',
    blurb: 'Retry, resetKeys и remount через key: когда помогает каждый вариант.',
  },
  {
    id: 'non-caught',
    label: '4. What boundaries miss',
    blurb: 'Почему event handlers и async-код не попадают в boundary автоматически.',
  },
  {
    id: 'fallback',
    label: '5. Fallback UX',
    blurb: 'Как сделать fallback полезным, а не просто скрыть сбой под общим сообщением.',
  },
  {
    id: 'architecture',
    label: '6. Architecture',
    blurb: 'Где ставить boundaries, чтобы локализовать сбой и не раздуть архитектуру.',
  },
] as const;
