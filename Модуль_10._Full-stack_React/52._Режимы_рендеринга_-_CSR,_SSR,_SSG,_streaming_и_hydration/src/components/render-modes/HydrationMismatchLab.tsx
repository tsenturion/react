import { useMemo, useState } from 'react';

import { buildHydrationSnapshot, type LocaleId } from '../../lib/hydration-model';
import { CodeBlock, ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function HydrationMismatchLab() {
  const [serverLocale, setServerLocale] = useState<LocaleId>('ru-RU');
  const [clientLocale, setClientLocale] = useState<LocaleId>('en-US');
  const [timeDependentText, setTimeDependentText] = useState(true);
  const [randomDependentText, setRandomDependentText] = useState(false);
  const [localeDependentText, setLocaleDependentText] = useState(true);
  const [browserOnlyBranch, setBrowserOnlyBranch] = useState(false);

  const snapshot = useMemo(
    () =>
      buildHydrationSnapshot({
        serverLocale,
        clientLocale,
        timeDependentText,
        randomDependentText,
        localeDependentText,
        browserOnlyBranch,
        orderCount: 12500,
      }),
    [
      browserOnlyBranch,
      clientLocale,
      localeDependentText,
      randomDependentText,
      serverLocale,
      timeDependentText,
    ],
  );

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Mismatch simulator</span>
          <p className="text-sm leading-6 text-slate-600">
            Включайте нестабильные источники initial render и смотрите, как серверный и
            клиентский HTML начинают расходиться ещё до первого пользовательского
            действия.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Server locale</span>
              <select
                value={serverLocale}
                onChange={(event) => setServerLocale(event.target.value as LocaleId)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
              >
                <option value="ru-RU">ru-RU</option>
                <option value="en-US">en-US</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Client locale</span>
              <select
                value={clientLocale}
                onChange={(event) => setClientLocale(event.target.value as LocaleId)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
              >
                <option value="ru-RU">ru-RU</option>
                <option value="en-US">en-US</option>
              </select>
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={timeDependentText}
                onChange={(event) => setTimeDependentText(event.target.checked)}
                className="mr-3"
              />
              Зависимость от времени
            </label>
            <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={randomDependentText}
                onChange={(event) => setRandomDependentText(event.target.checked)}
                className="mr-3"
              />
              Случайные значения
            </label>
            <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={localeDependentText}
                onChange={(event) => setLocaleDependentText(event.target.checked)}
                className="mr-3"
              />
              Locale formatting
            </label>
            <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={browserOnlyBranch}
                onChange={(event) => setBrowserOnlyBranch(event.target.checked)}
                className="mr-3"
              />
              Browser-only ветка
            </label>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Hydration status"
          value={snapshot.mismatch ? 'Mismatch' : 'Match'}
          hint="Совпадает ли первый HTML между сервером и клиентом."
          tone={snapshot.mismatch ? 'accent' : 'cool'}
        />
        <MetricCard
          label="Причин"
          value={String(snapshot.issues.length)}
          hint="Сколько нестабильных источников сейчас влияет на первый рендер."
        />
        <div className="panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Verdict
          </p>
          <div className="mt-3">
            <StatusPill tone={snapshot.mismatch ? 'error' : 'success'}>
              {snapshot.mismatch
                ? 'Разметка сервера и клиента расходится'
                : 'Initial render стабилен'}
            </StatusPill>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Чем меньше первый проход зависит от времени, случайности и browser-only API,
            тем чище гидрация и тем меньше шансов на скрытые проблемы после SSR/SSG.
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label="Server HTML" code={snapshot.serverHtml} />
        <CodeBlock label="Client first render" code={snapshot.clientHtml} />
      </div>

      <Panel className="space-y-5">
        <h3 className="text-xl font-semibold text-slate-900">
          Что именно сейчас ломает hydration
        </h3>
        {snapshot.issues.length === 0 ? (
          <p className="text-sm leading-6 text-slate-600">
            В текущем наборе флагов mismatch не возникает: сервер и клиент проходят через
            один и тот же initial render.
          </p>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {snapshot.issues.map((issue) => (
              <div
                key={issue.id}
                className="rounded-[24px] border border-rose-200 bg-rose-50 p-5"
              >
                <h4 className="text-base font-semibold text-rose-950">{issue.title}</h4>
                <p className="mt-3 text-sm leading-6 text-rose-900">{issue.why}</p>
                <p className="mt-3 text-sm leading-6 text-rose-800">{issue.prevention}</p>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel>
        <ListBlock
          title="Порядок отладки mismatch"
          items={[
            'Сначала сравните, какие значения сервер и клиент использовали в самом первом рендере.',
            'Потом проверьте время, случайные значения, locale formatting и browser-only ветки.',
            'Лишь затем решайте, что стабилизировать данными, что отложить до effect, а что вынести в клиентскую часть дерева.',
          ]}
        />
      </Panel>
    </div>
  );
}
