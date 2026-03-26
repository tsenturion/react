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
} from '../lib/server-functions-overview-domain';

const focusOptions: readonly { id: OverviewFocus; label: string }[] = [
  { id: 'all', label: 'Вся карта' },
  { id: 'mindset', label: 'Mental model' },
  { id: 'directives', label: 'Directives' },
  { id: 'flow', label: 'Flow' },
  { id: 'forms', label: 'Forms' },
  { id: 'limits', label: 'Limits' },
] as const;

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterOverviewCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Server Functions"
        title="Как думать о server/client boundaries, серверных функциях и формах как о едином full-stack потоке"
        copy="Эта тема не про замену одного `fetch` другим. Здесь важно понять, как директивы, формы и server-side логика собираются в новый способ проектировать full-stack React: где живёт интерактивность, где проходит серверная граница и какой код вообще должен исчезнуть."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">
              Server Function — это архитектурная граница, а не универсальный обработчик
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Она особенно сильна в submit-driven сценариях, но не должна подменять собой
              live typing, DOM APIs и всё клиентское поведение подряд.
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
        before="Сначала строят обычный client flow с `fetch`, локальными статусами и route handlers, а server functions пытаются прикрутить позже как косметическую замену одного вызова."
        afterTitle="Рабочее мышление"
        after="Сначала проектируют границу: где live interaction, где submit, где серверные правила и какие данные действительно должны пересечь сеть. После этого форма и server function собираются в более прямой full-stack поток."
      />

      <ProjectStudy
        files={projectStudyByLab.overview.files}
        snippets={projectStudyByLab.overview.snippets}
      />
    </div>
  );
}
