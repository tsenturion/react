import clsx from 'clsx';
import { useState } from 'react';

import {
  buildDecompositionPlan,
  type ComponentNode,
  type DecompositionLevel,
} from '../../lib/decomposition-model';

type HighlightZone = 'toolbar' | 'list' | 'details';

export function ScreenDecompositionLab() {
  const [level, setLevel] = useState<DecompositionLevel>('balanced');
  const [zone, setZone] = useState<HighlightZone>('toolbar');
  const plan = buildDecompositionPlan(level);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {[
          ['coarse', 'Грубая'],
          ['balanced', 'Сбалансированная'],
          ['fine', 'Детальная'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setLevel(value as DecompositionLevel)}
            className={clsx('chip', level === value && 'chip-active')}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          ['toolbar', 'Фокус: toolbar'],
          ['list', 'Фокус: list'],
          ['details', 'Фокус: details'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setZone(value as HighlightZone)}
            className={clsx('chip', zone === value && 'chip-active')}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <VisualMap zone={zone} />
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Component tree
            </p>
            <div className="mt-4 space-y-3">
              {plan.nodes.map((node) => (
                <NodeView key={node.label} node={node} depth={0} />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Что видно по дереву
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-700">{plan.summary}</p>
          <div className="mt-4 rounded-2xl bg-white px-4 py-3 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Количество компонентов
            </p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
              {plan.componentCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualMap({ zone }: { zone: HighlightZone }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Экран как набор зон
      </p>
      <div className="mt-4 space-y-4">
        <HighlightBox
          active={zone === 'toolbar'}
          title="WorkbenchToolbar"
          copy="Поиск, фильтр, summary."
        />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <HighlightBox
            active={zone === 'list'}
            title="LessonGrid"
            copy="Коллекция карточек и выбор текущего урока."
          />
          <HighlightBox
            active={zone === 'details'}
            title="LessonDetails"
            copy="Выбранный урок и draft заметки."
          />
        </div>
      </div>
    </section>
  );
}

function HighlightBox({
  active,
  title,
  copy,
}: {
  active: boolean;
  title: string;
  copy: string;
}) {
  return (
    <div
      className={clsx(
        'rounded-[24px] border p-4 transition',
        active ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-slate-200 bg-slate-50',
      )}
    >
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
    </div>
  );
}

function NodeView({ node, depth }: { node: ComponentNode; depth: number }) {
  return (
    <div style={{ marginLeft: depth * 18 }}>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="font-semibold text-slate-900">{node.label}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{node.role}</p>
      </div>
      {node.children?.length ? (
        <div className="mt-3 space-y-3">
          {node.children.map((child) => (
            <NodeView
              key={`${node.label}-${child.label}`}
              node={child}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
