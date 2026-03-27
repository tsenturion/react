import { type ElementType, type ReactNode, useState } from 'react';

import {
  BeforeAfter,
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudy } from '../lib/project-study';
import {
  buildSemanticScenario,
  pageKinds,
  type PageKind,
  type StructureMode,
} from '../lib/semantics-model';

function PreviewTag({
  tag,
  className,
  children,
}: {
  tag: string;
  className: string;
  children: ReactNode;
}) {
  const Tag = tag as ElementType;
  return <Tag className={className}>{children}</Tag>;
}

export function SemanticsPage() {
  const [pageKind, setPageKind] = useState<PageKind>('article');
  const [structureMode, setStructureMode] = useState<StructureMode>('semantic');
  const [includeComplementary, setIncludeComplementary] = useState(true);

  const scenario = buildSemanticScenario({
    pageKind,
    structureMode,
    includeComplementary,
  });
  const banner = scenario.outline.find((item) => item.id === 'banner')!;
  const navigation = scenario.outline.find((item) => item.id === 'navigation')!;
  const main = scenario.outline.find((item) => item.id === 'main')!;
  const primary = scenario.outline.find((item) => item.id === 'primary')!;
  const complementary = scenario.outline.find((item) => item.id === 'aside');
  const footer = scenario.outline.find((item) => item.id === 'contentinfo')!;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Lab 1"
        title="Семантический HTML как основа структуры будущего React UI"
        copy="Эта лаборатория показывает, как landmarks и смысловые контейнеры появляются ещё до React-компонентов. Если структура страницы изначально выражена через `header`, `nav`, `main`, `article`, `form`, `aside` и `footer`, дальше легче и рендерить, и тестировать, и озвучивать интерфейс."
        aside={
          <div className="space-y-3">
            <StatusPill tone={structureMode === 'semantic' ? 'success' : 'warn'}>
              {structureMode}
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Здесь одна и та же страница собирается либо через landmarks, либо через
              generic `div`, чтобы разница была видна сразу.
            </p>
          </div>
        }
      />

      <Panel className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Тип страницы</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {pageKinds.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPageKind(item)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      pageKind === item
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Структура контейнеров
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(['semantic', 'generic'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStructureMode(item)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      structureMode === item
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={includeComplementary}
                onChange={(event) => setIncludeComplementary(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm leading-6 text-slate-700">
                Добавить `aside` и посмотреть, как complementary content отделяется от
                основного сценария страницы.
              </span>
            </label>

            <BeforeAfter
              beforeTitle="Когда всё на div"
              before="Главные зоны страницы визуально присутствуют, но теряют landmarks. Навигацию, main region и supplementary content сложнее интерпретировать и браузеру, и assistive tech."
              afterTitle="Когда структура семантическая"
              after="Каждый крупный блок получает понятную роль ещё на уровне HTML, поэтому React-дальнейшая композиция не стартует с безымянного дерева."
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard
              label="landmarks"
              value={String(scenario.landmarkCount)}
              hint="Количество смысловых областей в текущей структуре."
            />
            <MetricCard
              label="semantic score"
              value={String(scenario.semanticScore)}
              hint="Условная метрика читаемости структуры для браузерных инструментов и assistive tech."
              tone="accent"
            />
            <MetricCard
              label="primary element"
              value={scenario.preset.primary}
              hint="Главный контейнер меняется по задаче: статья, форма или section."
              tone="cool"
            />
            <MetricCard
              label="heading outline"
              value={scenario.preset.heading}
              hint="Иерархия заголовков должна поддерживать сценарий страницы, а не случайный дизайн."
              tone="dark"
            />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Live structure preview
            </p>
            <PreviewTag tag={banner.element} className="rounded-2xl bg-slate-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {`<${banner.element}>`}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-800">{banner.label}</p>
            </PreviewTag>

            <PreviewTag tag={navigation.element} className="rounded-2xl bg-sky-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                {`<${navigation.element}>`}
              </p>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-slate-700">
                <li className="rounded-full bg-white px-3 py-1">Обзор</li>
                <li className="rounded-full bg-white px-3 py-1">Материалы</li>
                <li className="rounded-full bg-white px-3 py-1">Практика</li>
              </ul>
            </PreviewTag>

            <PreviewTag tag={main.element} className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                {`<${main.element}>`}
              </p>
              <PreviewTag tag={primary.element} className="mt-3 rounded-2xl bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {`<${primary.element}>`}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">
                  {scenario.preset.title}
                </h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {scenario.preset.sections.map((item) => (
                    <section
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                    >
                      {item}
                    </section>
                  ))}
                </div>
              </PreviewTag>
            </PreviewTag>

            {complementary ? (
              <PreviewTag
                tag={complementary.element}
                className="rounded-2xl bg-amber-50 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                  {`<${complementary.element}>`}
                </p>
                <p className="mt-2 text-sm text-slate-700">{complementary.label}</p>
              </PreviewTag>
            ) : null}

            <PreviewTag tag={footer.element} className="rounded-2xl bg-slate-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {`<${footer.element}>`}
              </p>
              <p className="mt-2 text-sm text-slate-700">{footer.label}</p>
            </PreviewTag>
          </div>

          <div className="space-y-6">
            <CodeBlock label="structure preview" code={scenario.codePreview} />
            <ListBlock title="Reader path" items={scenario.readerPath.split(' -> ')} />
            <ListBlock title="Ключевые выводы" items={scenario.warnings} />
          </div>
        </div>
      </Panel>

      <Panel>
        <ProjectStudy
          files={projectStudy.semantics.files}
          snippets={projectStudy.semantics.snippets}
        />
      </Panel>
    </div>
  );
}
