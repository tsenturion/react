import clsx from 'clsx';

import { useLintRuleStore } from '../../hooks/useLintRuleStore';
import type { StoreRuleFlag } from '../../lib/rule-store';
import { MetricCard, StatusPill } from '../ui';

const storeFlags: readonly { key: StoreRuleFlag; label: string }[] = [
  { key: 'stableIds', label: 'Stable ids' },
  { key: 'debugHooks', label: 'Debug labels' },
  { key: 'syncSnapshot', label: 'Sync snapshot' },
  { key: 'pureRender', label: 'Pure render' },
  { key: 'safeRefs', label: 'Safe refs' },
] as const;

function StoreMirrorCard({ title, description }: { title: string; description: string }) {
  const store = useLintRuleStore();

  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <StatusPill tone={store.summary.tone}>{store.summary.tone}</StatusPill>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <MetricCard
          label="Активных флагов"
          value={`${store.summary.enabledCount}/${store.summary.totalCount}`}
          hint="Оба зеркала читают один и тот же snapshot внешнего store."
        />
        <MetricCard
          label="Revision"
          value={String(store.snapshot.revision)}
          hint="Каждое изменение store повышает общую ревизию."
          tone="cool"
        />
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Последнее действие
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {store.snapshot.lastAction}
        </p>
      </div>
    </article>
  );
}

export function SyncExternalStoreLab() {
  const store = useLintRuleStore();

  return (
    <div className="grid gap-6 xl:grid-cols-[340px,1fr]">
      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Управление store
          </p>
          <div className="mt-4 flex gap-2">
            {(['recommended', 'recommended-latest'] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => store.setPreset(preset)}
                className={clsx(
                  'rounded-xl px-3 py-2 text-sm font-medium transition',
                  store.snapshot.preset === preset
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100',
                )}
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {storeFlags.map((flag) => (
              <button
                key={flag.key}
                type="button"
                onClick={() => store.toggleFlag(flag.key)}
                className={clsx(
                  'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition',
                  store.snapshot[flag.key]
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                    : 'border-rose-300 bg-rose-50 text-rose-950',
                )}
              >
                <span className="text-sm font-medium">{flag.label}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  {store.snapshot[flag.key] ? 'on' : 'off'}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={store.reset}
            className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Сбросить внешний store
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <StoreMirrorCard
            title="Зеркало A"
            description="Один компонент подписан на store и читает snapshot напрямую."
          />
          <StoreMirrorCard
            title="Зеркало B"
            description="Второй компонент не получает props, но видит тот же state."
          />
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-900">
            Почему здесь нужен именно useSyncExternalStore
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            React должен читать внешний state как согласованный snapshot.
            `useSyncExternalStore` гарантирует, что оба зеркала видят одну и ту же версию
            данных и корректно переподписываются на изменения store.
          </p>
        </div>
      </div>
    </div>
  );
}
