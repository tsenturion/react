export type LazyChunkId = 'glossary' | 'trace';
export type BoundaryMode = 'global' | 'local';

export const lazyChunks: readonly {
  id: LazyChunkId;
  label: string;
  purpose: string;
  delayMs: number;
}[] = [
  {
    id: 'glossary',
    label: 'Glossary chunk',
    purpose: 'Небольшой справочник терминов Suspense и use(Promise).',
    delayMs: 220,
  },
  {
    id: 'trace',
    label: 'Trace chunk',
    purpose: 'Разбор последовательности shell -> fallback -> reveal -> hydration.',
    delayMs: 420,
  },
] as const;

export function describeBoundaryMode(mode: BoundaryMode): string {
  if (mode === 'global') {
    return 'Одна общая граница удобнее в коде, но соседний lazy chunk может скрыть уже открытый блок.';
  }

  return 'Локальные границы сохраняют уже готовые части интерфейса, пока рядом загружается новый chunk.';
}
