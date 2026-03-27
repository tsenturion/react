import { useSearchParams } from 'react-router-dom';

import { MetricCard, ProjectStudy, SectionIntro } from '../components/ui';
import {
  filterOverviewCardsByFocus,
  parseOverviewFocus,
  toolingComparisonRows,
} from '../lib/devtools-overview-model';
import { projectStudyByLab } from '../lib/project-study';

const overviewFilters = [
  { value: 'all', label: 'All' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'lint', label: 'Lint' },
  { value: 'rules', label: 'Rules' },
  { value: 'debugging', label: 'Debugging' },
  { value: 'quality', label: 'Quality' },
] as const;

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterOverviewCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Overview"
        title="Инструменты разработки работают лучше как единая система сигналов"
        copy="Этот урок связывает React DevTools, ESLint, Rules of React, profiler-style reasoning и тесты в один engineering loop. Здесь важно не просто открыть инструмент, а понять, в какой момент он должен подключаться и какой тип ошибки он помогает локализовать."
        aside={
          <MetricCard
            label="Focus"
            value={focus}
            hint="Фильтр живёт в URL, поэтому даже обзор темы уже ведёт себя как route-level state."
            tone="cool"
          />
        }
      />

      <section className="panel p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {overviewFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => {
                setSearchParams({ focus: filter.value });
              }}
              className={focus === filter.value ? 'chip chip-active' : 'chip'}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.id}
              className="rounded-[26px] border border-slate-200 bg-slate-50 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {card.focus}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.blurb}</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Why it matters
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {card.whyItMatters}
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    Typical mistake
                  </p>
                  <p className="mt-2 text-sm leading-6 text-amber-950">{card.caution}</p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Practical lens
                  </p>
                  <p className="mt-2 text-sm leading-6 text-emerald-950">
                    {card.practicalLens}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel p-5 sm:p-6">
        <h2 className="section-title">Как инструменты делят ответственность</h2>
        <p className="section-copy mt-3">
          Инструментальный стек не должен дублировать один и тот же сигнал. Хороший
          workflow распределяет вопросы по слоям: где наблюдать, где предотвращать, а где
          подтверждать исправление.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm leading-6 text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                <th className="px-3 py-3">Tool</th>
                <th className="px-3 py-3">Strength</th>
                <th className="px-3 py-3">Limit</th>
              </tr>
            </thead>
            <tbody>
              {toolingComparisonRows.map((row) => (
                <tr key={row.tool} className="border-b border-slate-100 align-top">
                  <td className="px-3 py-4 font-semibold text-slate-900">{row.tool}</td>
                  <td className="px-3 py-4">{row.strength}</td>
                  <td className="px-3 py-4 text-slate-500">{row.limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel p-5 sm:p-6">
        <ProjectStudy {...projectStudyByLab.overview} />
      </section>
    </div>
  );
}
