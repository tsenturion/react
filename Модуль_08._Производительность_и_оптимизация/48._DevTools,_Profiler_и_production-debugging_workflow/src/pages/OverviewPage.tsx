import { useSearchParams } from 'react-router-dom';

import {
  filterOverviewCardsByFocus,
  parseOverviewFocus,
  type OverviewFocus,
} from '../lib/devtools-domain';
import { projectStudyByLab } from '../lib/project-study';
import { BeforeAfter, Panel, ProjectStudy, SectionIntro } from '../components/ui';

const focusOptions: readonly { value: OverviewFocus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'devtools', label: 'DevTools' },
  { value: 'profiler', label: 'Profiler' },
  { value: 'browser', label: 'Browser' },
  { value: 'tracks', label: 'Tracks' },
  { value: 'workflow', label: 'Workflow' },
];

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterOverviewCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Tooling overview"
        title="Производительность начинается не с магии оптимизаций, а с нормальной диагностики"
        copy="В этом уроке React DevTools, Profiler и browser Performance panel рассматриваются как единый рабочий процесс. Сначала вы ищете signal в дереве компонентов, затем измеряете commits и только потом решаете, где именно находится bottleneck."
        aside={
          <div className="space-y-3 text-sm leading-6 text-slate-600">
            <p>
              Урок построен вокруг production-style расследования, а не вокруг isolated
              toy examples.
            </p>
            <p>
              Каждая лаборатория показывает, какой инструмент отвечает на какой вопрос и
              где заканчивается его полезность.
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
        beforeTitle="Интуитивный путь"
        before="Сразу добавлять memoization, переписывать компоненты и надеяться, что интерфейс станет быстрее без измерения."
        afterTitle="Рабочий путь"
        after="Сначала выделить symptom, потом собрать evidence через DevTools/Profiler/trace и только после этого менять код под конкретный bottleneck."
      />

      <ProjectStudy
        files={projectStudyByLab.overview.files}
        snippets={projectStudyByLab.overview.snippets}
      />
    </div>
  );
}
