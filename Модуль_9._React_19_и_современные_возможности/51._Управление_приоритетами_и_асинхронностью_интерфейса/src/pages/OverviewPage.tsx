import { useSearchParams } from 'react-router-dom';

import { BeforeAfter, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';
import {
  filterOverviewCardsByFocus,
  parseOverviewFocus,
  type OverviewFocus,
} from '../lib/priority-overview-domain';

const focusOptions: readonly { value: OverviewFocus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'urgent', label: 'Urgent vs Non-urgent' },
  { value: 'transition', label: 'Transitions' },
  { value: 'deferred', label: 'Deferred value' },
  { value: 'effect-event', label: 'useEffectEvent' },
  { value: 'activity', label: 'Activity' },
] as const;

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterOverviewCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Priority overview"
        title="Responsive UI строится не из одного магического хука, а из правильного распределения приоритетов"
        copy="В этом уроке вы рассматриваете интерфейс как систему обновлений с разной срочностью. Ввод, курсор и основные controls остаются urgent. Тяжёлые представления, background-перестройки, effect-local реакции и скрываемые поддеревья проектируются отдельными инструментами."
        aside={
          <div className="space-y-3 text-sm leading-6 text-slate-600">
            <p>
              React 19 даёт здесь не один новый паттерн, а набор разных рычагов:
              `useTransition`, `startTransition`, `useDeferredValue`, `useEffectEvent` и
              `Activity`.
            </p>
            <p>
              Важный критерий урока: каждый API должен быть показан на ситуации, где он
              действительно решает реальную проблему приоритета или видимости.
            </p>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {focusOptions.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.set('focus', item.value);
              setSearchParams(next);
            }}
            className={focus === item.value ? 'chip chip-active' : 'chip'}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((item) => (
          <Panel key={item.id} className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="text-sm leading-6 text-slate-600">{item.summary}</p>
          </Panel>
        ))}
      </div>

      <BeforeAfter
        beforeTitle="Одна скорость для всего"
        before="Любой update считается одинаково срочным: heavy list, ввод, theme switch внутри подписки и скрытие целого поддерева обрабатываются одной и той же ментальной моделью."
        afterTitle="Модель приоритетов"
        after="Срочный ввод отделяется от background work, отстающее представление получает свой канал чтения, effect-local логика перестаёт пересоздавать подписки, а скрываемое поддерево можно держать отдельной boundary."
      />

      <ProjectStudy
        files={projectStudyByLab.overview.files}
        snippets={projectStudyByLab.overview.snippets}
      />
    </div>
  );
}
