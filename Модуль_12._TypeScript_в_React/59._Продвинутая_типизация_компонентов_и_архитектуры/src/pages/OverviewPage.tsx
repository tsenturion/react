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
  parseOverviewFocus,
  type OverviewFocus,
} from '../lib/advanced-typing-overview-domain';
import { projectStudyByLab } from '../lib/project-study';

const focusOptions: readonly { id: OverviewFocus; label: string }[] = [
  { id: 'all', label: 'Вся карта' },
  { id: 'reducers', label: 'Reducers' },
  { id: 'generics', label: 'Generics' },
  { id: 'polymorphic', label: 'Polymorphic' },
  { id: 'design-system', label: 'Design system' },
  { id: 'architecture', label: 'Architecture' },
] as const;

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterOverviewCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Advanced TypeScript"
        title="Как типы начинают проектировать сами компоненты, shared primitives и архитектурные границы"
        copy="В этой теме важнее всего увидеть, где advanced typing реально помогает: в reducers, reusable APIs, polymorphic primitives и design-system recipes. Тип должен усиливать контракт, а не превращать компонент в головоломку."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">
              Если тип трудно удержать, контракт, скорее всего, перегружен
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Поэтому урок постоянно сравнивает полезную выразительность типов и
              overengineering abstractions.
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
        beforeTitle="Без продвинутой типовой модели"
        before="Reducer принимает произвольные payload-объекты, reusable API копируются по месту, а shared primitives расплываются между button, link и div semantics."
        afterTitle="С продвинутой типовой моделью"
        after="Transitions оформлены как конечный action union, generic contracts фиксируют повторяемую форму, а design-system primitives явно показывают допустимые variants и semantics."
      />

      <ProjectStudy
        files={projectStudyByLab.overview.files}
        snippets={projectStudyByLab.overview.snippets}
      />
    </div>
  );
}
