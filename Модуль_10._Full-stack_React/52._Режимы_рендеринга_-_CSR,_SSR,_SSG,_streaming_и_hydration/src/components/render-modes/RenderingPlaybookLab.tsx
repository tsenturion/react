import { useMemo, useState } from 'react';

import { chooseRenderingStrategy } from '../../lib/rendering-playbook-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function RenderingPlaybookLab() {
  const [seoCritical, setSeoCritical] = useState(true);
  const [pageMostlyStatic, setPageMostlyStatic] = useState(false);
  const [contentChangesPerRequest, setContentChangesPerRequest] = useState(true);
  const [personalizedAboveFold, setPersonalizedAboveFold] = useState(false);
  const [fastShellMatters, setFastShellMatters] = useState(true);
  const [heavyInteractiveWidgets, setHeavyInteractiveWidgets] = useState(false);
  const [serverCanStream, setServerCanStream] = useState(true);

  const decision = useMemo(
    () =>
      chooseRenderingStrategy({
        seoCritical,
        pageMostlyStatic,
        contentChangesPerRequest,
        personalizedAboveFold,
        fastShellMatters,
        heavyInteractiveWidgets,
        serverCanStream,
      }),
    [
      contentChangesPerRequest,
      fastShellMatters,
      heavyInteractiveWidgets,
      pageMostlyStatic,
      personalizedAboveFold,
      seoCritical,
      serverCanStream,
    ],
  );

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Decision assistant</span>
          <p className="text-sm leading-6 text-slate-600">
            Эта форма не подбирает «самый модный» режим. Она проверяет, нужен ли сервер
            вообще, можно ли кэшировать HTML заранее и действительно ли требуется
            streaming.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={seoCritical}
              onChange={(event) => setSeoCritical(event.target.checked)}
              className="mr-3"
            />
            SEO критичен
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={pageMostlyStatic}
              onChange={(event) => setPageMostlyStatic(event.target.checked)}
              className="mr-3"
            />
            Страница в основном статична
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={contentChangesPerRequest}
              onChange={(event) => setContentChangesPerRequest(event.target.checked)}
              className="mr-3"
            />
            Контент меняется на каждый запрос
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={personalizedAboveFold}
              onChange={(event) => setPersonalizedAboveFold(event.target.checked)}
              className="mr-3"
            />
            Персонализация нужна above the fold
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={fastShellMatters}
              onChange={(event) => setFastShellMatters(event.target.checked)}
              className="mr-3"
            />
            Быстрый shell важнее полной готовности
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={heavyInteractiveWidgets}
              onChange={(event) => setHeavyInteractiveWidgets(event.target.checked)}
              className="mr-3"
            />
            Экран тяжело интерактивен
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 md:col-span-2 xl:col-span-3">
            <input
              type="checkbox"
              checked={serverCanStream}
              onChange={(event) => setServerCanStream(event.target.checked)}
              className="mr-3"
            />
            Инфраструктура умеет streaming SSR
          </label>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Выбор"
          value={decision.primaryMode.toUpperCase()}
          hint={decision.reason}
          tone="accent"
        />
        <MetricCard
          label="Рисков"
          value={String(decision.risks.length)}
          hint="У каждого режима есть цена: кэш, hydration, серверная стоимость или потеря SEO."
          tone="cool"
        />
        <div className="panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Почему не иначе
          </p>
          <div className="mt-3">
            <StatusPill tone="warn">
              Если признак говорит «статично и SEO важно», переход на SSR только усложнит
              проект
            </StatusPill>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{decision.reason}</p>
        </div>
      </div>

      <Panel>
        <ListBlock title="На что смотреть до выбора режима" items={decision.risks} />
      </Panel>
    </div>
  );
}
