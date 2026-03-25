import { useState } from 'react';

import {
  evaluateConcurrencyStrategy,
  type LagSeverity,
  type UpdatePattern,
} from '../../lib/concurrency-playbook-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function ConcurrencyPlaybookLab() {
  const [lagSeverity, setLagSeverity] = useState<LagSeverity>('noticeable');
  const [updatePattern, setUpdatePattern] = useState<UpdatePattern>('filter-list');
  const [resultCanLag, setResultCanLag] = useState(true);
  const [needsPendingIndicator, setNeedsPendingIndicator] = useState(true);
  const [startedOutsideComponent, setStartedOutsideComponent] = useState(false);
  const [structuralProblemLikely, setStructuralProblemLikely] = useState(false);

  const verdict = evaluateConcurrencyStrategy({
    lagSeverity,
    updatePattern,
    resultCanLag,
    needsPendingIndicator,
    startedOutsideComponent,
    structuralProblemLikely,
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Verdict"
          value={verdict.verdict}
          hint={verdict.guidance}
          tone="accent"
        />
        <MetricCard
          label="Recommended tool"
          value={verdict.recommendedTool}
          hint={
            'Модель выбирает не "самый модный" API, а тот, который соответствует источнику лагов и форме UX.'
          }
          tone="cool"
        />
        <MetricCard
          label="Update pattern"
          value={updatePattern}
          hint="Concurrent APIs сильнее всего помогают там, где есть separate urgent feedback и expensive non-urgent view update."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Concurrent decision playbook
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Сначала определяйте источник лагов, потом выбирайте concurrent API
            </h2>
          </div>
          <StatusPill
            tone={
              verdict.recommendedTool === 'measure-first'
                ? 'error'
                : verdict.recommendedTool === 'none'
                  ? 'warn'
                  : 'success'
            }
          >
            {verdict.recommendedTool}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Lag severity</span>
              <select
                aria-label="Lag severity"
                value={lagSeverity}
                onChange={(event) => setLagSeverity(event.target.value as LagSeverity)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="none">None</option>
                <option value="noticeable">Noticeable</option>
                <option value="high">High</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Update pattern</span>
              <select
                aria-label="Update pattern"
                value={updatePattern}
                onChange={(event) =>
                  setUpdatePattern(event.target.value as UpdatePattern)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="single-field">Single field</option>
                <option value="filter-list">Filter list</option>
                <option value="screen-switch">Screen switch</option>
                <option value="remote-refresh">Remote refresh</option>
              </select>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={resultCanLag}
                onChange={(event) => setResultCanLag(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                Результат может немного отставать от input
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={needsPendingIndicator}
                onChange={(event) => setNeedsPendingIndicator(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                Нужен явный pending indicator
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={startedOutsideComponent}
                onChange={(event) => setStartedOutsideComponent(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                Обновление запускается императивно и вне обычного hook-потока
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={structuralProblemLikely}
                onChange={(event) => setStructuralProblemLikely(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                Похоже, что проблема скорее архитектурная, чем приоритетная
              </span>
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel className="space-y-3 border-cyan-200 bg-cyan-50">
              <p className="text-sm font-semibold text-cyan-950">Рекомендация</p>
              <p className="text-sm leading-6 text-cyan-950/80">{verdict.guidance}</p>
            </Panel>
            <ListBlock
              title="Что проверить в проекте"
              items={[
                'Есть ли отдельный срочный feedback, который нужно сохранить плавным?',
                'Может ли результат немного отставать без потери смысла?',
                'Не вызван ли лаг лишней шириной рендера или тяжёлой структурой данных?',
              ]}
            />
          </div>
        </div>
      </Panel>
    </div>
  );
}
