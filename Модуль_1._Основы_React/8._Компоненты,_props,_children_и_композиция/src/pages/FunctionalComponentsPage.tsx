import { Fragment, useState } from 'react';

import { CourseCard } from '../components/composition/CourseCard';
import { ElementTreeView } from '../components/rendering/ElementTreeView';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildCourseCardViewModel,
  buildFunctionalSnippet,
  compareCardViewModels,
  defaultFunctionalCardControls,
  type ComponentPresetId,
  type FunctionalCardControls,
} from '../lib/component-props-model';
import { getProjectStudy } from '../lib/project-study';

const presetOptions: ComponentPresetId[] = [
  'props-basics',
  'children-slots',
  'api-design',
  'component-testing',
];

export function FunctionalComponentsPage() {
  const [controls, setControls] = useState<FunctionalCardControls>(
    defaultFunctionalCardControls,
  );

  const primary = buildCourseCardViewModel(controls.primaryId, controls);
  const secondary = buildCourseCardViewModel(controls.secondaryId, {
    ...controls,
    highlighted: false,
  });
  const changedProps = compareCardViewModels(primary, secondary);
  const study = getProjectStudy('functional');
  const invocationTree = (
    <Fragment>
      <CourseCard {...primary} />
      <CourseCard {...secondary}>
        <span>Дополнительный footer slot вносится извне через children.</span>
      </CourseCard>
    </Fragment>
  );

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Функциональные компоненты и props"
        copy="Функциональный компонент получает данные через props и возвращает интерфейс как результат вычисления. Ниже одна и та же `CourseCard` используется повторно, но с разными входными данными."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Управление props</h2>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Первый preset</span>
            <select
              value={controls.primaryId}
              onChange={(event) =>
                setControls((current) => ({
                  ...current,
                  primaryId: event.target.value as ComponentPresetId,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {presetOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Второй preset</span>
            <select
              value={controls.secondaryId}
              onChange={(event) =>
                setControls((current) => ({
                  ...current,
                  secondaryId: event.target.value as ComponentPresetId,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {presetOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-medium">Highlight первой карточки</span>
            <input
              type="checkbox"
              checked={controls.highlighted}
              onChange={(event) =>
                setControls((current) => ({
                  ...current,
                  highlighted: event.target.checked,
                }))
              }
            />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-medium">Компактный layout</span>
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
            <span className="font-medium">Показывать mentor</span>
            <input
              type="checkbox"
              checked={controls.showMentor}
              onChange={(event) =>
                setControls((current) => ({
                  ...current,
                  showMentor: event.target.checked,
                }))
              }
            />
          </label>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Instances"
              value="2"
              hint="Один компонент повторно используется с разными props."
              tone="cool"
            />
            <MetricCard
              label="Different props"
              value={String(changedProps.length)}
              hint="Меняются только входные данные, а не сам компонент."
            />
            <MetricCard
              label="Children slot"
              value="1 из 2"
              hint="Вторая карточка дополнительно расширена через children."
              tone="accent"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <CourseCard {...primary} />
            <CourseCard {...secondary}>
              <span>
                Этот блок не зашит в компонент. Он передан в него как `children`.
              </span>
            </CourseCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <CodeBlock
              label="Использование CourseCard"
              code={buildFunctionalSnippet(primary, secondary)}
            />
            <Panel className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Смысл props</h2>
              <p className="text-sm leading-6 text-slate-600">
                Компонент не знает, где его используют. Он получает только входные данные
                и на их основе строит интерфейс. Это и делает компонент независимым и
                переиспользуемым.
              </p>
              <div className="flex flex-wrap gap-2">
                {changedProps.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Panel>
          </div>

          <Panel className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Дерево вызова компонентов
            </h2>
            <ElementTreeView label="Component invocation tree" element={invocationTree} />
          </Panel>
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
