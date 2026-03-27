import clsx from 'clsx';
import { useState } from 'react';

import {
  buildStateStrategyReport,
  type StrategyGoal,
  type StrategySituation,
} from '../../lib/strategy-playbook-model';
import { CodeBlock, ListBlock, StatusPill } from '../ui';

export function StateStrategyPlaybookLab() {
  const [goal, setGoal] = useState<StrategyGoal>('preserve');
  const [situation, setSituation] = useState<StrategySituation>('switch-entity');
  const report = buildStateStrategyReport(goal, situation);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setGoal('preserve')}
          className={clsx('chip', goal === 'preserve' && 'chip-active')}
        >
          Сохранить state
        </button>
        <button
          type="button"
          onClick={() => setGoal('reset')}
          className={clsx('chip', goal === 'reset' && 'chip-active')}
        >
          Сбросить state
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          ['switch-entity', 'Смена сущности'],
          ['reorder-list', 'Reorder списка'],
          ['visual-layout', 'Layout / docking'],
          ['branch-toggle', 'Условные ветки'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setSituation(value as StrategySituation)}
            className={clsx('chip', situation === value && 'chip-active')}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <StatusPill tone={report.tone}>{report.title}</StatusPill>
            <p className="mt-4 text-sm leading-6 text-slate-700">{report.technique}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{report.why}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{report.risk}</p>
          </div>

          <CodeBlock label="Рекомендуемый шаблон" code={report.snippet} />
        </div>

        <div className="space-y-5">
          <ListBlock
            title="Быстрые правила"
            items={[
              'Если state должен жить у сущности, свяжите его с id, а не с текущим экраном.',
              'Если нужен полный reset, меняйте key или component type осознанно.',
              'Если меняется только layout, старайтесь не двигать JSX между разными слотами.',
            ]}
          />
        </div>
      </div>
    </div>
  );
}
