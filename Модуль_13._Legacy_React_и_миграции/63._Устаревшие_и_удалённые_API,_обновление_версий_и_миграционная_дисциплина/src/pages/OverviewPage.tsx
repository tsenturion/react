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
  migrationComparisonRows,
  parseOverviewFocus,
  type OverviewFocus,
} from '../lib/migration-overview-model';
import { projectStudyByLab } from '../lib/project-study';

const focusOptions: readonly { id: OverviewFocus; label: string }[] = [
  { id: 'all', label: 'Вся карта' },
  { id: 'dom', label: 'DOM APIs' },
  { id: 'upgrade', label: '18.3 → 19' },
  { id: 'channels', label: 'Channels' },
  { id: 'tests', label: 'Tests' },
  { id: 'workflow', label: 'Workflow' },
] as const;

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterOverviewCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Migration map"
        title="Миграция React-версии — это проверка предположений о системе, а не механическая замена устаревших вызовов"
        copy="В этой теме важно смотреть не только на deprecated API, но и на ту модель приложения, которая за ними скрыта: как создаётся root, где живут assumptions про refs и forms, какие тесты реально защищают критические сценарии и какой release channel вообще уместен для конкретного этапа изменений."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">18.3 is a bridge</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              React 18.3 здесь рассматривается как полезный аудит-этап перед переходом на
              19, а не как формальная остановка между версиями.
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
                <StatusPill
                  tone={
                    card.focus === 'tests' || card.focus === 'workflow'
                      ? 'success'
                      : card.focus === 'channels'
                        ? 'warn'
                        : 'error'
                  }
                >
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
                  Зрелая альтернатива
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-950">
                  {card.modernAlternative}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <th className="px-4">Поверхностный взгляд</th>
              <th className="px-4">Зрелый взгляд</th>
              <th className="px-4">Выигрыш</th>
            </tr>
          </thead>
          <tbody>
            {migrationComparisonRows.map((row) => (
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
      </Panel>

      <BeforeAfter
        beforeTitle="Механическая миграция"
        before="Deprecated API заменили, сборка прошла, значит обновление завершено."
        afterTitle="Дисциплинированная миграция"
        after="Собрали warnings, поняли старые assumptions, закрыли tests на критические сценарии и только после этого выкатываем новую версию."
      />

      <ProjectStudy
        files={projectStudyByLab.overview.files}
        snippets={projectStudyByLab.overview.snippets}
      />
    </div>
  );
}
