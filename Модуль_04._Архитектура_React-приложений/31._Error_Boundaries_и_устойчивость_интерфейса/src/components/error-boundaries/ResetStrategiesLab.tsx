import clsx from 'clsx';
import { useState } from 'react';

import { describeResetGuidance } from '../../lib/boundary-reset-model';
import { CrashSurface } from './CrashSurface';
import { LessonErrorBoundary } from './LessonErrorBoundary';

type Scenario = 'stable' | 'broken';

export function ResetStrategiesLab() {
  const [scenario, setScenario] = useState<Scenario>('stable');
  const [boundaryVersion, setBoundaryVersion] = useState(1);
  const [resetNotes, setResetNotes] = useState<string[]>([]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(['stable', 'broken'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setScenario(value)}
              className={clsx(
                'rounded-xl px-4 py-2 text-sm font-medium transition',
                scenario === value
                  ? value === 'stable'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              )}
            >
              {value === 'stable' ? 'Стабильный input' : 'Сломанный input'}
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              setBoundaryVersion((current) => current + 1);
              setResetNotes((current) =>
                [
                  describeResetGuidance('remount', scenario === 'stable'),
                  ...current,
                ].slice(0, 4),
              );
            }}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Remount через key
          </button>
        </div>

        <p className="text-sm leading-6 text-slate-600">
          Сломайте входные данные, затем попробуйте разные стратегии. Особенно хорошо
          видно, что простой retry не лечит причину ошибки сам по себе.
        </p>

        <LessonErrorBoundary
          key={boundaryVersion}
          label="Редактор профиля"
          resetKeys={[scenario]}
          onReset={(reason) => {
            setResetNotes((current) =>
              [describeResetGuidance(reason, scenario === 'stable'), ...current].slice(
                0,
                4,
              ),
            );
          }}
          fallbackRender={({ error, reset }) => (
            <div className="space-y-4 rounded-[28px] border border-rose-300 bg-rose-50 p-6">
              <div>
                <h3 className="text-xl font-semibold text-rose-950">
                  Subtree ждёт reset strategy
                </h3>
                <p className="mt-2 text-sm leading-6 text-rose-900">
                  Boundary уже изолировал сбой. Теперь важно не просто нажать retry, а
                  выбрать способ восстановления, который действительно меняет причину
                  падения.
                </p>
              </div>
              <div className="rounded-2xl border border-rose-300 bg-white px-4 py-4 text-sm leading-6 text-rose-900">
                {error.message}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800"
                >
                  Retry без изменений
                </button>
                <button
                  type="button"
                  onClick={() => setScenario('stable')}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  Исправить input
                </button>
              </div>
            </div>
          )}
        >
          <CrashSurface
            label="Редактор профиля"
            summary="Здесь компонент рендерится нормально, пока входные данные остаются валидными."
            mode={scenario === 'broken' ? 'render' : 'safe'}
          />
        </LessonErrorBoundary>
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Что происходит сейчас
          </p>
          <p className="mt-3 text-lg font-semibold text-slate-900">
            {scenario === 'stable' ? 'Input исправен' : 'Input всё ещё сломан'}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {scenario === 'stable'
              ? 'Теперь retry и resetKeys могут вернуть subtree в рабочее состояние.'
              : 'Пока причина сбоя не устранена, обычный retry почти наверняка вернёт тот же fallback.'}
          </p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Журнал reset
          </p>
          {resetNotes.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
              {resetNotes.map((note) => (
                <li
                  key={note}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  {note}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Пока boundary не сбрасывался. Переключите сцену или нажмите remount.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
