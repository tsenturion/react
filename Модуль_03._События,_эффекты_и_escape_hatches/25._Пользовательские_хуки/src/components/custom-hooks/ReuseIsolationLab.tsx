import clsx from 'clsx';

import { useDisclosure } from '../../hooks/useDisclosure';
import { disclosureTopics } from '../../lib/custom-hooks-domain';
import { MetricCard } from '../ui';

function DisclosureCard({
  title,
  summary,
  detail,
}: {
  title: string;
  summary: string;
  detail: string;
}) {
  const disclosure = useDisclosure(false);

  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{summary}</p>
        </div>
        <button
          type="button"
          onClick={disclosure.toggle}
          className={clsx(
            'rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition',
            disclosure.isOpen
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          )}
        >
          {disclosure.isOpen ? 'Скрыть' : 'Открыть'}
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Состояние этой карточки
        </p>
        <p className="mt-2 text-sm text-slate-700">
          {disclosure.isOpen ? 'Открыта' : 'Закрыта'}
        </p>
      </div>

      {disclosure.isOpen ? (
        <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          {detail}
        </div>
      ) : null}
    </article>
  );
}

export function ReuseIsolationLab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Один hook"
          value="useDisclosure"
          hint="Одна и та же логика переиспользуется без копирования внутреннего state."
        />
        <MetricCard
          label="Экземпляров"
          value={String(disclosureTopics.length)}
          hint="Каждый вызов hook-а живёт в своей позиции дерева."
          tone="accent"
        />
        <MetricCard
          label="Общий state?"
          value="Нет"
          hint="Открытие одной карточки не меняет соседние."
          tone="cool"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {disclosureTopics.map((topic) => (
          <DisclosureCard
            key={topic.id}
            title={topic.title}
            summary={topic.summary}
            detail={topic.detail}
          />
        ))}
      </div>
    </div>
  );
}
