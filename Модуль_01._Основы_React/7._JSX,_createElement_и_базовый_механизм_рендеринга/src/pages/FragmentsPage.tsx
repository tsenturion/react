import { useState } from 'react';

import { BreadcrumbTrail } from '../components/rendering/BreadcrumbTrail';
import { ElementTreeView } from '../components/rendering/ElementTreeView';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  buildBreadcrumbItems,
  buildFragmentReport,
  fragmentModes,
  type FragmentMode,
} from '../lib/fragment-model';
import { getProjectStudy } from '../lib/project-study';

export function FragmentsPage() {
  const [mode, setMode] = useState<FragmentMode>('fragment');
  const [itemCount, setItemCount] = useState(4);
  const items = buildBreadcrumbItems(itemCount);
  const report = buildFragmentReport(mode, itemCount);
  const study = getProjectStudy('fragments');
  const previewElement = <BreadcrumbTrail items={items} mode={mode} />;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Fragments и читаемая структура UI"
        copy="Fragment нужен не ради экономии символов, а ради точной структуры. Он позволяет вернуть несколько siblings без лишнего wrapper-элемента там, где дополнительный `div` портит семантику или мешает layout."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Режим</h2>
          <div className="space-y-2">
            {fragmentModes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  mode === item.id
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block font-semibold">{item.label}</span>
                <span className="mt-1 block text-sm leading-6 text-slate-500">
                  {item.blurb}
                </span>
              </button>
            ))}
          </div>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="flex items-center justify-between font-medium">
              Сегментов в breadcrumbs
              <span className="text-slate-500">{itemCount}</span>
            </span>
            <input
              type="range"
              min={2}
              max={4}
              value={itemCount}
              onChange={(event) => setItemCount(Number(event.target.value))}
              className="w-full"
            />
          </label>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Extra nodes"
              value={report.extraNodeCount}
              hint="Сколько лишней разметки создаёт выбранный режим."
              tone={mode === 'wrapper' ? 'accent' : 'cool'}
            />
            <MetricCard
              label="Direct children"
              value={report.directChildSummary}
              hint="Что видит родительский список как своих прямых детей."
            />
            <MetricCard
              label="Mode"
              value={mode}
              hint="Fragment и component-mode оба сохраняют структуру без нового DOM-узла."
              tone="cool"
            />
          </div>

          <Panel className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{report.why}</p>
              </div>
              <StatusPill tone={report.tone}>{report.verdict}</StatusPill>
            </div>
            <BreadcrumbTrail items={items} mode={mode} />
            <CodeBlock label="Текущая конструкция" code={report.snippet} />
          </Panel>

          <Panel className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">До / после</h2>
            <BeforeAfter
              beforeTitle="Лишний wrapper"
              before="`ol` получает промежуточные `div`, структура становится тяжелее и хуже читается в DOM."
              afterTitle="Fragment"
              after="Группа siblings остаётся логической, но DOM не разрастается и семантика списка сохраняется."
            />
          </Panel>

          <Panel className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Element tree</h2>
            <ElementTreeView label="Fragment lab tree" element={previewElement} />
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
