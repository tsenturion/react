import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  describeRouteSplitScenario,
  type RouteSplitStrategy,
  type RouteTarget,
} from '../../lib/route-split-model';
import { BeforeAfter, MetricCard, Panel } from '../ui';

export function RouteCodeSplitLab() {
  const location = useLocation();
  const [strategy, setStrategy] = useState<RouteSplitStrategy>('lazy-pages');
  const [target, setTarget] = useState<RouteTarget>('analytics');

  const diagnosis = describeRouteSplitScenario({
    strategy,
    target,
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Current route"
          value={location.pathname}
          hint="Страницы этого урока уже грузятся как отдельные lazy page chunks через router shell."
          tone="accent"
        />
        <MetricCard
          label="Fallback scope"
          value={diagnosis.fallbackScope}
          hint={diagnosis.tradeoff}
          tone="cool"
        />
        <MetricCard
          label="Shell persistence"
          value={diagnosis.shellPersistence}
          hint="Route code splitting ценен тем, что shell может пережить переход и не схлопнуться целиком."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Route-level code splitting
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            URL и экран уже дают естественную границу для разделения кода по маршрутам
          </h2>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Split strategy</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'eager-all', label: 'Eager all' },
                  { value: 'lazy-pages', label: 'Lazy pages' },
                  { value: 'lazy-pages-and-tools', label: 'Pages + tools' },
                  { value: 'oversplit', label: 'Over-split' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setStrategy(item.value as RouteSplitStrategy)}
                    className={strategy === item.value ? 'chip chip-active' : 'chip'}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Target route</span>
              <select
                aria-label="Target route"
                value={target}
                onChange={(event) => setTarget(event.target.value as RouteTarget)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="overview">Overview</option>
                <option value="analytics">Analytics</option>
                <option value="settings">Settings</option>
                <option value="editor">Editor</option>
              </select>
            </label>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
              Попробуйте реальные переходы между лабораториями этого урока:
              <div className="mt-3 flex flex-wrap gap-2">
                <Link className="chip" to="/component-lazy-loading">
                  Component split
                </Link>
                <Link className="chip" to="/suspense-boundaries">
                  Suspense boundaries
                </Link>
                <Link className="chip" to="/progressive-loading">
                  Progressive loading
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">
                Strategy result for {diagnosis.targetLabel}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                <strong>Shell:</strong> {diagnosis.shellPersistence}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                <strong>Fallback scope:</strong> {diagnosis.fallbackScope}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                <strong>Trade-off:</strong> {diagnosis.tradeoff}
              </p>
            </div>

            <BeforeAfter
              beforeTitle="Слишком рано"
              before="Когда весь роутер грузится eagerly, редкие тяжёлые экраны бьют по первому payload даже для коротких сессий."
              afterTitle="Устойчивый split"
              after="Когда shell остаётся на месте, а route chunk грузится отдельно, переход остаётся понятным и контролируемым."
            />
          </div>
        </div>
      </Panel>
    </div>
  );
}
