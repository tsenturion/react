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
} from '../lib/external-data-overview-domain';
import { projectStudyByLab } from '../lib/project-study';

const focusOptions: readonly { id: OverviewFocus; label: string }[] = [
  { id: 'all', label: 'Вся карта' },
  { id: 'schemas', label: 'Schemas' },
  { id: 'requests', label: 'Requests' },
  { id: 'mutations', label: 'Mutations' },
  { id: 'routes', label: 'Routes' },
  { id: 'maintenance', label: 'Maintenance' },
] as const;

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterOverviewCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="External data typing"
        title="Как сочетать TypeScript и runtime validation так, чтобы внешние данные не разрушали интерфейс тихо и поздно"
        copy="В этой теме важно увидеть, что TypeScript прекрасно работает внутри уже проверенного кода, но не может сам подтвердить форму внешнего payload. Поэтому schema — это не избыточная надстройка, а точка входа доверия в приложение."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">`as SomeType` не валидирует payload</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Каст меняет мнение компилятора, но не меняет реальную форму пришедших
              данных.
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
        beforeTitle="Без runtime boundary"
        before="Приложение кастует payload к ожидаемому типу, request считается успешным уже после `.json()`, а route loader и форма доверяют данным без проверки."
        afterTitle="С runtime boundary"
        after="Каждый внешний вход проходит через schema parse, request state различает network и schema errors, а route и mutation опираются только на уже проверенные данные."
      />

      <ProjectStudy
        files={projectStudyByLab.overview.files}
        snippets={projectStudyByLab.overview.snippets}
      />
    </div>
  );
}
