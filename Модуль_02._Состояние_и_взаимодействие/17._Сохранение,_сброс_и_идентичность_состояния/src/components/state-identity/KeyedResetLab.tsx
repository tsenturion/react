import clsx from 'clsx';
import { useCallback, useEffect, useId, useState } from 'react';

import { buildKeyResetReport } from '../../lib/key-reset-model';
import { createReviewerProfiles } from '../../lib/state-identity-domain';
import { StatusPill } from '../ui';

const profiles = createReviewerProfiles();

export function KeyedResetLab() {
  const [activeId, setActiveId] = useState(profiles[0].id);
  const [useKey, setUseKey] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const activeProfile =
    profiles.find((profile) => profile.id === activeId) ?? profiles[0];
  const report = buildKeyResetReport(useKey);

  const appendLog = useCallback((message: string) => {
    setLogs((current) =>
      [`${new Date().toLocaleTimeString('ru-RU')} · ${message}`, ...current].slice(0, 10),
    );
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            type="button"
            onClick={() => setActiveId(profile.id)}
            className={clsx('chip', activeId === profile.id && 'chip-active')}
          >
            {profile.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setUseKey((current) => !current)}
          className={clsx('chip', useKey && 'chip-active')}
        >
          {useKey ? 'key = profile.id' : 'без key'}
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <StatusPill tone={report.tone}>{report.title}</StatusPill>
            <p className="mt-3 text-sm leading-6 text-slate-700">{report.summary}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{report.risk}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Текущий identity key: {useKey ? activeProfile.id : 'shared-composer'}
            </p>
          </div>

          {
            // Изменение key делает даже тот же component type новым экземпляром.
            // Без key React держит один и тот же ComposerCard и переносит его local state дальше.
          }
          <ComposerCard
            key={useKey ? activeProfile.id : 'shared-composer'}
            profile={activeProfile}
            onLog={appendLog}
          />
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Что происходит при переключении
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            {logs.length > 0 ? (
              logs.map((entry) => (
                <li key={entry} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  {entry}
                </li>
              ))
            ) : (
              <li className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                Переключите профиль и режим `key`, чтобы увидеть remount или reuse.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ComposerCard({
  profile,
  onLog,
}: {
  profile: (typeof profiles)[number];
  onLog: (message: string) => void;
}) {
  const instanceId = `composer-${useId()}`;
  // Этот local state либо продолжает жить при reuse,
  // либо заново инициализируется после remount из-за нового key.
  const [subject, setSubject] = useState(profile.seedTitle);
  const [draft, setDraft] = useState(profile.seedDraft);
  const [priority, setPriority] = useState<'normal' | 'high'>('normal');

  useEffect(() => {
    onLog(`Composer ${instanceId} смонтирован.`);

    return () => {
      onLog(`Composer ${instanceId} снят перед следующим identity cycle.`);
    };
  }, [instanceId, onLog]);

  useEffect(() => {
    onLog(`Composer ${instanceId} сейчас показывает props для ${profile.name}.`);
  }, [instanceId, onLog, profile.name]);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Recipient composer
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {profile.name} · {profile.role}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Здесь сразу видно, остаётся ли черновик у того же экземпляра или начинается
            заново после смены identity.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Instance</p>
          <p className="mt-1 font-mono text-xs">{instanceId}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-medium">Тема сообщения</span>
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-medium">Приоритет</span>
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as 'normal' | 'high')}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400"
          >
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <label className="mt-4 block space-y-2 text-sm text-slate-700">
        <span className="font-medium">Черновик</span>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={5}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400"
        />
      </label>
    </section>
  );
}
