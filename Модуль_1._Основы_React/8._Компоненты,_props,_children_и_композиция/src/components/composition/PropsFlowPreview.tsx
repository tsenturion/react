import type { FlowNode } from '../../lib/props-flow-model';

function FlowBranch({ node, depth = 0 }: { node: FlowNode; depth?: number }) {
  return (
    <div className="space-y-3">
      <article
        className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
        style={{ marginLeft: depth * 18 }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900">{node.name}</h3>
          {node.receivedProps.map((item) => (
            <span
              key={item}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
            >
              {item}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{node.note}</p>
      </article>

      {node.children.map((child) => (
        <FlowBranch
          key={`${node.name}-${child.name}-${child.note}`}
          node={child}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

export function PropsFlowPreview({ tree }: { tree: FlowNode }) {
  return <FlowBranch node={tree} />;
}
