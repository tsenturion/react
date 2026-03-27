import { useSearchParams } from 'react-router-dom';

import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  filterOverviewCardsByFocus,
  legacyApiComparisonRows,
  parseOverviewFocus,
  type OverviewFocus,
} from '../lib/legacy-api-overview-model';
import { projectStudyByLab } from '../lib/project-study';

const focusOptions: readonly { id: OverviewFocus; label: string }[] = [
  { id: 'all', label: 'Вся карта' },
  { id: 'children', label: 'Children' },
  { id: 'elements', label: 'Elements' },
  { id: 'refs', label: 'Refs' },
  { id: 'context', label: 'Context' },
  { id: 'migration', label: 'Migration' },
] as const;

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterOverviewCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Legacy API map"
        title="Как читать legacy API через современную оптику: не по названию функции, а по цене неявности и пути миграции"
        copy="В этой теме важно не просто помнить список старых React API. Нужно видеть, что именно они делают с прозрачностью компонента: скрывают структуру children, модифицируют дочерние элементы, пробрасывают imperative доступ или усложняют чтение provider boundaries."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Legacy не равно useless</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Эти API редко проектируют в новом коде, но их до сих пор регулярно читают,
              поддерживают и постепенно мигрируют.
            </p>
          </div>
        }
      />

      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {focusOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.set('focus', option.id);
                setSearchParams(next);
              }}
              className={`chip ${focus === option.id ? 'chip-active' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                <StatusPill tone={card.focus === 'migration' ? 'success' : 'warn'}>
                  {card.focus}
                </StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.blurb}</p>
              <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Почему это важно
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {card.whyItMatters}
                </p>
              </div>
              <div className="mt-4 rounded-[20px] border border-rose-200 bg-rose-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                  Типичная ловушка
                </p>
                <p className="mt-2 text-sm leading-6 text-rose-950">{card.caution}</p>
              </div>
              <div className="mt-4 rounded-[20px] border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Современная альтернатива
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-950">
                  {card.modernAlternative}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                <th className="px-4">Legacy API</th>
                <th className="px-4">Современная замена</th>
                <th className="px-4">Причина</th>
              </tr>
            </thead>
            <tbody>
              {legacyApiComparisonRows.map((row) => (
                <tr key={row.legacy} className="rounded-2xl bg-slate-50">
                  <td className="rounded-l-2xl px-4 py-4 text-sm font-semibold text-slate-900">
                    {row.legacy}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">{row.modern}</td>
                  <td className="rounded-r-2xl px-4 py-4 text-sm leading-6 text-slate-600">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Что важно вынести из overview
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              Legacy API чаще всего добавляют мощность ценой неявности.
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              Главное сравнение идёт не по возрасту API, а по прозрачности data flow.
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              Migration почти всегда безопаснее, чем резкое переписывание всего слоя.
            </li>
          </ul>
        </div>
      </Panel>

      <BeforeAfter
        beforeTitle="Legacy-first чтение"
        before="API воспринимается как набор экзотических функций React, которые нужно просто запомнить по отдельности."
        afterTitle="Architecture-first чтение"
        after="Каждая поверхность читается как компромисс: где именно спрятана структура, кто владеет контрактом и какая замена сделает систему прозрачнее."
      />

      <ProjectStudy
        files={projectStudyByLab.overview.files}
        snippets={projectStudyByLab.overview.snippets}
      />
    </div>
  );
}
