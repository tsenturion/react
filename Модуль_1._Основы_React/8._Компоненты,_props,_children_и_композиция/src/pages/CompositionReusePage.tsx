import { useState } from 'react';

import { ComposedDashboard } from '../components/composition/ComposedDashboard';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildCompositionScenario,
  defaultCompositionControls,
  type CompositionControls,
  type DashboardPresetId,
} from '../lib/composition-model';
import { getProjectStudy } from '../lib/project-study';

export function CompositionReusePage() {
  const [controls, setControls] = useState<CompositionControls>(
    defaultCompositionControls,
  );
  const scenario = buildCompositionScenario(controls);
  const study = getProjectStudy('composition');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Композиция и переиспользование"
        copy="Композиция означает, что экран строится из небольших независимых компонентов. Чем лучше эти части отделены друг от друга, тем проще собрать новый layout без монолитного компонента на все случаи жизни."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Preset экрана</h2>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Preset</span>
            <select
              value={controls.preset}
              onChange={(event) =>
                setControls((current) => ({
                  ...current,
                  preset: event.target.value as DashboardPresetId,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {['academy', 'mentoring', 'audit'].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-medium">Compact cards</span>
            <input
              type="checkbox"
              checked={controls.compact}
              onChange={(event) =>
                setControls((current) => ({
                  ...current,
                  compact: event.target.checked,
                }))
              }
            />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-medium">Показывать sidebar</span>
            <input
              type="checkbox"
              checked={controls.showSidebar}
              onChange={(event) =>
                setControls((current) => ({
                  ...current,
                  showSidebar: event.target.checked,
                }))
              }
            />
          </label>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Reused blocks"
              value={String(scenario.reusedComponentCount)}
              hint="Сколько строительных блоков реально участвует в сборке текущего экрана."
              tone="cool"
            />
            <MetricCard
              label="Cards"
              value={String(scenario.courseIds.length)}
              hint="Одна и та же карточка переиспользуется в разных сценариях."
            />
            <MetricCard
              label="Sidebar"
              value={controls.showSidebar ? 'on' : 'off'}
              hint="Состав страницы меняется, но базовые компоненты остаются теми же."
              tone="accent"
            />
          </div>

          <ComposedDashboard scenario={scenario} />

          <div className="grid gap-4 xl:grid-cols-2">
            <CodeBlock label="Композиция текущего preset" code={scenario.snippet} />
            <Panel>
              <BeforeAfter
                beforeTitle="Монолит"
                before="Один большой компонент вынужден знать про header, sidebar, карточки, callout и footer сразу. Изменение одного сценария начинает ломать другой."
                afterTitle="Композиция"
                after="Экран собирается из независимых блоков: SectionFrame, CourseCard, stats и sidebar можно переставлять и отключать без переписывания всего layout."
              />
            </Panel>
          </div>
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
