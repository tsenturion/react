import { useState, type ReactNode } from 'react';

import { CodeBlock, ListBlock, MetricCard, Panel, StatusPill } from '../ui';
import {
  buildContractReports,
  getPropsScenario,
  type PropsScenarioId,
} from '../../lib/props-contract-model';

type TypedLessonCardProps = {
  title: string;
  tone: 'info' | 'warn';
  children: ReactNode;
} & (
  | { actionKind: 'link'; href: string; onAction?: never }
  | { actionKind: 'button'; onAction: () => void; href?: never }
);

function TypedLessonCard(props: TypedLessonCardProps) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{props.title}</h3>
        <StatusPill tone={props.tone === 'warn' ? 'warn' : 'success'}>
          {props.tone}
        </StatusPill>
      </div>
      <div className="mt-3 text-sm leading-6 text-slate-600">{props.children}</div>

      {props.actionKind === 'link' ? (
        <a
          href={props.href}
          className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Перейти
        </a>
      ) : (
        <button
          type="button"
          onClick={props.onAction}
          className="mt-4 inline-flex rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Выполнить
        </button>
      )}
    </article>
  );
}

const scenarioOptions: readonly { id: PropsScenarioId; label: string }[] = [
  { id: 'lesson-card', label: 'Lesson card' },
  { id: 'toolbar-action', label: 'Toolbar action' },
  { id: 'notice-panel', label: 'Notice panel' },
] as const;

export function PropsContractsLab() {
  const [scenarioId, setScenarioId] = useState<PropsScenarioId>('lesson-card');
  const [actionKind, setActionKind] = useState<'link' | 'button'>('button');
  const [tone, setTone] = useState<'info' | 'warn'>('info');
  const [actionCount, setActionCount] = useState(0);
  const scenario = getPropsScenario(scenarioId);
  const reports = buildContractReports();

  return (
    <Panel className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {scenarioOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setScenarioId(option.id)}
                className={`chip ${scenarioId === option.id ? 'chip-active' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-sm leading-6 text-slate-600">{scenario.blurb}</p>
        </div>

        <div className="space-y-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Live component
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActionKind('button')}
              className={`chip ${actionKind === 'button' ? 'chip-active' : ''}`}
            >
              Button mode
            </button>
            <button
              type="button"
              onClick={() => setActionKind('link')}
              className={`chip ${actionKind === 'link' ? 'chip-active' : ''}`}
            >
              Link mode
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTone('info')}
              className={`chip ${tone === 'info' ? 'chip-active' : ''}`}
            >
              Info
            </button>
            <button
              type="button"
              onClick={() => setTone('warn')}
              className={`chip ${tone === 'warn' ? 'chip-active' : ''}`}
            >
              Warn
            </button>
          </div>
        </div>
      </div>

      <TypedLessonCard
        title={scenario.label}
        tone={tone}
        {...(actionKind === 'button'
          ? { actionKind, onAction: () => setActionCount((count) => count + 1) }
          : { actionKind, href: '#typed-link' })}
      >
        <div className="space-y-2">
          <p>Контракт компонента виден прямо в типе: режим действия выбирается явно.</p>
          <p>Локальный счётчик действий: {actionCount}</p>
        </div>
      </TypedLessonCard>

      <div className="grid gap-4 xl:grid-cols-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">{report.label}</h3>
              <StatusPill
                tone={report.recommendation === 'recommended' ? 'success' : 'warn'}
              >
                {report.apiClarity}
              </StatusPill>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{report.summary}</p>
            <div className="mt-4 grid gap-3">
              <MetricCard
                label="API clarity"
                value={report.apiClarity}
                hint="Насколько очевидна допустимая форма props."
              />
              <MetricCard
                label="Runtime risk"
                value={report.runtimeRisk}
                hint="Как часто некорректные комбинации попадут уже в работающий UI."
                tone="accent"
              />
              <MetricCard
                label="Editor help"
                value={report.editorHelp}
                hint="Сколько полезной обратной связи IDE даёт до запуска приложения."
                tone="cool"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label="Typed contract" code={scenario.typedSnippet} />
        <CodeBlock label="Loose contract" code={scenario.looseSnippet} />
      </div>

      <ListBlock title="Что даёт typed version" items={scenario.wins} />
    </Panel>
  );
}
