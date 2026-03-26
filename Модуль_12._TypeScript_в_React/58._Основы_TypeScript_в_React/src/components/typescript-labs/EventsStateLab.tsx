import { useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';

import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';
import {
  buildEditingState,
  parseScoreInput,
  validateReviewDraft,
  type ReviewDraft,
  type SubmitState,
} from '../../lib/events-state-model';

const initialDraft: ReviewDraft = {
  title: 'Typed feedback',
  score: 7,
  urgent: false,
};

function describeSubmitState(state: SubmitState): string {
  switch (state.status) {
    case 'idle':
      return 'Изменений пока нет.';
    case 'editing':
      return `Грязные поля: ${state.dirtyFields.join(', ')}`;
    case 'submitting':
      return `Отправка в очереди №${state.queuePosition}`;
    case 'success':
      return `Успех: ${state.receipt}`;
    case 'error':
      return `${state.field}: ${state.message}`;
  }
}

export function EventsStateLab() {
  const [title, setTitle] = useState(initialDraft.title);
  const [scoreRaw, setScoreRaw] = useState(String(initialDraft.score));
  const [urgent, setUrgent] = useState(initialDraft.urgent);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });

  const score = parseScoreInput(scoreRaw) ?? 0;
  const draft: ReviewDraft = { title, score, urgent };
  const editingState = buildEditingState(draft, initialDraft);

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.currentTarget.value);
  }

  function handleScoreChange(event: ChangeEvent<HTMLInputElement>) {
    setScoreRaw(event.currentTarget.value);
  }

  function handleUrgentChange(event: ChangeEvent<HTMLInputElement>) {
    setUrgent(event.currentTarget.checked);
  }

  function handleShortcut(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      setSubmitState(validateReviewDraft(draft));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextState = validateReviewDraft(draft);
    setSubmitState(
      nextState.status === 'success'
        ? { status: 'submitting', queuePosition: 2 }
        : nextState,
    );
  }

  return (
    <Panel className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]"
      >
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <label className="space-y-2 text-sm text-slate-700">
            <span className="block font-medium">Title</span>
            <input
              value={title}
              onChange={handleTitleChange}
              onKeyDown={handleShortcut}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span className="block font-medium">Score</span>
            <input
              value={scoreRaw}
              onChange={handleScoreChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
            />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={urgent} onChange={handleUrgentChange} />
            Mark as urgent
          </label>
          <button
            type="submit"
            className="inline-flex rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white"
          >
            Submit typed form
          </button>
        </div>

        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Typed event trace</h3>
            <StatusPill tone={submitState.status === 'error' ? 'error' : 'success'}>
              {submitState.status}
            </StatusPill>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            Здесь обработчики читают значения через `currentTarget`, а submit-ветка идёт
            через union-состояние вместо набора независимых флагов.
          </p>
        </div>
      </form>

      <div className="grid gap-4 xl:grid-cols-3">
        <MetricCard
          label="Editing state"
          value={editingState.status}
          hint={describeSubmitState(editingState)}
          tone="accent"
        />
        <MetricCard
          label="Submit state"
          value={submitState.status}
          hint={describeSubmitState(submitState)}
          tone="cool"
        />
        <MetricCard
          label="Parsed score"
          value={String(score)}
          hint="Сырые данные из input проходят через typed parse step."
          tone="dark"
        />
      </div>

      <ListBlock
        title="Что здесь делает TypeScript"
        items={[
          'ChangeEvent<HTMLInputElement> подсказывает, что значение надо брать из currentTarget.value.',
          'FormEvent<HTMLFormElement> показывает источник submit и не смешивается с произвольным DOM-событием.',
          'SubmitState как union не даёт забыть отдельную ветку успеха или ошибки.',
        ]}
      />
    </Panel>
  );
}
