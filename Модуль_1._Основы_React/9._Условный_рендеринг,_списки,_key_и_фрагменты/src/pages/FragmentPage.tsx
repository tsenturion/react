import { Fragment, useState } from 'react';

import { AuditTable } from '../components/lists/AuditTable';
import { ElementTreeView } from '../components/rendering/ElementTreeView';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  auditEntries,
  buildFragmentReport,
  type AuditEntry,
  type FragmentMode,
} from '../lib/fragment-model';
import { getProjectStudy } from '../lib/project-study';

const modeOptions: readonly {
  value: FragmentMode;
  title: string;
  note: string;
}[] = [
  {
    value: 'wrapper',
    title: 'Лишний wrapper',
    note: 'Лишняя обёртка создаёт новый DOM-узел и может сломать структурно чувствительную разметку.',
  },
  {
    value: 'fragment',
    title: 'Полный Fragment',
    note: 'Полная форма `<Fragment key={...}>` подходит для списка, где фрагмент сам является корнем элемента.',
  },
  {
    value: 'shorthand',
    title: 'Короткий <>',
    note: 'Короткая форма удобна для нескольких siblings там, где key на верхнем фрагменте не нужен.',
  },
] as const;

function ShorthandMeta({ entry }: { entry: AuditEntry }) {
  return (
    <>
      <span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
        {entry.title}
      </span>
      <span className="text-sm leading-6 text-slate-600">{entry.detail}</span>
    </>
  );
}

function buildStructurePreview(mode: FragmentMode, expanded: boolean) {
  if (mode === 'wrapper') {
    // Этот preview намеренно строит "плохое" дерево только для инспекции React elements:
    // монтировать такую таблицу в браузер как live preview нельзя из-за неверной структуры.
    return (
      <table>
        <tbody>
          {auditEntries.map((entry) => (
            <div key={entry.id}>
              <tr>
                <td>{entry.title}</td>
                <td>Основная строка</td>
              </tr>
              {expanded ? (
                <tr>
                  <td colSpan={2}>{entry.detail}</td>
                </tr>
              ) : null}
            </div>
          ))}
        </tbody>
      </table>
    );
  }

  if (mode === 'fragment') {
    return (
      <table>
        <tbody>
          {auditEntries.map((entry) => (
            <Fragment key={entry.id}>
              <tr>
                <td>{entry.title}</td>
                <td>Основная строка</td>
              </tr>
              {expanded ? (
                <tr>
                  <td colSpan={2}>{entry.detail}</td>
                </tr>
              ) : null}
            </Fragment>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <section>
      {auditEntries.slice(0, 2).map((entry) => (
        <article key={entry.id}>
          <ShorthandMeta entry={entry} />
        </article>
      ))}
    </section>
  );
}

export function FragmentPage() {
  const [mode, setMode] = useState<FragmentMode>('fragment');
  const [expanded, setExpanded] = useState(true);
  const report = buildFragmentReport(mode, auditEntries.length);
  const study = getProjectStudy('fragments');
  const structurePreview = buildStructurePreview(mode, expanded);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Фрагменты и структура без лишних DOM-узлов"
        copy="Фрагменты полезны не потому, что сокращают пару символов, а потому что позволяют вернуть несколько siblings без лишней разметки. Это особенно важно там, где браузер ожидает строгую структуру: таблицы, списки, группы ячеек и похожие блоки."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Режим рендера</h2>
          {modeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMode(option.value)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                mode === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="block text-sm font-semibold">{option.title}</span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">
                {option.note}
              </span>
            </button>
          ))}

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-medium">Показывать detail-строки</span>
            <input
              type="checkbox"
              checked={expanded}
              onChange={(event) => setExpanded(event.target.checked)}
            />
          </label>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Режим"
              value={mode}
              hint="Текущий способ вернуть несколько siblings."
              tone="cool"
            />
            <MetricCard
              label="Лишних узлов"
              value={String(report.extraNodeCount)}
              hint="Сколько лишних DOM-обёрток добавилось бы поверх полезной структуры."
              tone={report.extraNodeCount > 0 ? 'accent' : 'cool'}
            />
            <MetricCard
              label="Видимых строк"
              value={String(expanded ? auditEntries.length * 2 : auditEntries.length)}
              hint="При раскрытии каждая запись даёт две строки таблицы."
            />
            <MetricCard
              label="Структура"
              value={mode === 'wrapper' ? 'некорректна' : 'чистая'}
              hint="Wrapper ломает таблицу, fragment оставляет DOM-структуру корректной."
              tone={mode === 'wrapper' ? 'dark' : 'cool'}
            />
          </div>

          <Panel className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone={report.tone}>
                {mode === 'wrapper' ? 'Структурная ошибка' : 'Структура сохраняется'}
              </StatusPill>
              <p className="text-sm leading-6 text-slate-600">{report.summary}</p>
            </div>

            {mode === 'wrapper' ? (
              <div className="rounded-[24px] border border-amber-300 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-950">
                Этот вариант намеренно не монтируется как live-таблица, потому что
                промежуточный `div` между `tbody` и `tr` нарушает HTML-структуру. Ниже
                можно посмотреть такое дерево на уровне React elements.
              </div>
            ) : mode === 'fragment' ? (
              <AuditTable entries={auditEntries} expanded={expanded} />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {auditEntries.slice(0, 2).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <ShorthandMeta entry={entry} />
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <ElementTreeView label="Структура React elements" element={structurePreview} />
          <CodeBlock label="Текущий вариант fragments" code={report.snippet} />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
