import clsx from 'clsx';
import { useMemo, useState, type ReactNode } from 'react';

import { ElementTreeView } from './components/rendering/ElementTreeView';
import { IdempotencyPair } from './components/rendering-lab/IdempotencyPair';
import { PuritySandbox } from './components/rendering-lab/PuritySandbox';
import { RenderTreePreview } from './components/rendering-lab/RenderTreePreview';
import { resetImpureRegistry } from './components/rendering-lab/purity-registry';
import {
  BeforeAfter,
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from './components/ui';
import { buildIdempotencyReport } from './lib/idempotency-model';
import type { LessonLabId } from './lib/learning-model';
import { buildPurityReport } from './lib/purity-model';
import { projectStudyByLab } from './lib/project-study';
import { buildReconciliationReport, type UiTreeState } from './lib/reconciliation-model';
import { buildRenderCommitReport } from './lib/render-commit-model';
import { buildRenderCostReport } from './lib/render-cost-model';
import {
  buildRenderTriggerReport,
  type RenderTrigger,
} from './lib/rerender-trigger-model';
import { stackBadges } from './lib/stack-meta';

const labs: {
  id: LessonLabId;
  label: string;
  blurb: string;
}[] = [
  {
    id: 'render-commit',
    label: '1. Render и commit',
    blurb:
      'Как React сначала вычисляет следующее описание UI, а потом только применяет изменения к DOM.',
  },
  {
    id: 'triggers',
    label: '2. Причины ререндера',
    blurb:
      'Локальное state, state родителя, новые props и повторный вызов с теми же входными данными.',
  },
  {
    id: 'purity',
    label: '3. Purity',
    blurb:
      'Почему render не должен мутировать внешнее состояние и как side effect превращает повторный render в баг.',
  },
  {
    id: 'idempotency',
    label: '4. Idempotency',
    blurb:
      'Одинаковые props и state должны давать тот же output, а случайность и время ломают это правило.',
  },
  {
    id: 'reconciliation',
    label: '5. Reconciliation',
    blurb:
      'Как React сравнивает старое и новое описание интерфейса и обновляет только изменившиеся ветки.',
  },
  {
    id: 'extra-renders',
    label: '6. Цена лишних проходов',
    blurb:
      'Когда повторные render-проходы безопасны, а когда начинают дублировать работу и side effects.',
  },
];

function WorkspacePreview({
  screen,
  density,
  showSidebar,
  showFilters = false,
}: {
  screen: 'catalog' | 'lesson' | 'summary';
  density: 'comfortable' | 'compact';
  showSidebar: boolean;
  showFilters?: boolean;
}) {
  return (
    <section data-screen={screen} data-density={density}>
      <header>
        <h3>Workspace</h3>
        <p>{screen}</p>
      </header>
      {showFilters ? (
        <div>
          <button type="button">Все темы</button>
          <button type="button">Только активные</button>
        </div>
      ) : null}
      <main>
        <article>{density === 'compact' ? 'Compact card' : 'Comfortable card'}</article>
        {screen !== 'summary' ? <article>Secondary block</article> : null}
      </main>
      {showSidebar ? <aside>Sidebar metrics</aside> : null}
      <footer>Commit-ready UI tree</footer>
    </section>
  );
}

function RenderCommitLab() {
  const [screen, setScreen] = useState<'catalog' | 'lesson' | 'summary'>('catalog');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [showSidebar, setShowSidebar] = useState(true);
  const [revision, setRevision] = useState(1);

  const report = useMemo(
    () => buildRenderCommitReport({ screen, density, showSidebar, revision }),
    [density, revision, screen, showSidebar],
  );
  const elementPreview = useMemo(
    () => (
      <WorkspacePreview
        screen={screen}
        density={density}
        showSidebar={showSidebar}
        showFilters={screen === 'catalog'}
      />
    ),
    [density, screen, showSidebar],
  );

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Lab 01"
        title="Render-фаза считает следующий UI, commit применяет изменения"
        copy="Переключайте экран, плотность и боковую панель. Вы видите, как меняется описание интерфейса, а commit получает уже подготовленный результат, а не произвольные DOM-манипуляции."
        aside={
          <div className="space-y-3 text-sm leading-6 text-slate-600">
            <p>
              Signature помогает увидеть: React сравнивает именно входные данные текущего
              render-прохода.
            </p>
            <StatusPill tone={report.tone}>{report.commitLabel}</StatusPill>
          </div>
        }
      />

      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-3">
          {(['catalog', 'lesson', 'summary'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setScreen(item)}
              className={clsx('chip', screen === item && 'chip-active')}
            >
              {item}
            </button>
          ))}
          {(['comfortable', 'compact'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setDensity(item)}
              className={clsx('chip', density === item && 'chip-active')}
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowSidebar((value) => !value)}
            className={clsx('chip', showSidebar && 'chip-active')}
          >
            {showSidebar ? 'Sidebar on' : 'Sidebar off'}
          </button>
          <button
            type="button"
            onClick={() => setRevision((value) => value + 1)}
            className="chip"
          >
            Commit +1
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Signature"
            value={report.signature}
            hint="Идентификатор текущего render-прохода."
            tone="cool"
          />
          <MetricCard
            label="Visible nodes"
            value={String(report.visibleNodeCount)}
            hint="Сколько видимых узлов попало в итоговое описание."
            tone="accent"
          />
          <MetricCard
            label="Commit"
            value={report.commitLabel}
            hint="Какой результат получает commit-фаза."
            tone="dark"
          />
        </div>

        <BeforeAfter
          beforeTitle="Render"
          before={report.renderSummary}
          afterTitle="Commit"
          after="Commit не пересчитывает бизнес-логику заново, а применяет уже подготовленные изменения к интерфейсу."
        />

        <ListBlock title="Что происходит по шагам" items={report.renderSteps} />
        <ElementTreeView label="Текущее element tree" element={elementPreview} />
        <CodeBlock label="Модель render → commit" code={report.snippet} />
        <ProjectStudy {...projectStudyByLab['render-commit']} />
      </Panel>
    </div>
  );
}

function RenderTriggersLab() {
  const [trigger, setTrigger] = useState<RenderTrigger>('local-state');
  const report = useMemo(() => buildRenderTriggerReport(trigger), [trigger]);

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Lab 02"
        title="Не каждый ререндер означает поломку, но причина вызова важна"
        copy="Сравнивайте, какие ветки реально были вызваны заново и где output действительно изменился. Это помогает не путать render-проход с обязательным DOM-изменением."
      />

      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-3">
          {(
            [
              ['local-state', 'Локальное state'],
              ['parent-state', 'State родителя'],
              ['prop-change', 'Новый prop'],
              ['same-input', 'Тот же input'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTrigger(value)}
              className={clsx('chip', trigger === value && 'chip-active')}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Affected nodes"
            value={String(report.affectedCount)}
            hint="Сколько узлов получили новый render-проход."
            tone="accent"
          />
          <MetricCard
            label="Changed output"
            value={String(report.changedOutputCount)}
            hint="Где описание интерфейса реально стало другим."
            tone="cool"
          />
          <MetricCard
            label="Trigger"
            value={report.trigger}
            hint={report.summary}
            tone="dark"
          />
        </div>

        <RenderTreePreview tree={report.tree} />
        <CodeBlock label="Модель причин ререндера" code={report.snippet} />
        <ProjectStudy {...projectStudyByLab.triggers} />
      </Panel>
    </div>
  );
}

function PurityLab() {
  const [topic, setTopic] = useState('render должен быть чистым');
  const [showBadge, setShowBadge] = useState(true);
  const [pulse, setPulse] = useState(0);
  const [session, setSession] = useState(0);
  const report = useMemo(() => buildPurityReport(Math.max(2, pulse + 1), pulse), [pulse]);

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Lab 03"
        title="Purity: render не должен менять внешний мир"
        copy="В этой лаборатории чистая и нечистая ветки стоят рядом. Повторяйте render и наблюдайте, как mutable registry растёт только потому, что компонент снова был вызван."
      />

      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-3">
          <label className="min-w-72 flex-1 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Тема карточки
            </span>
            <input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <button
            type="button"
            onClick={() => setShowBadge((value) => !value)}
            className={clsx('chip', showBadge && 'chip-active')}
          >
            {showBadge ? 'Badge on' : 'Badge off'}
          </button>
          <button
            type="button"
            onClick={() => setPulse((value) => value + 1)}
            className="chip"
          >
            Force rerender
          </button>
          <button
            type="button"
            onClick={() => {
              resetImpureRegistry();
              setPulse(0);
              setSession((value) => value + 1);
            }}
            className="chip"
          >
            Reset registry
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Pulse"
            value={String(pulse)}
            hint="Сколько раз вы принудили повторный render."
            tone="accent"
          />
          <MetricCard
            label="Purity status"
            value={report.tone}
            hint={report.summary}
            tone="cool"
          />
          <MetricCard
            label="Main risk"
            value={report.risk}
            hint="Нечистый render производит side effect ещё до commit."
            tone="dark"
          />
        </div>

        <PuritySandbox key={session} topic={topic} showBadge={showBadge} pulse={pulse} />
        <CodeBlock label="Контрпример purity" code={report.snippet} />
        <ProjectStudy {...projectStudyByLab.purity} />
      </Panel>
    </div>
  );
}

function IdempotencyLab() {
  const [topic, setTopic] = useState('idempotent render');
  const [rerenderTick, setRerenderTick] = useState(0);
  const report = useMemo(() => buildIdempotencyReport(topic), [topic]);

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Lab 04"
        title="Idempotency: одинаковый input должен давать одинаковый output"
        copy="Кнопка ниже вызывает повторный render при тех же props. Левая карточка остаётся стабильной, правая меняется только из-за случайности в render."
      />

      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-3">
          <label className="min-w-72 flex-1 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Topic
            </span>
            <input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <button
            type="button"
            onClick={() => setRerenderTick((value) => value + 1)}
            className="chip"
          >
            Force rerender with same input
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Tick"
            value={String(rerenderTick)}
            hint="Растёт только для нового render-прохода, но не меняет props пары."
            tone="accent"
          />
          <MetricCard
            label="Stable output"
            value={report.stableOutput}
            hint="Чистый результат зависит только от topic."
            tone="cool"
          />
          <MetricCard
            label="Impure pattern"
            value={report.impureOutput}
            hint={report.summary}
            tone="dark"
          />
        </div>

        <div data-rerender-tick={rerenderTick}>
          <IdempotencyPair topic={topic} />
        </div>
        <BeforeAfter
          beforeTitle="Нарушение"
          before="Случайность и текущее время внутри render делают один и тот же input нестабильным."
          afterTitle="Нормальное поведение"
          after="Компонент остаётся предсказуемым, если output зависит только от props и state."
        />
        <CodeBlock label="Модель idempotency" code={report.snippet} />
        <ProjectStudy {...projectStudyByLab.idempotency} />
      </Panel>
    </div>
  );
}

function ReconciliationLab() {
  const beforeState: UiTreeState = {
    screen: 'catalog',
    showFilters: true,
    showSidebar: true,
    compact: false,
  };
  const [afterState, setAfterState] = useState<UiTreeState>({
    screen: 'lesson',
    showFilters: false,
    showSidebar: true,
    compact: false,
  });
  const report = buildReconciliationReport(beforeState, afterState);

  const beforeElement = (
    <WorkspacePreview
      screen={beforeState.screen}
      density={beforeState.compact ? 'compact' : 'comfortable'}
      showSidebar={beforeState.showSidebar}
      showFilters={beforeState.showFilters}
    />
  );
  const afterElement = (
    <WorkspacePreview
      screen={afterState.screen}
      density={afterState.compact ? 'compact' : 'comfortable'}
      showSidebar={afterState.showSidebar}
      showFilters={afterState.showFilters}
    />
  );

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Lab 05"
        title="Reconciliation сравнивает два описания UI и меняет только отличия"
        copy="Слева у вас базовое дерево, справа — новое состояние экрана. Переключайте параметры и смотрите, какие ветки React считает изменившимися, а какие остаются стабильными."
      />

      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              setAfterState((current) => ({
                ...current,
                screen: current.screen === 'catalog' ? 'lesson' : 'catalog',
              }))
            }
            className="chip"
          >
            Switch screen
          </button>
          <button
            type="button"
            onClick={() =>
              setAfterState((current) => ({
                ...current,
                showFilters: !current.showFilters,
              }))
            }
            className={clsx('chip', afterState.showFilters && 'chip-active')}
          >
            Filters
          </button>
          <button
            type="button"
            onClick={() =>
              setAfterState((current) => ({
                ...current,
                showSidebar: !current.showSidebar,
              }))
            }
            className={clsx('chip', afterState.showSidebar && 'chip-active')}
          >
            Sidebar
          </button>
          <button
            type="button"
            onClick={() =>
              setAfterState((current) => ({
                ...current,
                compact: !current.compact,
              }))
            }
            className={clsx('chip', afterState.compact && 'chip-active')}
          >
            Compact
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Before nodes"
            value={String(report.beforeNodeCount)}
            hint="Размер исходного дерева."
            tone="cool"
          />
          <MetricCard
            label="After nodes"
            value={String(report.afterNodeCount)}
            hint="Размер нового дерева после переключений."
            tone="accent"
          />
          <MetricCard
            label="Changed branches"
            value={report.changedBranches.join(', ') || 'none'}
            hint={report.summary}
            tone="dark"
          />
        </div>

        <ListBlock title="Стабильные ветки" items={report.stableBranches} />
        <div className="grid gap-6 xl:grid-cols-2">
          <ElementTreeView label="Before tree" element={beforeElement} />
          <ElementTreeView label="After tree" element={afterElement} />
        </div>
        <CodeBlock label="Модель reconciliation" code={report.snippet} />
        <ProjectStudy {...projectStudyByLab.reconciliation} />
      </Panel>
    </div>
  );
}

function ExtraRendersLab() {
  const [items, setItems] = useState(12);
  const [workPerItem, setWorkPerItem] = useState(6);
  const [extraPasses, setExtraPasses] = useState(2);
  const [sideEffectsInRender, setSideEffectsInRender] = useState(true);

  const report = useMemo(
    () =>
      buildRenderCostReport({
        items,
        workPerItem,
        extraPasses,
        sideEffectsInRender,
      }),
    [extraPasses, items, sideEffectsInRender, workPerItem],
  );

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Lab 06"
        title="Лишние render-проходы умножают стоимость вычислений"
        copy="Меняйте размер списка, тяжесть одного элемента и количество дополнительных проходов. Так видно, почему само по себе повторное вычисление JSX не страшно, пока render остаётся чистым."
      />

      <Panel className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Items
            </span>
            <input
              type="range"
              min="4"
              max="40"
              value={items}
              onChange={(event) => setItems(Number(event.target.value))}
            />
            <p className="text-sm text-slate-600">{items}</p>
          </label>
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Work per item
            </span>
            <input
              type="range"
              min="1"
              max="20"
              value={workPerItem}
              onChange={(event) => setWorkPerItem(Number(event.target.value))}
            />
            <p className="text-sm text-slate-600">{workPerItem}</p>
          </label>
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Extra passes
            </span>
            <input
              type="range"
              min="0"
              max="6"
              value={extraPasses}
              onChange={(event) => setExtraPasses(Number(event.target.value))}
            />
            <p className="text-sm text-slate-600">{extraPasses}</p>
          </label>
          <button
            type="button"
            onClick={() => setSideEffectsInRender((value) => !value)}
            className={clsx('chip self-end', sideEffectsInRender && 'chip-active')}
          >
            {sideEffectsInRender ? 'Side effects in render' : 'Pure render only'}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Estimated operations"
            value={String(report.estimatedOperations)}
            hint="Тяжёлая работа масштабируется на каждый повторный render."
            tone="accent"
          />
          <MetricCard
            label="Duplicated side effects"
            value={String(report.duplicatedSideEffects)}
            hint="Сколько раз тот же side effect может выполниться снова."
            tone="cool"
          />
          <MetricCard
            label="Risk tone"
            value={report.tone}
            hint={report.summary}
            tone="dark"
          />
        </div>

        <BeforeAfter
          beforeTitle="Чистый render"
          before="Повторный вызов всё ещё стоит CPU, но не ломает внешнее состояние и не дублирует побочные эффекты."
          afterTitle="Нечистый render"
          after="Каждый дополнительный проход повторяет мутацию, запрос или счётчик ещё раз."
        />
        <ListBlock title="Типичные риски" items={report.risks} />
        <CodeBlock label="Оценка стоимости render" code={report.snippet} />
        <ProjectStudy {...projectStudyByLab['extra-renders']} />
      </Panel>
    </div>
  );
}

const labSections: Record<LessonLabId, () => ReactNode> = {
  'render-commit': RenderCommitLab,
  triggers: RenderTriggersLab,
  purity: PurityLab,
  idempotency: IdempotencyLab,
  reconciliation: ReconciliationLab,
  'extra-renders': ExtraRendersLab,
};

export function App() {
  const [activeLabId, setActiveLabId] = useState<LessonLabId>('render-commit');
  const ActiveLab = labSections[activeLabId];
  const activeMeta = labs.find((item) => item.id === activeLabId) ?? labs[0];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 1 / Урок 11</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Как React рендерит UI: render, commit, purity и idempotency
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Этот проект показывает не только что React вызывает компоненты, но и как
              устроен сам render-проход: от чистого вычисления следующего UI до commit,
              reconciliation и цены лишних повторных вызовов.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Render и commit, причины ререндера, purity, idempotency, reconciliation и
                реальную цену лишних render-проходов.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как работать с лабораториями
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Меняйте состояние, форсируйте повторный render, сравнивайте tree before и
                after и смотрите, где React действительно меняет output, а где просто
                повторно вызывает функцию компонента.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть чистые предметные модели render-фазы, живые sandboxes с
                повторными вызовами и кодовые листинги, которые ссылаются именно на
                текущие файлы урока.
              </p>
            </div>
          </div>
        </header>

        <nav className="panel mb-8 p-2">
          <div className="flex flex-wrap gap-2">
            {labs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveLabId(item.id)}
                className={clsx(
                  'rounded-xl px-4 py-3 text-left transition-all duration-200',
                  activeLabId === item.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100',
                )}
              >
                <span className="block text-sm font-semibold">{item.label}</span>
                <span
                  className={clsx(
                    'mt-1 block text-xs leading-5',
                    activeLabId === item.id ? 'text-blue-100' : 'text-slate-500',
                  )}
                >
                  {item.blurb}
                </span>
              </button>
            ))}
          </div>
        </nav>

        <main className="space-y-6">
          <div className="panel flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Active lab
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                {activeMeta.label}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{activeMeta.blurb}</p>
            </div>
            <StatusPill tone="success">{activeLabId}</StatusPill>
          </div>

          <ActiveLab />
        </main>

        <footer className="mt-12 border-t border-slate-200 pt-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Как читать этот проект
              </h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <p className="text-sm leading-6">
                    Сначала меняйте параметры в лаборатории, затем открывайте
                    `src/components/rendering-lab`, `src/lib` и `src/App.tsx`, чтобы
                    видеть, как одна и та же концепция работает и в UI, и в коде.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Здесь deliberately есть и контрпримеры: они нужны, чтобы увидеть, где
                    render перестаёт быть предсказуемым и почему lint/архитектура это
                    ограничивают.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Каждый блок снизу ссылается на реальные файлы проекта, а не на
                    абстрактные куски кода вне репозитория.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800">Стек проекта</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {stackBadges.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
                Версии зафиксированы в `package.json`, а проверяемый инженерный контур
                держится на реальных `ESLint`, `Prettier`, `Vitest`, `TypeScript` и
                Docker-конфигах урока.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
