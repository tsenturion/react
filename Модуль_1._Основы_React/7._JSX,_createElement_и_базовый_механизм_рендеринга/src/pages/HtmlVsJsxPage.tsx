import { useState } from 'react';

import {
  CodeBlock,
  ListBlock,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  defaultHtmlVsJsxRuleId,
  getHtmlVsJsxRule,
  htmlVsJsxRules,
  type HtmlVsJsxRuleId,
} from '../lib/html-vs-jsx-model';
import { getProjectStudy } from '../lib/project-study';

export function HtmlVsJsxPage() {
  const [selectedRuleId, setSelectedRuleId] =
    useState<HtmlVsJsxRuleId>(defaultHtmlVsJsxRuleId);
  const [disabledPreview, setDisabledPreview] = useState(false);
  const [gap, setGap] = useState(12);
  const rule = getHtmlVsJsxRule(selectedRuleId);
  const study = getProjectStudy('html-vs-jsx');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Различия между HTML и JSX"
        copy="JSX похож на HTML внешне, но живёт внутри JavaScript. Поэтому часть атрибутов меняет имя, часть значений превращается в выражения, а часть привычек из обычной разметки просто перестаёт работать."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Правила</h2>
          <div className="space-y-2">
            {htmlVsJsxRules.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedRuleId(item.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  selectedRuleId === item.id
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <label className="flex items-center justify-between text-sm text-slate-700">
              <span className="font-medium">Disabled для preview button</span>
              <input
                type="checkbox"
                checked={disabledPreview}
                onChange={(event) => setDisabledPreview(event.target.checked)}
              />
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="flex items-center justify-between font-medium">
                Gap в inline style
                <span className="text-slate-500">{gap}px</span>
              </span>
              <input
                type="range"
                min={8}
                max={28}
                value={gap}
                onChange={(event) => setGap(Number(event.target.value))}
                className="w-full"
              />
            </label>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{rule.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{rule.reason}</p>
              </div>
              <StatusPill tone={rule.tone}>{rule.id}</StatusPill>
            </div>
            <p className="text-sm leading-6 text-slate-600">{rule.impact}</p>
          </Panel>

          <div className="grid gap-4 xl:grid-cols-2">
            <CodeBlock label="Как выглядело бы в HTML" code={rule.htmlExample} />
            <CodeBlock label="Корректный JSX" code={rule.jsxExample} />
          </div>

          <Panel className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Живой JSX preview</h2>
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <label
                htmlFor="notify-email"
                className="text-sm font-medium text-slate-800"
              >
                Email для уведомления о новом уроке
              </label>
              <div className="mt-4 flex" style={{ gap }}>
                <input
                  id="notify-email"
                  type="email"
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3"
                />
                <button
                  type="button"
                  disabled={disabledPreview}
                  className={
                    disabledPreview
                      ? 'rounded-2xl bg-slate-200 px-4 py-3 font-semibold text-slate-500'
                      : 'rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white'
                  }
                >
                  Отправить
                </button>
              </div>
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='160' viewBox='0 0 480 160'%3E%3Crect width='480' height='160' rx='24' fill='%23e2e8f0'/%3E%3Ctext x='240' y='88' text-anchor='middle' font-family='Arial' font-size='28' fill='%230f172a'%3EJSX preview%3C/text%3E%3C/svg%3E"
                alt="Демонстрационный preview для сравнения HTML и JSX"
                className="mt-4 rounded-[24px] border border-slate-200"
              />
            </section>
          </Panel>

          <Panel>
            <ListBlock
              title="Что помнить"
              items={[
                'В JSX props следуют JavaScript-API браузера: `onClick`, `tabIndex`, `htmlFor`.',
                '`style` принимает объект, поэтому здесь работают camelCase-ключи и числовые значения.',
                'Даже если разметка похожа на HTML, JSX по-прежнему подчиняется правилам JavaScript-модуля.',
              ]}
            />
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
