import { useSearchParams } from 'react-router-dom';

import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import {
  filterGuideCardsByFocus,
  memoizationGuideCards,
  parseOverviewFocus,
} from '../lib/memoization-domain';
import { projectStudyByLab } from '../lib/project-study';

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterGuideCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Memoization overview"
        title="Мемоизация имеет смысл только тогда, когда вы удерживаете от лишней работы реальный expensive path"
        copy="Здесь важно не запомнить три API по отдельности, а увидеть их как одну систему: `memo` держит границу child, `useMemo` стабилизирует derived values, `useCallback` стабилизирует handlers, а список сразу показывает, где эта связка приносит реальную пользу."
        aside={
          <div className="space-y-3">
            <MetricCard
              label="Guide cards"
              value={`${memoizationGuideCards.length}`}
              hint="Карта темы разбита не по API, а по практическим сигналам: стабильность, вычисления, списки и trade-offs."
              tone="accent"
            />
          </div>
        }
      />

      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Все сигналы' },
            { value: 'stability', label: 'Stability' },
            { value: 'computation', label: 'Computation' },
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
          value="что сравнивается?"
          hint="Если ссылка или derived object не участвует в сравнении ниже по дереву, мемоизация легко становится бесполезной."
          tone="accent"
        />
        <MetricCard
          label="Потом контекст"
          value="где hot path?"
          hint="Тяжёлый список и один маленький child не дают одинаковый эффект от memoization."
          tone="cool"
        />
        <MetricCard
          label="Потом цена"
          value="стоит ли усложнение?"
          hint="Каждый новый dependency array и boundary имеет собственную стоимость поддержки."
          tone="dark"
        />
      </div>

      <ProjectStudy {...projectStudyByLab.overview} />
    </div>
  );
}
