import { useState } from 'react';

import {
  evaluateOptimizationNeed,
  type InteractionFrequency,
  type LagSeverity,
  type MeasurementState,
  type SurfaceScope,
  type SuspectedCause,
} from '../../lib/performance-advisor-model';
import { ListBlock, StatusPill } from '../ui';

export function OptimizationAdvisorLab() {
  const [lagSeverity, setLagSeverity] = useState<LagSeverity>('slight');
  const [frequency, setFrequency] = useState<InteractionFrequency>('regular');
  const [scope, setScope] = useState<SurfaceScope>('section');
  const [suspectedCause, setSuspectedCause] = useState<SuspectedCause>('wide-rerender');
  const [measurement, setMeasurement] = useState<MeasurementState>('rough-signal');

  const verdict = evaluateOptimizationNeed({
    lagSeverity,
    frequency,
    scope,
    suspectedCause,
    measurement,
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Диагностические вопросы
        </p>

        <div className="mt-4 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Насколько заметен лаг
            </span>
            <select
              value={lagSeverity}
              onChange={(event) => setLagSeverity(event.target.value as LagSeverity)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            >
              <option value="none">Не заметен</option>
              <option value="slight">Слегка заметен</option>
              <option value="obvious">Явно заметен</option>
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Частота действия</span>
            <select
              value={frequency}
              onChange={(event) =>
                setFrequency(event.target.value as InteractionFrequency)
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            >
              <option value="rare">Редко</option>
              <option value="regular">Регулярно</option>
              <option value="constant">Постоянно</option>
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Область влияния</span>
            <select
              value={scope}
              onChange={(event) => setScope(event.target.value as SurfaceScope)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            >
              <option value="leaf">Leaf</option>
              <option value="section">Section</option>
              <option value="screen">Screen</option>
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Подозреваемая причина
            </span>
            <select
              value={suspectedCause}
              onChange={(event) =>
                setSuspectedCause(event.target.value as SuspectedCause)
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            >
              <option value="unknown">Пока непонятно</option>
              <option value="wide-rerender">Wide rerender</option>
              <option value="heavy-derivation">Heavy derivation</option>
              <option value="heavy-row">Heavy row</option>
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Степень измерения</span>
            <select
              value={measurement}
              onChange={(event) => setMeasurement(event.target.value as MeasurementState)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            >
              <option value="not-yet">Ещё не измерялось</option>
              <option value="rough-signal">Есть rough signal</option>
              <option value="measured">Есть измеренный сценарий</option>
            </select>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Вердикт
              </p>
              <p className="mt-2 text-2xl font-semibold">{verdict.verdict}</p>
            </div>
            <StatusPill tone={verdict.tone}>{verdict.tone}</StatusPill>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">{verdict.nextMove}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5">
            <ListBlock
              title="Следующий шаг"
              items={[verdict.nextMove, 'Сначала лечите причину, а не счётчик рендеров.']}
            />
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5">
            <ListBlock title="Чего не делать" items={verdict.dontDo} />
          </div>
        </div>
      </div>
    </div>
  );
}
