import clsx from 'clsx';

import type { ComponentTreeNode } from '../../lib/component-tree-model';

export function ComponentTreeView({
  nodes,
  selectedId,
  onSelect,
}: {
  nodes: ComponentTreeNode[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="space-y-3">
      {nodes.map((node) => (
        <TreeBranch
          key={node.id}
          node={node}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

function TreeBranch({
  node,
  selectedId,
  onSelect,
}: {
  node: ComponentTreeNode;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <li className="space-y-3">
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        className={clsx(
          'w-full rounded-[24px] border px-4 py-4 text-left transition',
          selectedId === node.id
            ? 'border-blue-500 bg-blue-50 shadow-sm'
            : 'border-slate-200 bg-white hover:bg-slate-50',
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">{node.label}</span>
          {node.ownsState ? (
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
              state owner
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-600">{node.role}</p>
      </button>

      {node.children.length > 0 ? (
        <ul className="ml-4 space-y-3 border-l border-slate-200 pl-4">
          {node.children.map((child) => (
            <TreeBranch
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
