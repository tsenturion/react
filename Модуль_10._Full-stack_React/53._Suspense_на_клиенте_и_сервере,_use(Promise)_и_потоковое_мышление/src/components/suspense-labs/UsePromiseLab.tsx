import { Suspense, use, useState } from 'react';

import { studyCards, type StudyCardId } from '../../lib/suspense-resource-model';
import {
  readStudyCardBundle,
  readStudyCardSegment,
} from '../../lib/suspense-resource-store';
import { MetricCard, Panel, StatusPill } from '../ui';

type ReadingMode = 'shared' | 'segmented';

function SharedSummary({ cardId, revision }: { cardId: StudyCardId; revision: number }) {
  const card = use(readStudyCardBundle(cardId, revision));

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{card.label}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-700">{card.summary}</p>
    </div>
  );
}

function SharedServer({ cardId, revision }: { cardId: StudyCardId; revision: number }) {
  const card = use(readStudyCardBundle(cardId, revision));

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Server angle</h3>
      <p className="mt-3 text-sm leading-6 text-slate-700">{card.server}</p>
    </div>
  );
}

function SegmentedPanel({
  cardId,
  segment,
  revision,
  title,
}: {
  cardId: StudyCardId;
  segment: 'summary' | 'server';
  revision: number;
  title: string;
}) {
  const text = use(readStudyCardSegment(cardId, segment, revision));

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-700">{text}</p>
    </div>
  );
}

function PromiseFallback({ label }: { label: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Suspense boundary держит ожидание локально, пока promise ещё pending.
      </p>
    </div>
  );
}

export function UsePromiseLab() {
  const [cardId, setCardId] = useState<StudyCardId>('use-promise');
  const [mode, setMode] = useState<ReadingMode>('shared');
  const [revision, setRevision] = useState(0);

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Resource reading</span>
          <p className="text-sm leading-6 text-slate-600">
            Здесь один и тот же образовательный ресурс можно читать либо через общий
            cached promise, либо через несколько независимых promise-ов с отдельным
            временем готовности.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-wrap gap-2">
            {studyCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => setCardId(card.id)}
                className={`chip ${cardId === card.id ? 'chip-active' : ''}`}
              >
                {card.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button
              type="button"
              onClick={() => setMode('shared')}
              className={`chip ${mode === 'shared' ? 'chip-active' : ''}`}
            >
              Shared resource
            </button>
            <button
              type="button"
              onClick={() => setMode('segmented')}
              className={`chip ${mode === 'segmented' ? 'chip-active' : ''}`}
            >
              Раздельные ресурсы
            </button>
            <button
              type="button"
              onClick={() => setRevision((current) => current + 1)}
              className="chip"
            >
              Новый revision
            </button>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Mode"
          value={mode === 'shared' ? 'Shared promise' : 'Separate promises'}
          hint="Меняет, делят ли панели одно и то же ожидание."
          tone="accent"
        />
        <MetricCard
          label="Revision"
          value={String(revision)}
          hint="Новый revision меняет cache key и запускает новое чтение ресурса."
          tone="cool"
        />
        <div className="panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Разница механики
          </p>
          <div className="mt-3">
            <StatusPill tone={mode === 'shared' ? 'success' : 'warn'}>
              {mode === 'shared'
                ? 'Оба блока читают один promise'
                : 'Каждый блок ждёт свой promise'}
            </StatusPill>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Общий cache key устраняет дублирование ожидания. Раздельные ключи полезны
            только тогда, когда ресурс действительно разный.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {mode === 'shared' ? (
          <>
            <Suspense fallback={<PromiseFallback label="Shared summary ждёт bundle" />}>
              <SharedSummary cardId={cardId} revision={revision} />
            </Suspense>
            <Suspense
              fallback={
                <PromiseFallback label="Shared server panel ждёт тот же bundle" />
              }
            >
              <SharedServer cardId={cardId} revision={revision} />
            </Suspense>
          </>
        ) : (
          <>
            <Suspense fallback={<PromiseFallback label="Summary ждёт свой resource" />}>
              <SegmentedPanel
                cardId={cardId}
                segment="summary"
                revision={revision}
                title="Summary segment"
              />
            </Suspense>
            <Suspense
              fallback={<PromiseFallback label="Server angle ждёт другой resource" />}
            >
              <SegmentedPanel
                cardId={cardId}
                segment="server"
                revision={revision}
                title="Server angle"
              />
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
}
