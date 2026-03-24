import { useSearchParams } from 'react-router-dom';

import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import {
  filterGuideCardsByFocus,
  parseOverviewFocus,
  performanceGuideCards,
} from '../lib/performance-domain';
import { projectStudyByLab } from '../lib/project-study';

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterGuideCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Performance overview"
        title="Смотрите не на число рендеров вообще, а на их причину и цену"
        copy="В этой теме важно научиться отделять полезный ререндер от лишнего, понимать, где состояние лежит слишком высоко, и замечать, когда проблема на самом деле в форме данных или ширине затронутого дерева."
        aside={
          <div className="space-y-3">
            <MetricCard
              label="Guide cards"
              value={`${performanceGuideCards.length}`}
              hint="Вся карта темы сведена к нескольким повторяемым сигналам."
              tone="accent"
            />
          </div>
        }
      />

      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Все сигналы' },
            { value: 'rerenders', label: 'Render causes' },
            { value: 'structure', label: 'State and data shape' },
            { value: 'measurement', label: 'Measure first' },
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
          label="Сначала причина"
          value="что запустило render"
          hint="Parent state, local state, props или route change — это разные причины и разные выводы."
          tone="accent"
        />
        <MetricCard
          label="Потом цена"
          value="какой subtree задет"
          hint="Тяжёлый grid и простой badge не должны оцениваться одинаково."
          tone="cool"
        />
        <MetricCard
          label="Потом решение"
          value="state shape first"
          hint="Часто хватает state colocation и изменения структуры данных."
          tone="dark"
        />
      </div>

      <ProjectStudy {...projectStudyByLab.overview} />
    </div>
  );
}
