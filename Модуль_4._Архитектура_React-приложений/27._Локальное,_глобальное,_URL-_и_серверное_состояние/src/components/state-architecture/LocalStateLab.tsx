import clsx from 'clsx';
import { useState } from 'react';

import { localDraftCards } from '../../lib/state-domain';
import { MetricCard } from '../ui';

function DraftCard({
  title,
  summary,
  mode,
  sharedDraft,
  onSharedDraftChange,
}: {
  title: string;
  summary: string;
  mode: 'local' | 'lifted';
  sharedDraft: string;
  onSharedDraftChange: (value: string) => void;
}) {
  const [localDraft, setLocalDraft] = useState('');
  const [expanded, setExpanded] = useState(false);

  const draftValue = mode === 'local' ? localDraft : sharedDraft;
  const updateDraft = mode === 'local' ? setLocalDraft : onSharedDraftChange;

  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{summary}</p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className={clsx(
            'rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition',
            expanded
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          )}
        >
          {expanded ? 'Скрыть' : 'Открыть'}
        </button>
      </div>

      {expanded ? (
        <div className="mt-4 space-y-3">
          <textarea
            value={draftValue}
            onChange={(event) => updateDraft(event.target.value)}
            rows={4}
            placeholder="Незавершённый черновик"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-400"
          />
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {mode === 'local'
              ? 'Этот черновик живёт только внутри одной карточки.'
              : 'Теперь черновик поднят выше и начинает протекать в остальные карточки.'}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function LocalStateLab() {
  const [mode, setMode] = useState<'local' | 'lifted'>('local');
  const [sharedDraft, setSharedDraft] = useState('');

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Правильный владелец"
          value="Ближайшая ветка"
          hint="Если состояние нужно только одной карточке, не поднимайте его выше без причины."
          tone="cool"
        />
        <MetricCard
          label="Анти-паттерн"
          value="Lift too high"
          hint="Слишком высокий владелец связывает независимые куски UI."
          tone="accent"
        />
        <MetricCard
          label="Сигнал"
          value="Эфемерный draft"
          hint="Незавершённый ввод редко должен становиться global state."
        />
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['local', 'Локально рядом с карточкой'],
              ['lifted', 'Поднять выше и сломать изоляцию'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={clsx(
                'rounded-xl px-4 py-3 text-sm font-medium transition',
                mode === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {localDraftCards.map((card) => (
          <DraftCard
            key={card.id}
            title={card.title}
            summary={card.summary}
            mode={mode}
            sharedDraft={sharedDraft}
            onSharedDraftChange={setSharedDraft}
          />
        ))}
      </div>
    </div>
  );
}
