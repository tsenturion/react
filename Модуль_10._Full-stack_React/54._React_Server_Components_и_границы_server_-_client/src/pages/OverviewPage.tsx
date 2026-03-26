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
} from '../lib/rsc-overview-domain';

const focusOptions: readonly { id: OverviewFocus; label: string }[] = [
  { id: 'all', label: 'Вся карта' },
  { id: 'mindset', label: 'Mental model' },
  { id: 'execution', label: 'Execution' },
  { id: 'async', label: 'Async server' },
  { id: 'composition', label: 'Composition' },
  { id: 'bundle', label: 'Bundle' },
] as const;

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterOverviewCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="React Server Components"
        title="Как думать о mixed tree: что исполняется на сервере, что на клиенте и где проходит реальная граница"
        copy="Эта тема не про формальные директивы ради сборщика. Здесь важно понять, как server/client boundary меняет среду выполнения, доступ к данным, размер bundle, hydration pressure и саму структуру mixed приложения."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">
              Server — это среда исполнения, а не просто место рендера
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              После пересечения boundary меняются доступные APIs, возможность читать
              приватные данные и цена каждого интерактивного участка.
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
        before="Компоненты сначала собирают как обычный client tree, а server/client директивы появляются только после ошибок сборки или проблем с bundle."
        afterTitle="Рабочее мышление"
        after="Сначала проектируется среда исполнения каждого блока: где живут данные, где нужна интерактивность, что обязано гидрироваться и какой кусок дерева должен остаться server-only."
      />

      <ProjectStudy
        files={projectStudyByLab.overview.files}
        snippets={projectStudyByLab.overview.snippets}
      />
    </div>
  );
}
