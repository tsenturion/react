import type { ReactNode } from 'react';

import {
  formatInspectedTree,
  inspectReactNode,
  summarizeInspectedTree,
} from '../../lib/element-inspector';
import { CodeBlock, MetricCard } from '../ui';

export function ElementTreeView({
  label,
  element,
}: {
  label: string;
  element: ReactNode;
}) {
  const inspected = inspectReactNode(element);
  const summary = summarizeInspectedTree(inspected);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Element nodes"
          value={String(summary.elementCount)}
          hint="Сколько узлов описывает React до реального DOM."
          tone="cool"
        />
        <MetricCard
          label="Text nodes"
          value={String(summary.textCount)}
          hint="Сколько строковых children попало в итоговое описание."
        />
        <MetricCard
          label="Tree depth"
          value={String(summary.maxDepth)}
          hint="Насколько глубоко вложена текущая структура."
          tone="accent"
        />
      </div>
      <CodeBlock label={label} code={formatInspectedTree(inspected)} />
    </div>
  );
}
