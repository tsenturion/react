import { lazy, Suspense, useState } from 'react';

import {
  describeBoundaryMode,
  lazyChunks,
  type BoundaryMode,
} from '../../lib/lazy-boundary-model';
import { MetricCard, Panel, StatusPill } from '../ui';

function delayImport<T>(loader: () => Promise<T>, delayMs: number): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      void loader().then(resolve);
    }, delayMs);
  });
}

const LazyGlossaryChunk = lazy(() =>
  delayImport(() => import('../suspense-chunks/GlossaryChunk'), 220),
);
const LazyTraceChunk = lazy(() =>
  delayImport(() => import('../suspense-chunks/TraceChunk'), 420),
);

function ChunkFallback({ label }: { label: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        React.lazy ждёт загрузки chunk-кода через Suspense boundary.
      </p>
    </div>
  );
}

export function LazyBoundaryLab() {
  const [boundaryMode, setBoundaryMode] = useState<BoundaryMode>('local');
  const [showGlossary, setShowGlossary] = useState(false);
  const [showTrace, setShowTrace] = useState(false);

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">lazy + Suspense</span>
          <p className="text-sm leading-6 text-slate-600">
            Здесь Suspense ждёт не данные, а сам код lazy-chunk. Смотрите, как выбранная
            граница влияет на уже открытый рядом контент.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setBoundaryMode('global')}
            className={`chip ${boundaryMode === 'global' ? 'chip-active' : ''}`}
          >
            Общая граница
          </button>
          <button
            type="button"
            onClick={() => setBoundaryMode('local')}
            className={`chip ${boundaryMode === 'local' ? 'chip-active' : ''}`}
          >
            Локальные границы
          </button>
          <button
            type="button"
            onClick={() => setShowGlossary((value) => !value)}
            className="chip"
          >
            {showGlossary ? 'Скрыть glossary' : 'Открыть glossary'}
          </button>
          <button
            type="button"
            onClick={() => setShowTrace((value) => !value)}
            className="chip"
          >
            {showTrace ? 'Скрыть trace' : 'Открыть trace'}
          </button>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-600">
            {describeBoundaryMode(boundaryMode)}
          </p>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Boundary mode"
          value={boundaryMode === 'global' ? 'Global' : 'Local'}
          hint="Определяет, может ли один lazy-chunk скрыть соседний уже открытый блок."
          tone="accent"
        />
        <MetricCard
          label="Chunks"
          value={lazyChunks
            .map((chunk) => `${chunk.label}: ${chunk.delayMs}ms`)
            .join(' | ')}
          hint="Первое открытие ждёт код chunk; повторное открытие уже использует кэш браузера и модуля."
          tone="dark"
        />
        <div className="panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Важная граница
          </p>
          <div className="mt-3">
            <StatusPill tone={boundaryMode === 'local' ? 'success' : 'warn'}>
              {boundaryMode === 'local'
                ? 'Открытый блок остаётся на экране'
                : 'Один новый lazy chunk может скрыть соседний'}
            </StatusPill>
          </div>
        </div>
      </div>

      {boundaryMode === 'global' ? (
        <Suspense fallback={<ChunkFallback label="Глобальный fallback активен" />}>
          <div className="grid gap-4 lg:grid-cols-2">
            {showGlossary ? <LazyGlossaryChunk /> : null}
            {showTrace ? <LazyTraceChunk /> : null}
          </div>
        </Suspense>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            {showGlossary ? (
              <Suspense fallback={<ChunkFallback label="Glossary chunk грузится" />}>
                <LazyGlossaryChunk />
              </Suspense>
            ) : (
              <ChunkFallback label="Glossary chunk закрыт" />
            )}
          </div>
          <div>
            {showTrace ? (
              <Suspense fallback={<ChunkFallback label="Trace chunk грузится" />}>
                <LazyTraceChunk />
              </Suspense>
            ) : (
              <ChunkFallback label="Trace chunk закрыт" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
