import clsx from 'clsx';
import { useState } from 'react';

import { createEventLessons } from '../../lib/event-domain';
import {
  buildEventFlowSnapshot,
  filterEventLessons,
  toggleHandled,
  type EventFlowState,
} from '../../lib/event-flow-model';
import { Panel, StatusPill } from '../ui';

type TraceEntry = {
  action: string;
  stateEffect: string;
  uiEffect: string;
};

const initialLessons = createEventLessons();

function createInitialState(): EventFlowState {
  return {
    onlyUnhandled: false,
    selectedId: initialLessons[0]?.id ?? null,
    lessons: createEventLessons(),
  };
}

export function EventToRenderLab() {
  const [eventState, setEventState] = useState<EventFlowState>(createInitialState);
  const [trace, setTrace] = useState<TraceEntry[]>([]);

  // Visible lessons намеренно вычисляются от текущего state,
  // а не хранятся отдельным useState, чтобы не плодить рассинхрон.
  const visibleLessons = filterEventLessons(eventState.lessons, eventState.onlyUnhandled);
  const snapshot = buildEventFlowSnapshot(eventState);

  function appendTrace(entry: TraceEntry) {
    setTrace((current) => [entry, ...current].slice(0, 8));
  }

  function commitNextState(
    nextState: EventFlowState,
    action: string,
    stateEffect: string,
  ) {
    setEventState(nextState);

    const nextSnapshot = buildEventFlowSnapshot(nextState);
    appendTrace({
      action,
      stateEffect,
      uiEffect: `Новый render показал ${nextSnapshot.visibleCount} элементов, выбран: ${nextSnapshot.selectedTitle}.`,
    });
  }

  function handleToggleFilter() {
    const nextOnlyUnhandled = !eventState.onlyUnhandled;
    const nextVisible = filterEventLessons(eventState.lessons, nextOnlyUnhandled);
    const nextSelectedId = nextVisible.some((item) => item.id === eventState.selectedId)
      ? eventState.selectedId
      : (nextVisible[0]?.id ?? null);

    commitNextState(
      {
        ...eventState,
        onlyUnhandled: nextOnlyUnhandled,
        selectedId: nextSelectedId,
      },
      nextOnlyUnhandled
        ? 'Включён фильтр onlyUnhandled'
        : 'Фильтр onlyUnhandled выключен',
      `state.onlyUnhandled = ${String(nextOnlyUnhandled)}`,
    );
  }

  function handleSelectLesson(lessonId: string) {
    commitNextState(
      {
        ...eventState,
        selectedId: lessonId,
      },
      `Выбран урок ${lessonId}`,
      `state.selectedId = "${lessonId}"`,
    );
  }

  function handleToggleHandled(lessonId: string) {
    const nextLessons = toggleHandled(eventState.lessons, lessonId);
    const nextVisible = filterEventLessons(nextLessons, eventState.onlyUnhandled);
    const nextSelectedId = nextVisible.some((item) => item.id === eventState.selectedId)
      ? eventState.selectedId
      : (nextVisible[0]?.id ?? null);

    commitNextState(
      {
        ...eventState,
        lessons: nextLessons,
        selectedId: nextSelectedId,
      },
      `Переключено handled у ${lessonId}`,
      'state.lessons обновлён через immutable map(...)',
    );
  }

  function resetLab() {
    setEventState(createInitialState());
    setTrace([]);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleToggleFilter}
            className={clsx('chip', eventState.onlyUnhandled && 'chip-active')}
          >
            Только необработанные
          </button>
          <button type="button" onClick={resetLab} className="chip">
            Сбросить сценарий
          </button>
        </div>

        <div className="grid gap-4">
          {visibleLessons.map((lesson) => {
            const isSelected = lesson.id === eventState.selectedId;
            return (
              <div
                key={lesson.id}
                className={clsx(
                  'rounded-[24px] border p-4 transition',
                  isSelected ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white',
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold text-slate-900">
                        {lesson.title}
                      </p>
                      <StatusPill tone={lesson.handled ? 'success' : 'warn'}>
                        {lesson.handled ? 'handled' : 'pending'}
                      </StatusPill>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">
                      Фаза: <code>{lesson.phase}</code>, кликов:{' '}
                      <code>{lesson.clicks}</code>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectLesson(lesson.id)}
                      className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                    >
                      Выбрать
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleHandled(lesson.id)}
                      className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      Переключить handled
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Event → state → UI</h3>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Visible
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {snapshot.visibleCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Handled
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {snapshot.handledCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Selected
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {snapshot.selectedTitle}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {trace.length > 0 ? (
            trace.map((entry, index) => (
              <div
                key={`${entry.action}-${index}`}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <p className="text-sm font-semibold text-slate-900">{entry.action}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {entry.stateEffect}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{entry.uiEffect}</p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-500">
              Нажмите любую кнопку слева. После пользовательского действия здесь появится
              трассировка изменения state и визуального результата.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
