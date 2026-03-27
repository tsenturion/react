import { useState } from 'react';

import {
  CatalogSummaryPanel,
  CatalogSurface,
  FeaturedCatalogStrip,
} from '../components/catalog/CatalogSurface';
import {
  BeforeAfter,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  catalogItems,
  defaultCatalogOptions,
  deriveCatalogView,
} from '../lib/catalog-domain';
import { projectStudy } from '../lib/project-study';
import {
  evaluateReactValue,
  reuseLevels,
  surfaceModes,
  type ReuseLevel,
  type SurfaceMode,
} from '../lib/react-value-model';

export function ReactValuePage() {
  const [surfaceMode, setSurfaceMode] = useState<SurfaceMode>('interactive');
  const [reuseLevel, setReuseLevel] = useState<ReuseLevel>('shared');
  const [hasSharedState, setHasSharedState] = useState(true);

  const scenario = evaluateReactValue(surfaceMode, reuseLevel, hasSharedState);
  const previewView = deriveCatalogView({
    ...defaultCatalogOptions,
    onlyStable: surfaceMode === 'static',
    sortMode: reuseLevel === 'system' ? 'alphabetical' : 'priority',
    focusTag: surfaceMode === 'scaling' ? 'composition' : 'react',
  });

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="React Intro"
        title="Что такое React и где он начинает быть нужен"
        copy="React полезен не потому, что умеет рисовать кнопки сам по себе, а потому что помогает описывать интерфейс как дерево компонентов, зависящее от данных и состояния. Ниже можно менять сложность экрана и смотреть, когда ручной DOM становится слишком дорогим."
        aside={
          <div className="space-y-3">
            <StatusPill tone={scenario.tone}>
              {scenario.tone === 'success'
                ? 'React уже оправдан'
                : 'React пока опционален'}
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">{scenario.recommendation}</p>
          </div>
        }
      />

      <Panel className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-800">Сложность экрана</p>
            <div className="flex flex-wrap gap-2">
              {surfaceModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSurfaceMode(mode.id)}
                  className={`chip ${surfaceMode === mode.id ? 'chip-active' : ''}`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <p className="text-sm leading-6 text-slate-600">
              {surfaceModes.find((mode) => mode.id === surfaceMode)?.description}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-800">Повторяемость UI</p>
            <div className="flex flex-wrap gap-2">
              {reuseLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setReuseLevel(level.id)}
                  className={`chip ${reuseLevel === level.id ? 'chip-active' : ''}`}
                >
                  {level.label}
                </button>
              ))}
            </div>
            <p className="text-sm leading-6 text-slate-600">
              {reuseLevels.find((level) => level.id === reuseLevel)?.description}
            </p>
          </div>

          <label className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
            <span className="text-sm font-semibold text-slate-800">
              Shared state между частями экрана
            </span>
            <span className="mt-2 block text-sm leading-6 text-slate-600">
              Включите, если filters, summary и список должны синхронно реагировать на
              одни и те же изменения.
            </span>
            <span className="mt-4 flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={hasSharedState}
                onChange={(event) => setHasSharedState(event.target.checked)}
              />
              Shared state нужен
            </span>
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <MetricCard
            label="Нагрузка ручного DOM"
            value={scenario.manualDomPressure}
            hint="Сколько точек интерфейса приходится синхронизировать командами."
            tone="accent"
          />
          <MetricCard
            label="Давление переиспользования"
            value={scenario.reusePressure}
            hint="Насколько выгодно иметь независимые и повторяемые компоненты."
            tone="cool"
          />
          <MetricCard
            label="Цена coordination"
            value={scenario.statePressure}
            hint="Насколько заметно состояние начинает влиять на несколько частей интерфейса сразу."
            tone="dark"
          />
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Preview той же идеи
          </p>
          {scenario.previewMode === 'strip' ? (
            <FeaturedCatalogStrip items={catalogItems.slice(0, 3)} focusTag="react" />
          ) : (
            <div className="space-y-4">
              <CatalogSummaryPanel view={previewView} />
              <CatalogSurface
                view={previewView}
                compact={scenario.previewMode === 'summary'}
              />
            </div>
          )}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel className="space-y-5">
          <p className="text-sm leading-6 text-slate-600">{scenario.reactDefinition}</p>
          <ListBlock title="Почему React здесь полезен" items={scenario.benefits} />
        </Panel>

        <Panel className="space-y-5">
          <ListBlock title="Что важно не потерять из виду" items={scenario.caveats} />
          <BeforeAfter
            beforeTitle="Императивная оптика"
            before={scenario.before}
            afterTitle="Декларативная оптика"
            after={scenario.after}
          />
        </Panel>
      </div>

      <Panel>
        <ProjectStudy
          files={projectStudy.reactValue.files}
          snippets={projectStudy.reactValue.snippets}
        />
      </Panel>
    </div>
  );
}
