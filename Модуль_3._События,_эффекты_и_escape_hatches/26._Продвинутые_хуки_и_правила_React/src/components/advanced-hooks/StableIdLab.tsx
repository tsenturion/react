import { useState } from 'react';

import { useStableFieldIds } from '../../hooks/useStableFieldIds';
import { buildEphemeralFieldId } from '../../lib/id-model';
import { MetricCard } from '../ui';

function StableFormCard({ cardIndex }: { cardIndex: number }) {
  const ids = useStableFieldIds(`review-card-${cardIndex}`);
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Форма #{cardIndex + 1}</p>
      <div className="mt-4 grid gap-4">
        <div>
          <label htmlFor={ids.titleId} className="text-sm font-medium text-slate-700">
            Название сценария
          </label>
          <input
            id={ids.titleId}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
          />
        </div>

        <div>
          <label htmlFor={ids.ownerId} className="text-sm font-medium text-slate-700">
            Ответственная зона
          </label>
          <input
            id={ids.ownerId}
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
          />
        </div>

        <div>
          <label htmlFor={ids.notesId} className="text-sm font-medium text-slate-700">
            Наблюдения
          </label>
          <textarea
            id={ids.notesId}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
          />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Стабильные ids
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
          <li>{ids.titleId}</li>
          <li>{ids.ownerId}</li>
          <li>{ids.notesId}</li>
        </ul>
      </div>
    </article>
  );
}

export function StableIdLab() {
  const [renderTick, setRenderTick] = useState(1);
  const [cardsCount, setCardsCount] = useState(2);

  const unstablePreview = Array.from({ length: cardsCount }, (_, cardIndex) => ({
    cardIndex,
    ids: ['title', 'owner', 'notes'].map((field) =>
      buildEphemeralFieldId(renderTick, cardIndex, field),
    ),
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Стабильность ids"
          value="useId"
          hint="Повторный рендер не ломает label/input связи внутри уже смонтированного компонента."
          tone="cool"
        />
        <MetricCard
          label="Анти-паттерн"
          value="random id"
          hint="Id, вычисленный прямо в рендере, прыгает на каждом render tick."
          tone="accent"
        />
        <MetricCard
          label="Важно"
          value="Не для key"
          hint="Идентичность элементов списка всё ещё должна задаваться key."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Управление
            </p>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Количество форм
                </span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  value={cardsCount}
                  onChange={(event) => setCardsCount(Number(event.target.value))}
                  className="mt-2 w-full"
                />
                <span className="mt-2 block text-sm text-slate-600">{cardsCount}</span>
              </label>

              <button
                type="button"
                onClick={() => setRenderTick((current) => current + 1)}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Форсировать повторный рендер
              </button>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">Нестабильный preview</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Ниже ids, которые меняются вместе с render tick и поэтому не подходят для
              устойчивых DOM-связей.
            </p>
            <div className="mt-4 space-y-3">
              {unstablePreview.map((item) => (
                <div
                  key={`unstable-${item.cardIndex}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Render tick {renderTick} / card {item.cardIndex + 1}
                  </p>
                  <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
                    {item.ids.map((id) => (
                      <li key={id}>{id}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {Array.from({ length: cardsCount }, (_, cardIndex) => (
            <StableFormCard key={`stable-card-${cardIndex}`} cardIndex={cardIndex} />
          ))}
        </div>
      </div>
    </div>
  );
}
