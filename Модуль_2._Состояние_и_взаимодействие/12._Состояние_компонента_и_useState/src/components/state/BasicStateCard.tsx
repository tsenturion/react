import { useState } from 'react';

import { buildBasicStateReport } from '../../lib/basic-state-model';
import { StatusPill } from '../ui';

export function BasicStateCard() {
  // Эти значения разделены намеренно: каждое отвечает за свой аспект UI
  // и обновляется независимо, без искусственного объединения в один объект.
  const [likes, setLikes] = useState(12);
  const [bookmarked, setBookmarked] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const report = buildBasicStateReport({ likes, bookmarked, expanded });

  return (
    <article className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            local state
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            Карточка урока useState
          </h3>
        </div>
        <StatusPill tone={report.tone}>{report.reactionLabel}</StatusPill>
      </div>

      <div className="flex flex-wrap gap-3">
        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
          Лайков: {likes}
        </span>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
          {bookmarked ? 'В закладках' : 'Без закладки'}
        </span>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
          {expanded ? 'Описание открыто' : 'Описание скрыто'}
        </span>
      </div>

      {expanded ? (
        <p className="text-sm leading-6 text-slate-600">
          Этот компонент сам хранит своё локальное состояние: число реакций, статус
          закладки и видимость подробностей.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setLikes((current) => current + 1)}
          className="chip"
        >
          Добавить реакцию
        </button>
        <button
          type="button"
          onClick={() => setBookmarked((current) => !current)}
          className="chip"
        >
          Переключить закладку
        </button>
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="chip"
        >
          Показать или скрыть детали
        </button>
      </div>
    </article>
  );
}
