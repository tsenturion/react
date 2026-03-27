import clsx from 'clsx';
import { useState } from 'react';

import {
  consumerProfiles,
  containerFeatures,
  type ContainerFeatureId,
} from '../../lib/context-domain';
import { evaluateGlobalContainer } from '../../lib/architecture-strategy-model';
import { MetricCard, StatusPill } from '../ui';

export function GlobalContainerLab() {
  const [selectedFeatures, setSelectedFeatures] = useState<ContainerFeatureId[]>([
    'theme',
    'session',
    'workspace',
  ]);
  const [consumerId, setConsumerId] = useState(consumerProfiles[0]?.id ?? 'toolbar');

  const consumer =
    consumerProfiles.find((profile) => profile.id === consumerId) ?? consumerProfiles[0]!;
  const report = evaluateGlobalContainer(selectedFeatures, consumer.needs);

  function toggleFeature(id: ContainerFeatureId) {
    setSelectedFeatures((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone={report.tone}>{report.tone}</StatusPill>
        <p className="text-sm leading-6 text-slate-600">{report.headline}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Выбрано полей"
          value={String(selectedFeatures.length)}
          hint="Чем больше несвязанных concerns живут в одном provider, тем выше coupling."
          tone={report.tone === 'success' ? 'cool' : 'accent'}
        />
        <MetricCard
          label="Irrelevant for branch"
          value={String(report.irrelevantFeatures.length)}
          hint="Сколько полей текущая ветка даже не должна знать, но всё равно видит через общий контейнер."
        />
        <MetricCard
          label="Overload score"
          value={String(report.overloadScore)}
          hint={report.summary}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Ветка-потребитель
            </p>
            <div className="mt-4 grid gap-2">
              {consumerProfiles.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => setConsumerId(profile.id)}
                  className={clsx(
                    'rounded-xl border px-3 py-3 text-left text-sm transition',
                    consumerId === profile.id
                      ? 'border-blue-500 bg-blue-50 text-blue-950'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                  )}
                >
                  {profile.title}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Что положить в один AppContext
            </p>
            <div className="mt-4 grid gap-2">
              {containerFeatures.map((feature) => (
                <label
                  key={feature.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature.id)}
                    onChange={() => toggleFeature(feature.id)}
                  />
                  <span>
                    <span className="block text-sm font-medium text-slate-800">
                      {feature.label}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-slate-600">
                      {feature.summary}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">{consumer.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Эта ветка реально нуждается только в:{' '}
              <strong>{consumer.needs.join(', ')}</strong>
            </p>

            <div className="mt-4 grid gap-3 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Лишние поля в контейнере
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  {report.irrelevantFeatures.length > 0 ? (
                    report.irrelevantFeatures.map((feature) => (
                      <li
                        key={feature}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                      >
                        {feature}
                      </li>
                    ))
                  ) : (
                    <li className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                      Ничего лишнего
                    </li>
                  )}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Как разделить ответственность
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  {report.suggestions.map((suggestion) => (
                    <li
                      key={suggestion}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">
              Распределение по владельцам
            </p>
            <div className="mt-4 grid gap-3 xl:grid-cols-2">
              {(['context', 'scoped-context', 'local', 'server'] as const).map(
                (owner) => (
                  <div
                    key={owner}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {owner}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {containerFeatures
                        .filter((feature) => feature.recommendedOwner === owner)
                        .map((feature) => (
                          <span
                            key={feature.id}
                            className={clsx(
                              'rounded-full px-3 py-1 text-sm font-medium',
                              selectedFeatures.includes(feature.id)
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-500',
                            )}
                          >
                            {feature.label}
                          </span>
                        ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
