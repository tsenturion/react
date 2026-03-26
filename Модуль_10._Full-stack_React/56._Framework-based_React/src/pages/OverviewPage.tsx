import { useSearchParams } from 'react-router-dom';

import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';
import {
  filterOverviewCardsByFocus,
  parseOverviewFocus,
  type OverviewFocus,
} from '../lib/framework-overview-domain';

const focusOptions: readonly { id: OverviewFocus; label: string }[] = [
  { id: 'all', label: 'Вся карта' },
  { id: 'framework', label: 'Framework' },
  { id: 'routes', label: 'Routes' },
  { id: 'data', label: 'Data' },
  { id: 'rendering', label: 'Rendering' },
  { id: 'direction', label: 'Direction' },
] as const;

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterOverviewCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Framework-based React"
        title="Как мыслить о React-приложении, когда framework владеет маршрутами, данными, серверной логикой и rendering pipeline"
        copy="Эта тема нужна, чтобы выйти за пределы мышления “React плюс несколько библиотек”. Здесь важно увидеть, как framework меняет структуру проекта, ownership экрана и сам способ проектировать full-stack React."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">
              Framework — это архитектурная поверхность, а не просто удобный CLI
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Если routing, server rendering, forms и data loading уже влияют на
              архитектуру продукта, их выгоднее рассматривать как одну систему.
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
        beforeTitle="Старое мышление"
        before="Сначала собирают SPA из routing-библиотеки, fetch-хуков, SSR-плагинов и отдельных серверных решений, а затем пытаются задним числом назвать это “архитектурой”."
        afterTitle="Framework-first мышление"
        after="Сначала решают, какая framework surface владеет маршрутом, данными, rendering и мутациями. После этого структура проекта становится следствием выбранного подхода, а не случайным компромиссом."
      />

      <ProjectStudy
        files={projectStudyByLab.overview.files}
        snippets={projectStudyByLab.overview.snippets}
      />
    </div>
  );
}
