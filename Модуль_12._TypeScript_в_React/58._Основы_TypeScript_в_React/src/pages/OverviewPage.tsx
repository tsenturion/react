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
} from '../lib/typescript-overview-domain';

const focusOptions: readonly { id: OverviewFocus; label: string }[] = [
  { id: 'all', label: 'Вся карта' },
  { id: 'contracts', label: 'Contracts' },
  { id: 'events', label: 'Events' },
  { id: 'refs', label: 'Refs' },
  { id: 'states', label: 'UI states' },
  { id: 'architecture', label: 'Architecture' },
] as const;

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterOverviewCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="TypeScript in React"
        title="Как смотреть на типы не как на отдельный слой формальностей, а как на часть самого дизайна интерфейса"
        copy="В этой теме важно увидеть, что props, events, refs и состояния интерфейса становятся более предсказуемыми не потому, что 'есть TypeScript', а потому, что типы заставляют оформлять модель компонента честнее."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">
              Ошибка типа часто полезнее позднего runtime-бага
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Она подсказывает, что API компонента, форма события или ветки состояния пока
              ещё недостаточно продуманы.
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
        beforeTitle="Без типовой модели"
        before="Компоненты принимают расплывчатые props, события читают значения из случайных полей, а ветки интерфейса описываются несколькими слабо связанными boolean-флагами."
        afterTitle="С типовой моделью"
        after="Компонент получает ясный контракт, событие связано с конкретным DOM-источником, а UI-состояния оформлены как конечные, проверяемые ветки одной модели."
      />

      <ProjectStudy
        files={projectStudyByLab.overview.files}
        snippets={projectStudyByLab.overview.snippets}
      />
    </div>
  );
}
