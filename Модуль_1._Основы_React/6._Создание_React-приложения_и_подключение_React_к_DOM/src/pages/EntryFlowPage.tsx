import clsx from 'clsx';
import { useState } from 'react';

import {
  BeforeAfter,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { analyzeEntryFlow } from '../lib/dom-entry-model';
import { projectStudy } from '../lib/project-study';

export function EntryFlowPage() {
  const [htmlHasRoot, setHtmlHasRoot] = useState(true);
  const [rootIdMatches, setRootIdMatches] = useState(true);
  const [scriptLoads, setScriptLoads] = useState(true);
  const [useCreateRoot, setUseCreateRoot] = useState(true);
  const [wrapsStrictMode, setWrapsStrictMode] = useState(true);

  const scenario = analyzeEntryFlow({
    htmlHasRoot,
    rootIdMatches,
    scriptLoads,
    useCreateRoot,
    wrapsStrictMode,
  });

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Entry Flow"
        title="Как React входит в HTML-страницу"
        copy="Цепочка здесь всегда одна и та же: `index.html` даёт контейнер, браузер исполняет `src/main.tsx`, код находит DOM-узел, создаёт `React Root` и только потом рендерит `App`. Сломайте любой шаг ниже и посмотрите, где именно рушится вход приложения в DOM."
        aside={
          <div className="space-y-3">
            <StatusPill tone={scenario.tone}>
              {scenario.blockers.length > 0
                ? `Блокеров: ${scenario.blockers.length}`
                : 'Цепочка монтирования собрана'}
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">{scenario.visibleResult}</p>
          </div>
        }
      />

      <Panel className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <ToggleCard
          title="Есть `#root`"
          copy="Контейнер существует прямо в HTML."
          checked={htmlHasRoot}
          onChange={setHtmlHasRoot}
        />
        <ToggleCard
          title="ID совпадает"
          copy="`getElementById(...)` смотрит именно в нужный DOM-узел."
          checked={rootIdMatches}
          onChange={setRootIdMatches}
        />
        <ToggleCard
          title="Модуль загружается"
          copy="Браузер выполняет `src/main.tsx`."
          checked={scriptLoads}
          onChange={setScriptLoads}
        />
        <ToggleCard
          title="Используется createRoot"
          copy="Клиентский React Root действительно создаётся."
          checked={useCreateRoot}
          onChange={setUseCreateRoot}
        />
        <ToggleCard
          title="Обёртка StrictMode"
          copy="В development есть dev-only проверки."
          checked={wrapsStrictMode}
          onChange={setWrapsStrictMode}
        />
      </Panel>

      <Panel className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-5">
          {scenario.stages.map((stage) => (
            <article
              key={stage.id}
              className={clsx(
                'rounded-[24px] border p-4 shadow-sm',
                stage.status === 'done' && 'border-emerald-200 bg-emerald-50',
                stage.status === 'warn' && 'border-amber-200 bg-amber-50',
                stage.status === 'error' && 'border-rose-200 bg-rose-50',
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {stage.label}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{stage.detail}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Успешных этапов"
            value={String(scenario.successfulStages)}
            hint="Сколько шагов цепочки уже дошло до корректного состояния."
            tone="accent"
          />
          <MetricCard
            label="Предупреждений"
            value={String(scenario.warnings)}
            hint="Обычно сюда попадает отсутствие StrictMode при живой базовой цепочке."
            tone="cool"
          />
          <MetricCard
            label="Итог на экране"
            value={
              scenario.blockers.length > 0 ? 'React не смонтирован' : 'React смонтирован'
            }
            hint={scenario.visibleResult}
            tone="dark"
          />
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <ListBlock title="Что сейчас блокирует старт" items={scenario.blockers} />
        </Panel>
        <Panel>
          <ListBlock title="Типичные ошибки входной цепочки" items={scenario.mistakes} />
        </Panel>
      </div>

      <Panel>
        <BeforeAfter
          beforeTitle="Сломанный bootstrap"
          before="HTML, DOM lookup или createRoot-путь расходятся, поэтому React-дерево вообще не доходит до браузерного контейнера."
          afterTitle="Здоровый bootstrap"
          after="HTML-shell, main entry и React Root идут прозрачной цепочкой: контейнер найден, root создан, App смонтирован."
        />
      </Panel>

      <Panel>
        <ProjectStudy
          files={projectStudy.entry.files}
          snippets={projectStudy.entry.snippets}
        />
      </Panel>
    </div>
  );
}

function ToggleCard({
  title,
  copy,
  checked,
  onChange,
}: {
  title: string;
  copy: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <span className="text-sm font-semibold text-slate-800">{title}</span>
      <span className="mt-2 block text-sm leading-6 text-slate-600">{copy}</span>
      <span className="mt-4 flex items-center gap-3 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        {checked ? 'Да' : 'Нет'}
      </span>
    </label>
  );
}
