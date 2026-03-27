import { useSearchParams } from 'react-router-dom';

import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import {
  concurrentGuideCards,
  filterGuideCardsByFocus,
  parseOverviewFocus,
} from '../lib/concurrent-domain';
import { projectStudyByLab } from '../lib/project-study';

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterGuideCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Concurrent overview"
        title="Concurrent React помогает не уменьшать работу магически, а перераспределять её приоритеты"
        copy="В этой теме важно смотреть на `useTransition`, `startTransition` и `useDeferredValue` как на инструменты для разделения срочного feedback и тяжёлой несрочной визуальной работы. Они особенно заметны в поиске, фильтрации, вводе и списках."
        aside={
          <MetricCard
            label="Guide cards"
            value={`${concurrentGuideCards.length}`}
            hint="Карта темы разбита по практическим сигналам: priorities, transitions, deferred updates, heavy lists и trade-offs."
            tone="accent"
          />
        }
      />

      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Все сигналы' },
            { value: 'priorities', label: 'Priorities' },
            { value: 'transitions', label: 'Transitions' },
            { value: 'deferred', label: 'Deferred' },
            { value: 'lists', label: 'Lists' },
            { value: 'tradeoffs', label: 'Trade-offs' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setSearchParams({ focus: item.value })}
              className={focus === item.value ? 'chip chip-active' : 'chip'}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.id}
              className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {card.focus}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.summary}</p>
              <p className="mt-3 text-sm leading-6 text-slate-800">
                <strong>Почему это важно:</strong> {card.whyItMatters}
              </p>
            </article>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Сначала вопрос"
          value="что срочно?"
          hint="Input, cursor, quick feedback и маленькие shell updates часто должны оставаться мгновенными."
          tone="accent"
        />
        <MetricCard
          label="Потом вопрос"
          value="что может подождать?"
          hint="Список, сортировка, тяжёлый экран и вторичный visual update нередко можно перевести в background work."
          tone="cool"
        />
        <MetricCard
          label="И только потом API"
          value="transition or deferred?"
          hint="Выбор инструмента идёт от сценария: нужен ли pending flag, может ли consumer lag behind и где стартует update."
          tone="dark"
        />
      </div>

      <ProjectStudy {...projectStudyByLab.overview} />
    </div>
  );
}
