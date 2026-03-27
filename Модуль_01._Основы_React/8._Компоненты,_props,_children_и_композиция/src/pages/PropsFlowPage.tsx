import { useState } from 'react';

import { PropsFlowPreview } from '../components/composition/PropsFlowPreview';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildFlowReport,
  defaultFlowState,
  type Emphasis,
  type LastChanged,
  type FlowState,
} from '../lib/props-flow-model';
import { getProjectStudy } from '../lib/project-study';

export function PropsFlowPage() {
  const [state, setState] = useState<FlowState>(defaultFlowState);
  const [lastChanged, setLastChanged] = useState<LastChanged>('track');
  const report = buildFlowReport(state, lastChanged);
  const study = getProjectStudy('props-flow');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Как props проходят по дереву компонентов"
        copy="Родительский компонент владеет состоянием и передаёт данные вниз. Изменение props влияет не на абстрактный «весь экран», а на конкретные поддеревья, которые эти props реально получают."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Параметры дерева</h2>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Track</span>
            <select
              value={state.track}
              onChange={(event) => {
                setState((current) => ({
                  ...current,
                  track: event.target.value as FlowState['track'],
                }));
                setLastChanged('track');
              }}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {['all', 'react-core', 'design-systems', 'testing'].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Density</span>
            <select
              value={state.density}
              onChange={(event) => {
                setState((current) => ({
                  ...current,
                  density: event.target.value as FlowState['density'],
                }));
                setLastChanged('density');
              }}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {['comfortable', 'compact'].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Emphasis</span>
            <select
              value={state.emphasis}
              onChange={(event) => {
                setState((current) => ({
                  ...current,
                  emphasis: event.target.value as Emphasis,
                }));
                setLastChanged('emphasis');
              }}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {['availability', 'mentor', 'duration'].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-medium">Только открытые</span>
            <input
              type="checkbox"
              checked={state.showOnlyOpen}
              onChange={(event) => {
                setState((current) => ({
                  ...current,
                  showOnlyOpen: event.target.checked,
                }));
                setLastChanged('availability');
              }}
            />
          </label>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Visible lessons"
              value={String(report.visibleLessonCount)}
              hint="Столько карточек осталось после фильтрации."
              tone="cool"
            />
            <MetricCard
              label="Affected components"
              value={String(report.affectedComponents.length)}
              hint="Столько уровней дерева напрямую зависят от последнего изменённого prop."
            />
            <MetricCard
              label="Last changed"
              value={lastChanged}
              hint="Последнее изменение помогает увидеть, какое именно поддерево должно обновиться."
              tone="accent"
            />
          </div>

          <Panel className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Поток props</h2>
            <p className="text-sm leading-6 text-slate-600">{report.summary}</p>
            <div className="flex flex-wrap gap-2">
              {report.affectedComponents.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                >
                  {item}
                </span>
              ))}
            </div>
            <PropsFlowPreview tree={report.tree} />
          </Panel>

          <CodeBlock label="Верхний компонент дерева" code={report.snippet} />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
