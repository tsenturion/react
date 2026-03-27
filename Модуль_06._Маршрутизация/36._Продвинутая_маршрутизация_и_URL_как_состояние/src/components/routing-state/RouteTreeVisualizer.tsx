import clsx from 'clsx';

import { getMatchedTreePaths } from '../../lib/path-model';
import type { RouteTreeNode } from '../../lib/routing-domain';

export function RouteTreeVisualizer({
  tree,
  pathname,
}: {
  tree: RouteTreeNode;
  pathname: string;
}) {
  const activeNodes = new Set(getMatchedTreePaths(tree, pathname));

  function renderNode(node: RouteTreeNode, depth = 0) {
    const isActive = activeNodes.has(node.id);

    return (
      <div key={node.id} className="space-y-3">
        <div
          className={clsx(
            'rounded-2xl border px-4 py-3 transition',
            isActive
              ? 'border-blue-300 bg-blue-50 text-blue-950'
              : 'border-slate-200 bg-white text-slate-700',
          )}
          style={{ marginLeft: depth * 12 }}
        >
          <p className="text-sm font-semibold">{node.label}</p>
          <code
            className={clsx(
              'mt-2 block text-xs break-all',
              isActive ? 'text-blue-700' : 'text-slate-500',
            )}
          >
            {node.path}
          </code>
        </div>
        {node.children?.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  }

  return <div className="space-y-3">{renderNode(tree)}</div>;
}
