import { useState } from 'react';

import {
  nestedSandboxSeed,
  releaseBoardSeed,
  reviewBoardSeed,
} from '../../lib/context-domain';
import {
  createWorkspaceState,
  getWorkspaceSummary,
} from '../../lib/workspace-reducer-model';
import { WorkspaceProvider } from '../../state/WorkspaceProvider';
import { useWorkspaceDispatch } from '../../state/useWorkspaceDispatch';
import { useWorkspaceState } from '../../state/useWorkspaceState';
import { MetricCard } from '../ui';

function ScopeBody({ title }: { title: string }) {
  const state = useWorkspaceState();
  const dispatch = useWorkspaceDispatch();
  const summary = getWorkspaceSummary(state);
  const firstItem = state.items[0];

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Ближайший provider создаёт собственный island состояния для этой ветки.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <MetricCard
          label="Open"
          value={String(summary.openCount)}
          hint="Изменения видны только в пределах текущего provider scope."
          tone="cool"
        />
        <MetricCard
          label="Focused"
          value={summary.focusedTitle}
          hint="Наружный и соседний provider не получают этот focus."
        />
      </div>

      {firstItem ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => dispatch({ type: 'focus/set', id: firstItem.id })}
            className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Focus first item
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'item/toggleResolved', id: firstItem.id })}
            className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Toggle first item
          </button>
        </div>
      ) : null}
    </div>
  );
}

function NestedSandbox() {
  const [nestedState] = useState(() =>
    createWorkspaceState('Nested training sandbox', nestedSandboxSeed),
  );

  return (
    <WorkspaceProvider initialState={nestedState}>
      <ScopeBody title="Внутренний provider" />
    </WorkspaceProvider>
  );
}

function BoundaryScope({
  title,
  initialScope,
  allowNested = false,
}: {
  title: string;
  initialScope: ReturnType<typeof createWorkspaceState>;
  allowNested?: boolean;
}) {
  const [showNested, setShowNested] = useState(false);

  return (
    <WorkspaceProvider initialState={initialScope}>
      <div className="space-y-4">
        <ScopeBody title={title} />

        {allowNested ? (
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <button
              type="button"
              onClick={() => setShowNested((current) => !current)}
              className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              {showNested ? 'Скрыть внутренний provider' : 'Показать внутренний provider'}
            </button>

            {showNested ? (
              <div className="mt-4">
                <NestedSandbox />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </WorkspaceProvider>
  );
}

export function ProviderBoundaryLab() {
  const [leftState] = useState(() =>
    createWorkspaceState('Editorial scope', reviewBoardSeed),
  );
  const [rightState] = useState(() =>
    createWorkspaceState('Release scope', releaseBoardSeed),
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Главная идея"
          value="Nearest provider wins"
          hint="Компонент читает ближайший provider, а не любой внешний context того же типа."
          tone="cool"
        />
        <MetricCard
          label="Изоляция"
          value="State islands"
          hint="Соседние scope не меняют друг друга, если у каждого свой provider."
        />
        <MetricCard
          label="Риск"
          value="Provider too high"
          hint="Если граница слишком широкая, в неё начинают стекаться лишние локальные детали."
          tone="accent"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <BoundaryScope
            title="Внешний provider секции"
            initialScope={leftState}
            allowNested
          />
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <BoundaryScope
            title="Соседний provider другой секции"
            initialScope={rightState}
          />
        </div>
      </div>
    </div>
  );
}
