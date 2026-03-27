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
  legacyVsHooksRows,
  parseOverviewFocus,
  type OverviewFocus,
} from '../lib/legacy-overview-model';
import { placesYouStillMeetClasses } from '../lib/legacy-playbook-model';
import { projectStudyByLab } from '../lib/project-study';

const focusOptions: readonly { id: OverviewFocus; label: string }[] = [
  { id: 'all', label: 'Вся карта' },
  { id: 'state', label: 'State' },
  { id: 'lifecycle', label: 'Lifecycle' },
  { id: 'refs', label: 'Refs' },
  { id: 'rendering', label: 'Rendering' },
  { id: 'maintenance', label: 'Maintenance' },
] as const;

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterOverviewCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Legacy React mental model"
        title="Как читать class-based React сегодня: не как устаревший синтаксис, а как другую модель причин, фаз и ответственности"
        copy="Старый React держится на трёх опорах: state в экземпляре, lifecycle methods для побочных эффектов и refs как imperatively bridge к DOM. Эта тема важна не ради ностальгии, а ради уверенного чтения и поддержки legacy-кода."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Error boundaries всё ещё class-based</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Даже в современном React часть инфраструктурных API до сих пор опирается на
              классы.
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
                <StatusPill tone="warn">{card.focus}</StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.blurb}</p>
              <p className="mt-4 text-sm leading-6 text-slate-700">{card.whyItMatters}</p>
              <div className="mt-4 rounded-[20px] border border-rose-200 bg-rose-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                  Типичный сбой
                </p>
                <p className="mt-2 text-sm leading-6 text-rose-950">
                  {card.typicalFailure}
                </p>
              </div>
              <div className="mt-4 rounded-[20px] border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Современная оптика
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-950">
                  {card.modernLens}
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-950">
                  {card.stillSeenWhere}
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
                <th className="px-4">Legacy React</th>
                <th className="px-4">Современная оптика</th>
                <th className="px-4">Зачем сравнивать</th>
              </tr>
            </thead>
            <tbody>
              {legacyVsHooksRows.map((row) => (
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
            Где вы ещё встретите classes
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {placesYouStillMeetClasses.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      <BeforeAfter
        beforeTitle="Старая ментальная модель"
        before="Вы думаете фазами экземпляра: mount, update, unmount; state живёт в this.state; refs и lifecycle methods обслуживают side effects явно."
        afterTitle="Современная ментальная модель"
        after="Вы думаете синхронизацией состояния и эффектов, но всё ещё должны уметь распознать те же причины поведения в class-based коде."
      />

      <ProjectStudy
        files={projectStudyByLab.overview.files}
        snippets={projectStudyByLab.overview.snippets}
      />
    </div>
  );
}
