import clsx from 'clsx';

import { getMatchedTreePaths } from '../../lib/path-model';
import type { RouteTreeNode } from '../../lib/routing-domain';

function TreeNode({
  node,
  activeIds,
  depth = 0,
}: {
  node: RouteTreeNode;
  activeIds: readonly string[];
  depth?: number;
}) {
  const isActive = activeIds.includes(node.id);

  return (
    <div className="space-y-3">
      <div
        className={clsx(
          'rounded-2xl border px-4 py-3',
          isActive ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white',
        )}
        style={{ marginLeft: depth * 18 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {node.label}
        </p>
        <p className="mt-2 text-sm font-medium text-slate-900">{node.path}</p>
      </div>

      {node.children?.map((child) => (
        <TreeNode key={child.id} node={child} activeIds={activeIds} depth={depth + 1} />
      ))}
    </div>
  );
}

export function RouteTreeVisualizer({
  tree,
  pathname,
}: {
  tree: RouteTreeNode;
  pathname: string;
}) {
  const activeIds = getMatchedTreePaths(tree, pathname);

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        Текущий pathname: <strong>{pathname}</strong>
      </div>
      <TreeNode node={tree} activeIds={activeIds} />
    </div>
  );
}
