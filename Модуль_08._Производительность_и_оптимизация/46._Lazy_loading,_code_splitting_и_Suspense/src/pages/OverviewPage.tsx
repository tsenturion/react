import { useSearchParams } from 'react-router-dom';

import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import {
  filterGuideCardsByFocus,
  lazyLoadingGuideCards,
  parseOverviewFocus,
} from '../lib/lazy-loading-domain';
import { projectStudyByLab } from '../lib/project-study';

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterGuideCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Lazy loading overview"
        title="Code splitting приносит пользу только тогда, когда split point совпадает с реальным сценарием ожидания"
        copy="В этой теме важно смотреть не только на `React.lazy` и `Suspense`, но и на то, что именно исчезает во время загрузки, какие части интерфейса продолжают жить и не превращается ли приложение в набор мелких догрузок."
        aside={
          <MetricCard
            label="Guide cards"
            value={`${lazyLoadingGuideCards.length}`}
            hint="Карта темы разбита по практическим сигналам: route split, component split, fallback placement, perception и trade-offs."
            tone="accent"
          />
        }
      />

      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Все сигналы' },
            { value: 'routes', label: 'Routes' },
            { value: 'components', label: 'Components' },
            { value: 'fallbacks', label: 'Fallbacks' },
            { value: 'perception', label: 'Perception' },
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
          value="что именно тяжёлое?"
          hint="Если payload лёгкий и блок всегда нужен в первом кадре, отдельный chunk может только усложнить UX."
          tone="accent"
        />
        <MetricCard
          label="Потом граница"
          value="что исчезнет?"
          hint="Ширина Suspense boundary влияет на контекст сильнее, чем сам факт lazy import."
          tone="cool"
        />
        <MetricCard
          label="Потом восприятие"
          value="что остаётся живым?"
          hint="Пользователь чувствует не bundle size напрямую, а устойчивость shell и ясность loading-состояния."
          tone="dark"
        />
      </div>

      <ProjectStudy {...projectStudyByLab.overview} />
    </div>
  );
}
