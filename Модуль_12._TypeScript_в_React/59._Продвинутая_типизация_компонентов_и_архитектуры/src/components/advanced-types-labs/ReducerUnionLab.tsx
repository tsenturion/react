import { useReducer, useState } from 'react';

import { CodeBlock, ListBlock, MetricCard, StatusPill } from '../ui';
import {
  createInitialComposerState,
  describeCurrentBranch,
  summarizeEditor,
  typedReducerSnippet,
  workflowReducer,
  looseReducerSnippet,
  type ComposerKind,
} from '../../lib/reducer-union-model';

const kindOptions: readonly { id: ComposerKind; label: string }[] = [
  { id: 'announcement', label: 'Announcement' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'approval', label: 'Approval' },
] as const;

export function ReducerUnionLab() {
  // Именно `useReducer` здесь лучше всего показывает, как union связывает
  // transitions и shape текущей ветки редактора.
  const [state, dispatch] = useReducer(workflowReducer, undefined, () =>
    createInitialComposerState(),
  );
  const [nextChecklistItem, setNextChecklistItem] = useState('');
  const [nextApprover, setNextApprover] = useState('');
  const editor = state.editor;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {kindOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => dispatch({ type: 'select-kind', kind: option.id })}
            className={`chip ${editor.kind === option.id ? 'chip-active' : ''}`}
          >
            {option.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => dispatch({ type: 'reset-editor' })}
          className="chip"
        >
          Reset branch
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Active editor branch
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{editor.kind}</h3>
            </div>
            <StatusPill tone="success">{describeCurrentBranch(editor)}</StatusPill>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input
              value={editor.title}
              onChange={(event) =>
                dispatch({ type: 'update-title', value: event.currentTarget.value })
              }
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
              aria-label="Editor title"
            />
          </label>

          {editor.kind === 'announcement' ? (
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Message</span>
                <textarea
                  value={editor.message}
                  onChange={(event) =>
                    dispatch({
                      type: 'update-message',
                      value: event.currentTarget.value,
                    })
                  }
                  className="min-h-28 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
                  aria-label="Message"
                />
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={editor.highlight}
                  onChange={() => dispatch({ type: 'toggle-highlight' })}
                />
                Highlight this update in the dashboard
              </label>
            </div>
          ) : null}

          {editor.kind === 'checklist' ? (
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  value={nextChecklistItem}
                  onChange={(event) => setNextChecklistItem(event.currentTarget.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
                  aria-label="Checklist item"
                  placeholder="Добавить typed migration step"
                />
                <button
                  type="button"
                  onClick={() => {
                    dispatch({
                      type: 'add-checklist-item',
                      label: nextChecklistItem,
                    });
                    setNextChecklistItem('');
                  }}
                  className="rounded-2xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white"
                >
                  Add item
                </button>
              </div>
              <ul className="space-y-3">
                {editor.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <label className="flex items-center gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() =>
                          dispatch({
                            type: 'toggle-checklist-item',
                            id: item.id,
                          })
                        }
                      />
                      <span>{item.label}</span>
                    </label>
                    <StatusPill tone={item.done ? 'success' : 'warn'}>
                      {item.done ? 'done' : 'pending'}
                    </StatusPill>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {editor.kind === 'approval' ? (
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  value={nextApprover}
                  onChange={(event) => setNextApprover(event.currentTarget.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
                  aria-label="Approver name"
                  placeholder="Добавить reviewer"
                />
                <button
                  type="button"
                  onClick={() => {
                    dispatch({
                      type: 'add-approver',
                      name: nextApprover,
                    });
                    setNextApprover('');
                  }}
                  className="rounded-2xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white"
                >
                  Add approver
                </button>
              </div>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Required approvals
                </span>
                <input
                  type="range"
                  min={1}
                  max={Math.max(1, editor.approvers.length)}
                  value={editor.requiredCount}
                  onChange={(event) =>
                    dispatch({
                      type: 'set-required-count',
                      value: Number(event.currentTarget.value),
                    })
                  }
                  aria-label="Required approvals"
                  className="w-full accent-sky-700"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {editor.approvers.map((approver) => (
                  <span
                    key={approver}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
                  >
                    {approver}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="Current branch"
              value={editor.kind}
              hint="Union branch определяет, какие поля и переходы вообще существуют в этом режиме."
              tone="accent"
            />
            <MetricCard
              label="Summary"
              value={summarizeEditor(editor)}
              hint="Одна функция summary читает editor branch exhaustively."
              tone="cool"
            />
          </div>

          <MetricCard
            label="Recent reducer actions"
            value={state.actionLog.join(' -> ')}
            hint="Лог показывает, что transitions формализованы как action union, а не как произвольные field updates."
            tone="dark"
          />

          <div className="grid gap-4 xl:grid-cols-2">
            <CodeBlock label="Typed reducer" code={typedReducerSnippet} />
            <CodeBlock label="Loose reducer" code={looseReducerSnippet} />
          </div>

          <ListBlock
            title="Почему эта модель полезна"
            items={[
              'Новая action type сразу требует обновить reducer exhaustively.',
              'Каждая ветка editor state имеет собственные поля и transitions.',
              'Reducer остаётся чистой функцией и хорошо тестируется вне компонента.',
            ]}
          />
        </div>
      </div>
    </div>
  );
}
