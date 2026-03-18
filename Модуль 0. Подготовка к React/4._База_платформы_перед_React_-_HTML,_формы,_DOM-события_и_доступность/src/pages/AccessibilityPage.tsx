import { useState } from 'react';

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
import {
  accessibilityPatterns,
  evaluateAccessibilityScenario,
  type AccessibilityPattern,
} from '../lib/accessibility-model';
import { projectStudy } from '../lib/project-study';

export function AccessibilityPage() {
  const [pattern, setPattern] = useState<AccessibilityPattern>('text-button');
  const [hasVisibleLabel, setHasVisibleLabel] = useState(true);
  const [hasAriaLabel, setHasAriaLabel] = useState(false);
  const [addRedundantRole, setAddRedundantRole] = useState(false);
  const [addAriaRequired, setAddAriaRequired] = useState(false);

  const scenario = evaluateAccessibilityScenario({
    pattern,
    hasVisibleLabel,
    hasAriaLabel,
    addRedundantRole,
    addAriaRequired,
  });

  const livePreview =
    pattern === 'text-input' ? (
      <div className="space-y-2">
        {hasVisibleLabel ? (
          <label className="text-sm font-medium text-slate-800" htmlFor="search-demo">
            Поиск по разделам
          </label>
        ) : null}
        <input
          id="search-demo"
          type="text"
          required
          aria-label={hasAriaLabel ? 'Поиск по разделам' : undefined}
          aria-required={addAriaRequired ? 'true' : undefined}
          role={addRedundantRole ? 'textbox' : undefined}
          placeholder={hasVisibleLabel ? '' : 'Поиск по разделам'}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400"
        />
      </div>
    ) : (
      <button
        type="button"
        aria-label={hasAriaLabel ? 'Открыть меню' : undefined}
        role={addRedundantRole ? 'button' : undefined}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
      >
        {hasVisibleLabel ? (
          'Открыть меню'
        ) : (
          <span aria-hidden="true" className="text-lg leading-none">
            ≡
          </span>
        )}
      </button>
    );

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Lab 5"
        title="Доступность, native semantics и принцип ARIA only when needed"
        copy="Здесь можно собрать control с разными источниками имени и разной семантикой, а затем увидеть, где нативный HTML уже делает всю работу, а где `aria-label` или другая связь действительно нужны."
        aside={
          <div className="space-y-3">
            <StatusPill tone={scenario.warnings.length > 0 ? 'warn' : 'success'}>
              {scenario.nameSource}
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              ARIA здесь рассматривается не как украшение разметки, а как точечный
              инструмент для тех мест, где native semantics уже недостаточно.
            </p>
          </div>
        }
      />

      <Panel className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Паттерн control</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {accessibilityPatterns.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPattern(item)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      pattern === item
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={hasVisibleLabel}
                  onChange={(event) => setHasVisibleLabel(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm leading-6 text-slate-700">
                  У control есть видимый текст или связанный
                  <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em]">
                    {'<label>'}
                  </code>
                  .
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={hasAriaLabel}
                  onChange={(event) => setHasAriaLabel(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm leading-6 text-slate-700">
                  Добавить `aria-label`.
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={addRedundantRole}
                  onChange={(event) => setAddRedundantRole(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm leading-6 text-slate-700">
                  Добавить дублирующий `role`.
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={addAriaRequired}
                  onChange={(event) => setAddAriaRequired(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm leading-6 text-slate-700">
                  Добавить `aria-required` к нативному input.
                </span>
              </label>
            </div>

            <BeforeAfter
              beforeTitle="Лишний или неверный ARIA"
              before="Когда ARIA дублирует роль нативного элемента или пытается заменить отсутствующую базовую семантику, код становится шумнее, а поведение — менее предсказуемым."
              afterTitle="ARIA по необходимости"
              after="Если visible label и нативная роль уже на месте, лучше оставить их работать. `aria-label` и другие атрибуты нужны там, где без них не хватает имени или связи."
            />

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Live preview
              </p>
              <div className="mt-4">{livePreview}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard
                label="role"
                value={scenario.role}
                hint="Нативная роль или роль, которую вы пытаетесь навесить вручную."
              />
              <MetricCard
                label="name source"
                value={scenario.nameSource}
                hint="Откуда assistive tech получит имя control."
                tone="accent"
              />
              <MetricCard
                label="warnings"
                value={String(scenario.warnings.length)}
                hint="Сколько проблем или избыточных решений видно в текущей конфигурации."
                tone="cool"
              />
              <MetricCard
                label="aria advice"
                value={scenario.ariaAdvice}
                hint="Короткая инженерная формулировка про текущий набор атрибутов."
                tone="dark"
              />
            </div>

            <CodeBlock label="accessible markup" code={scenario.markupPreview} />
            <ListBlock
              title="Checklist"
              items={
                scenario.warnings.length > 0
                  ? scenario.warnings
                  : [
                      'Нативная семантика и имя control сейчас покрывают задачу без лишнего ARIA.',
                    ]
              }
            />
          </div>
        </div>
      </Panel>

      <Panel>
        <ProjectStudy
          files={projectStudy.accessibility.files}
          snippets={projectStudy.accessibility.snippets}
        />
      </Panel>
    </div>
  );
}
