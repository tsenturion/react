import { useSearchParams } from 'react-router-dom';

import {
  ProjectStudy,
  SectionIntro,
  StatusPill,
  BeforeAfter,
  Panel,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';
import {
  filterOverviewCardsByFocus,
  parseOverviewFocus,
  type OverviewFocus,
} from '../lib/suspense-overview-domain';

const focusOptions: readonly { id: OverviewFocus; label: string }[] = [
  { id: 'all', label: 'Вся карта' },
  { id: 'boundaries', label: 'Boundaries' },
  { id: 'lazy', label: 'lazy + Suspense' },
  { id: 'use', label: 'use(Promise)' },
  { id: 'server', label: 'Server Suspense' },
  { id: 'streaming', label: 'Streaming' },
] as const;

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterOverviewCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Suspense mental model"
        title="Как думать о Suspense как о системе reveal, а не как о «ещё одном loading state»"
        copy="Этот урок показывает Suspense на клиенте и сервере как способ проектировать ожидание по границам дерева. Здесь важны не только fallback-ы, но и размер границы, способ чтения ресурсов, code splitting и порядок доставки HTML."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Сначала проектируйте reveal, потом API</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Suspense полезен там, где экран должен раскрываться по частям. Если такого
              reveal нет, одна глобальная граница чаще всего только усложнит UI.
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
            </div>
          ))}
        </div>
      </Panel>

      <BeforeAfter
        beforeTitle="Хрупкое мышление"
        before="Экран проектируется как одна цельная загрузка, а Suspense добавляется потом поверх готового дерева ради формального fallback."
        afterTitle="Рабочее мышление"
        after="Сначала определяется, какие части экрана могут раскрываться независимо, что должно остаться видимым, а что действительно может временно уйти в ожидание."
      />

      <ProjectStudy
        files={projectStudyByLab.overview.files}
        snippets={projectStudyByLab.overview.snippets}
      />
    </div>
  );
}
