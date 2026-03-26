import { Suspense, use, useState } from 'react';

import {
  clientScenes,
  getClientScene,
  type ClientSceneId,
  type PanelId,
} from '../../lib/suspense-resource-model';
import { readScenePanel } from '../../lib/suspense-resource-store';
import { MetricCard, Panel, StatusPill } from '../ui';

type BoundaryMode = 'single' | 'split';

function ScenePanel({
  sceneId,
  panelId,
  revision,
}: {
  sceneId: ClientSceneId;
  panelId: PanelId;
  revision: number;
}) {
  // use(Promise) делает ожидание частью render phase: компонент читает ресурс
  // прямо во время рендера, а Suspense boundary берёт на себя временное состояние.
  const payload = use(readScenePanel(sceneId, panelId, revision));

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{payload.title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
        {payload.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

function PanelFallback({ label }: { label: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Эта часть экрана ждёт ресурс внутри своей собственной границы.
      </p>
    </div>
  );
}

export function ClientSuspenseLab() {
  const [sceneId, setSceneId] = useState<ClientSceneId>('release');
  const [boundaryMode, setBoundaryMode] = useState<BoundaryMode>('split');
  const [revision, setRevision] = useState(0);

  const scene = getClientScene(sceneId);
  const slowestPanel = scene.panels.reduce((slowest, panel) =>
    panel.delayMs > slowest.delayMs ? panel : slowest,
  );

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Client boundaries</span>
          <p className="text-sm leading-6 text-slate-600">
            Один и тот же набор данных можно ждать либо одной общей границей, либо
            несколькими локальными. Разница сразу видна по тому, сколько UI остаётся
            доступным во время ожидания.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-wrap gap-2">
            {clientScenes.map((sceneOption) => (
              <button
                key={sceneOption.id}
                type="button"
                onClick={() => setSceneId(sceneOption.id)}
                className={`chip ${sceneId === sceneOption.id ? 'chip-active' : ''}`}
              >
                {sceneOption.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button
              type="button"
              onClick={() => setBoundaryMode('single')}
              className={`chip ${boundaryMode === 'single' ? 'chip-active' : ''}`}
            >
              Одна граница
            </button>
            <button
              type="button"
              onClick={() => setBoundaryMode('split')}
              className={`chip ${boundaryMode === 'split' ? 'chip-active' : ''}`}
            >
              Раздельные границы
            </button>
            <button
              type="button"
              onClick={() => setRevision((current) => current + 1)}
              className="chip"
            >
              Перезапросить ресурсы
            </button>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-600">{scene.note}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Самый медленный блок: <strong>{slowestPanel.label}</strong> (
            {slowestPanel.delayMs}
            ms).
          </p>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Boundary mode"
          value={boundaryMode === 'single' ? 'Single' : 'Split'}
          hint="Меняет размер области, которая может уйти в fallback."
          tone="accent"
        />
        <MetricCard
          label="Revision"
          value={String(revision)}
          hint="Каждый новый revision создаёт новый resource key и повторно запускает чтение."
          tone="cool"
        />
        <div className="panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Что важно
          </p>
          <div className="mt-3">
            <StatusPill tone={boundaryMode === 'split' ? 'success' : 'warn'}>
              {boundaryMode === 'split'
                ? 'Медленный блок локализован'
                : 'Медленный блок влияет на весь экран'}
            </StatusPill>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Suspense не загружает данные сам по себе. Он только определяет, какая часть UI
            временно ждёт ресурс и как именно это ожидание выглядит для пользователя.
          </p>
        </div>
      </div>

      {boundaryMode === 'single' ? (
        <Suspense
          fallback={
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-800">
                Waiting for the whole workspace
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Одна медленная секция откатывает сразу всю рабочую область к общему
                fallback.
              </p>
            </div>
          }
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {scene.panels.map((panel) => (
              <ScenePanel
                key={`${panel.id}:${revision}`}
                sceneId={sceneId}
                panelId={panel.id}
                revision={revision}
              />
            ))}
          </div>
        </Suspense>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {scene.panels.map((panel) => (
            <Suspense
              key={`${panel.id}:${revision}`}
              fallback={<PanelFallback label={`${panel.label} ждёт отдельно`} />}
            >
              <ScenePanel sceneId={sceneId} panelId={panel.id} revision={revision} />
            </Suspense>
          ))}
        </div>
      )}
    </div>
  );
}
