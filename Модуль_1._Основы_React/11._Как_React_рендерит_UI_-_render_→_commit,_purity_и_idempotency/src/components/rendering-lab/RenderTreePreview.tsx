import type { RenderTreeNode } from '../../lib/rerender-trigger-model';
import { StatusPill } from '../ui';

function TreeBranch({ node, depth = 0 }: { node: RenderTreeNode; depth?: number }) {
  return (
    <div className="space-y-3">
      <div
        className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
        style={{ marginLeft: depth * 16 }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold text-slate-900">{node.label}</p>
          <StatusPill tone={node.rerendered ? 'warn' : 'success'}>
            {node.rerendered ? 'render вызван' : 'ветка стабильна'}
          </StatusPill>
          {node.outputChanged ? (
            <StatusPill tone="error">output изменился</StatusPill>
          ) : null}
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{node.reason}</p>
      </div>

      {(node.children ?? []).map((child) => (
        <TreeBranch key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export function RenderTreePreview({ tree }: { tree: RenderTreeNode }) {
  return <TreeBranch node={tree} />;
}
