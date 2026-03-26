import { useState } from 'react';

import { chooseSuspenseStrategy } from '../../lib/suspense-playbook-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function SuspensePlaybookLab() {
  const [codeSplitNeeded, setCodeSplitNeeded] = useState(true);
  const [dataReadInRender, setDataReadInRender] = useState(true);
  const [htmlNeededBeforeJs, setHtmlNeededBeforeJs] = useState(false);
  const [screenRevealsInParts, setScreenRevealsInParts] = useState(true);
  const [oneSlowBlockShouldNotHideWholeScreen, setOneSlowBlockShouldNotHideWholeScreen] =
    useState(true);
  const [serverCanStream, setServerCanStream] = useState(true);

  const decision = chooseSuspenseStrategy({
    codeSplitNeeded,
    dataReadInRender,
    htmlNeededBeforeJs,
    screenRevealsInParts,
    oneSlowBlockShouldNotHideWholeScreen,
    serverCanStream,
  });

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Suspense playbook</span>
          <p className="text-sm leading-6 text-slate-600">
            Этот playbook помогает понять, где нужен просто локальный spinner, а где
            действительно оправданы split boundaries, `use(Promise)`, lazy или server
            streaming.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={codeSplitNeeded}
              onChange={(event) => setCodeSplitNeeded(event.target.checked)}
              className="mr-3"
            />
            Нужен code splitting
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={dataReadInRender}
              onChange={(event) => setDataReadInRender(event.target.checked)}
              className="mr-3"
            />
            Данные читаются как ресурс в render
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={htmlNeededBeforeJs}
              onChange={(event) => setHtmlNeededBeforeJs(event.target.checked)}
              className="mr-3"
            />
            HTML нужен до загрузки JS
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={screenRevealsInParts}
              onChange={(event) => setScreenRevealsInParts(event.target.checked)}
              className="mr-3"
            />
            Экран естественно раскрывается по частям
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={oneSlowBlockShouldNotHideWholeScreen}
              onChange={(event) =>
                setOneSlowBlockShouldNotHideWholeScreen(event.target.checked)
              }
              className="mr-3"
            />
            Один медленный блок не должен скрывать весь экран
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={serverCanStream}
              onChange={(event) => setServerCanStream(event.target.checked)}
              className="mr-3"
            />
            Сервер умеет streaming
          </label>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Выбор"
          value={decision.primaryTool}
          hint={decision.reason}
          tone="accent"
        />
        <MetricCard
          label="Рисков"
          value={String(decision.risks.length)}
          hint="Suspense-подход нужен только там, где его цена оправдана структурой экрана."
          tone="cool"
        />
        <div className="panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Вердикт
          </p>
          <div className="mt-3">
            <StatusPill tone="success">
              Сначала проектируйте reveal и ожидание, потом выбирайте API
            </StatusPill>
          </div>
        </div>
      </div>

      <Panel>
        <ListBlock title="Что проверить перед внедрением" items={decision.risks} />
      </Panel>
    </div>
  );
}
