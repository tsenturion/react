import { useState } from 'react';

import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  analyzeReconciliation,
  type DiffOperation,
  type KeyStrategy,
} from '../lib/reconciliation-model';
import { getProjectStudy } from '../lib/project-study';

const strategyOptions: readonly {
  value: KeyStrategy;
  title: string;
  note: string;
}[] = [
  {
    value: 'stable-id',
    title: 'stable-id',
    note: 'React повторно использует именно тот элемент, который описывает тот же объект данных.',
  },
  {
    value: 'index',
    title: 'index',
    note: 'React видит только текущую позицию, а не исходную сущность из массива.',
  },
  {
    value: 'random',
    title: 'random',
    note: 'Каждый рендер создаёт новый набор ключей и ломает reuse полностью.',
  },
] as const;

const operationOptions: readonly {
  value: DiffOperation;
  title: string;
  note: string;
}[] = [
  {
    value: 'reverse',
    title: 'Развернуть порядок',
    note: 'Один и тот же набор данных остаётся, но порядок элементов меняется полностью.',
  },
  {
    value: 'prepend',
    title: 'Добавить в начало',
    note: 'В начало списка добавляется новый элемент, а старые смещаются на одну позицию.',
  },
  {
    value: 'remove-second',
    title: 'Удалить второй',
    note: 'Один элемент исчезает, и React должен понять, что именно было удалено.',
  },
  {
    value: 'swap-middle',
    title: 'Поменять середину',
    note: 'Меняются местами два соседних элемента в середине списка.',
  },
] as const;

function SnapshotBoard({
  title,
  items,
}: {
  title: string;
  items: readonly { id: string; title: string; key: string }[];
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        {title}
      </p>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={`${title}-${item.key}-${item.id}`}
            className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {index + 1}. {item.title}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                  id: {item.id}
                </p>
              </div>
              <code className="rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-600">
                key: {item.key}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReconciliationPage() {
  const [strategy, setStrategy] = useState<KeyStrategy>('stable-id');
  const [operation, setOperation] = useState<DiffOperation>('reverse');
  const report = analyzeReconciliation(strategy, operation);
  const study = getProjectStudy('reconciliation');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Как key влияет на reconciliation и diffing"
        copy="React сравнивает старое и новое дерево не абстрактно, а по конкретным ключам. Здесь можно менять тип `key` и операцию над массивом, а затем смотреть, сколько элементов реально переиспользуется, сколько монтируется заново и где появляется дрейф идентичности."
      />

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Стратегия key</h2>
            {strategyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStrategy(option.value)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  strategy === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block text-sm font-semibold">{option.title}</span>
                <span className="mt-1 block text-sm leading-6 text-slate-600">
                  {option.note}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Операция над массивом
            </h2>
            {operationOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setOperation(option.value)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  operation === option.value
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block text-sm font-semibold">{option.title}</span>
                <span className="mt-1 block text-sm leading-6 text-slate-600">
                  {option.note}
                </span>
              </button>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Переиспользовано"
              value={String(report.reusedCount)}
              hint="Сколько ключей React нашёл и смог повторно использовать."
              tone="cool"
            />
            <MetricCard
              label="Смонтировано"
              value={String(report.mountedCount)}
              hint="Сколько элементов пришлось смонтировать как новые."
            />
            <MetricCard
              label="Удалено"
              value={String(report.removedCount)}
              hint="Сколько старых элементов исчезло из нового дерева."
            />
            <MetricCard
              label="Дрейф identity"
              value={String(report.identityDriftCount)}
              hint="Сколько reused-ключей теперь указывают уже на другой объект данных."
              tone={report.identityDriftCount > 0 ? 'accent' : 'cool'}
            />
          </div>

          <Panel className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Как читать этот diff</h2>
            <p className="text-sm leading-6 text-slate-600">{report.summary}</p>
            <ListBlock
              title="Что важно заметить"
              items={[
                'reusedCount сам по себе ещё не означает корректное поведение: при `index` reuse может сопровождаться неверной привязкой состояния.',
                'identityDrift показывает именно те случаи, где ключ сохранился, а данные под ним уже другие.',
                'mountedCount особенно важен для `random`: React не может опереться на прошлый рендер и пересоздаёт всё заново.',
              ]}
            />
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel>
              <SnapshotBoard title="Старое дерево" items={report.before} />
            </Panel>
            <Panel>
              <SnapshotBoard title="Новое дерево" items={report.after} />
            </Panel>
          </div>

          <CodeBlock label="map(...) и ключи" code={report.snippet} />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
