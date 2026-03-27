import {
  startTransition as scheduleBackground,
  useMemo,
  useState,
  useTransition,
} from 'react';

import {
  filterWorkbenchItems,
  focusPresets,
  type Domain,
} from '../../lib/priority-workbench-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function TransitionPriorityLab() {
  const [draftQuery, setDraftQuery] = useState('forms');
  const [committedQuery, setCommittedQuery] = useState('forms');
  const [domain, setDomain] = useState<Domain>('all');
  const [lastSchedulingMode, setLastSchedulingMode] = useState('useTransition');
  const [isPending, startTransition] = useTransition();

  const results = useMemo(
    () => filterWorkbenchItems(committedQuery, domain).slice(0, 6),
    [committedQuery, domain],
  );

  function handleTyping(nextValue: string) {
    setDraftQuery(nextValue);

    // Срочное значение поля обновляется сразу, а тяжёлая рабочая доска догоняет его
    // отдельным non-urgent update. Так input не делит приоритет с expensive list render.
    startTransition(() => {
      setCommittedQuery(nextValue);
      setLastSchedulingMode('useTransition');
    });
  }

  function applyPreset(presetId: (typeof focusPresets)[number]['id']) {
    const preset = focusPresets.find((item) => item.id === presetId);

    if (!preset) {
      return;
    }

    scheduleBackground(() => {
      setDraftQuery(preset.query);
      setCommittedQuery(preset.query);
      setDomain(preset.domain);
      setLastSchedulingMode('startTransition');
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Urgent echo"
          value={draftQuery || 'empty'}
          hint="То, что вы печатаете сейчас. Это значение обязано обновляться немедленно."
          tone="accent"
        />
        <MetricCard
          label="Board query"
          value={committedQuery || 'empty'}
          hint="Тяжёлая рабочая доска может немного отставать от urgent input, если обновляется как transition."
          tone="cool"
        />
        <MetricCard
          label="Pending"
          value={isPending ? 'background update' : 'idle'}
          hint="useTransition даёт явный индикатор, когда non-urgent update ещё не завершился."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Urgent search input
              </span>
              <input
                value={draftQuery}
                onChange={(event) => {
                  handleTyping(event.target.value);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Domain</span>
              <select
                value={domain}
                onChange={(event) => {
                  const nextDomain = event.target.value as Domain;
                  startTransition(() => {
                    setDomain(nextDomain);
                    setLastSchedulingMode('useTransition');
                  });
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="all">All</option>
                <option value="forms">Forms</option>
                <option value="server">Server</option>
                <option value="routing">Routing</option>
                <option value="compiler">Compiler</option>
              </select>
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Preset board switch
              </span>
              <div className="flex flex-wrap gap-2">
                {focusPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      applyPreset(preset.id);
                    }}
                    className="chip"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-700">
              <p className="font-semibold text-slate-900">Последний scheduling путь</p>
              <p className="mt-2">{lastSchedulingMode}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-white p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Workbench
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Результаты строятся по non-urgent query и могут отставать от срочного
                  поля ввода.
                </p>
              </div>
              <StatusPill tone={isPending ? 'warn' : 'success'}>
                {isPending ? 'transition pending' : 'ready'}
              </StatusPill>
            </div>

            <ul className="grid gap-3 md:grid-cols-2">
              {results.map((item) => (
                <li
                  key={item.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white">
                      {item.domain}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>

      <ListBlock
        title="Что важно в этой лаборатории"
        items={[
          'useTransition нужен там, где background update должен явно показывать pending пользователю.',
          'standalone startTransition полезен для несрочного события, если отдельный isPending не нужен.',
          'Срочное input-значение не должно ехать в transition вместе с тяжёлой рабочей доской.',
        ]}
      />
    </div>
  );
}
