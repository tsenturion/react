import clsx from 'clsx';
import { useId, useState } from 'react';

import { createReviewerProfiles } from '../../lib/state-identity-domain';
import { buildPositionBindingReport } from '../../lib/state-position-model';
import { StatusPill } from '../ui';

const profiles = createReviewerProfiles().slice(0, 2);

export function PositionAnchorLab() {
  const [activeId, setActiveId] = useState(profiles[0].id);
  const [compact, setCompact] = useState(false);
  const activeProfile =
    profiles.find((profile) => profile.id === activeId) ?? profiles[0];
  const report = buildPositionBindingReport({
    sameComponentType: true,
    sameTreeSlot: true,
    keyChanged: false,
  });

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
            {profile.name} · {profile.role}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setCompact((current) => !current)}
          className={clsx('chip', compact && 'chip-active')}
        >
          {compact ? 'Компактный вид' : 'Просторный вид'}
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <StableDraftCard profile={activeProfile} compact={compact} />

        <aside className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <StatusPill tone={report.tone}>{report.title}</StatusPill>
          <p className="mt-4 text-sm leading-6 text-slate-700">{report.summary}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{report.consequence}</p>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
              <dt className="font-semibold text-slate-900">Текущий slot</dt>
              <dd className="mt-1 text-slate-600">
                `App → main → lab[0] → StableDraftCard`
              </dd>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
              <dt className="font-semibold text-slate-900">Что меняется</dt>
              <dd className="mt-1 text-slate-600">Только props и CSS-классы.</dd>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
              <dt className="font-semibold text-slate-900">Что не меняется</dt>
              <dd className="mt-1 text-slate-600">
                Identity экземпляра и его local state.
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function StableDraftCard({
  profile,
  compact,
}: {
  profile: (typeof profiles)[number];
  compact: boolean;
}) {
  const instanceId = `slot-${useId()}`;
  const [checkpoints, setCheckpoints] = useState(0);
  // Значение из props используется только в момент mount текущего экземпляра.
  // Когда profile меняется, React не создаёт новый state, пока component type и slot те же.
  const [draft, setDraft] = useState(profile.seedDraft);
  const [mountedAt] = useState(() => new Date().toLocaleTimeString('ru-RU'));

  return (
    <section
      className={clsx(
        'rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all',
        compact ? 'p-4' : 'p-6',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Stable slot demo
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {profile.seedTitle}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Props уже относятся к {profile.name}, но local draft принадлежит тому же
            экземпляру карточки.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Instance</p>
          <p className="mt-1 font-mono text-xs">{instanceId}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
            mounted {mountedAt}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Активные props
          </p>
          <p className="mt-2 text-base font-semibold text-slate-900">{profile.role}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{profile.seedDraft}</p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Local state
          </p>
          <p className="mt-2 text-base font-semibold text-blue-950">{draft}</p>
          <p className="mt-2 text-sm leading-6 text-blue-900/80">
            Это значение не переинициализируется от новых props автоматически.
          </p>
        </div>

        <div className="rounded-2xl bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Checkpoints
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-amber-950">
            {checkpoints}
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-900/80">
            Счётчик тоже принадлежит экземпляру, а не текущим props.
          </p>
        </div>
      </div>

      <label className="mt-6 block space-y-2 text-sm text-slate-700">
        <span className="font-medium">Локальный draft текущего экземпляра</span>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={compact ? 3 : 5}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setCheckpoints((current) => current + 1)}
          className="chip"
        >
          Добавить checkpoint
        </button>
        <button
          type="button"
          onClick={() => setDraft(profile.seedDraft)}
          className="chip"
        >
          Перенять текущие props вручную
        </button>
      </div>
    </section>
  );
}
