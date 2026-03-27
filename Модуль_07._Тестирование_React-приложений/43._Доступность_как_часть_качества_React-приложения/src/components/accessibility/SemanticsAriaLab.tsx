import { useMemo, useState } from 'react';

import {
  summarizeSemanticsScenario,
  type AriaStrategy,
} from '../../lib/accessibility-runtime';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

type SurfaceMode = 'semantic' | 'div-soup';

const sections = [
  {
    id: 'release-notes',
    title: 'Release notes',
    body: 'Экран разбит на landmarks и headings, поэтому его можно читать по структуре, а не по случайным div.',
  },
  {
    id: 'incidents',
    title: 'Incidents',
    body: 'Если действия и блоки становятся generic div, модель экрана теряет ориентиры для screen reader и keyboard.',
  },
  {
    id: 'shiproom',
    title: 'Ship room',
    body: 'ARIA полезен только там, где native HTML не выражает нужную семантику сам.',
  },
] as const;

export function SemanticsAriaLab() {
  const [surfaceMode, setSurfaceMode] = useState<SurfaceMode>('semantic');
  const [ariaStrategy, setAriaStrategy] = useState<AriaStrategy>('native');
  const [headingsAreOrdered, setHeadingsAreOrdered] = useState(true);
  const [selectedSection, setSelectedSection] =
    useState<(typeof sections)[number]['id']>('release-notes');

  const selected = sections.find((item) => item.id === selectedSection) ?? sections[0];
  const summary = useMemo(
    () =>
      summarizeSemanticsScenario({
        usesLandmarks: surfaceMode === 'semantic',
        usesNativeControls: surfaceMode === 'semantic',
        headingsAreOrdered,
        ariaStrategy,
      }),
    [ariaStrategy, headingsAreOrdered, surfaceMode],
  );

  function renderSemanticAction(section: (typeof sections)[number]) {
    if (ariaStrategy === 'redundant') {
      return (
        <button
          key={section.id}
          type="button"
          role="button"
          aria-label={section.title}
          onClick={() => setSelectedSection(section.id)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
        >
          {section.title}
        </button>
      );
    }

    if (ariaStrategy === 'wrong-role') {
      return (
        <a
          key={section.id}
          href={`#${section.id}`}
          role="button"
          onClick={(event) => {
            event.preventDefault();
            setSelectedSection(section.id);
          }}
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950"
        >
          {section.title}
        </a>
      );
    }

    return (
      <button
        key={section.id}
        type="button"
        onClick={() => setSelectedSection(section.id)}
        className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
      >
        {section.title}
      </button>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Score"
          value={String(summary.score)}
          hint="Landmarks, native controls и упорядоченные headings делают экран читаемым как структуру."
        />
        <MetricCard
          label="Verdict"
          value={summary.verdict}
          hint="Если роль и элемент спорят друг с другом, screen reader получает противоречивую модель."
          tone="accent"
        />
        <MetricCard
          label="Selected"
          value={selected.title}
          hint="Выбирайте секции и сравнивайте, как одна и та же навигация выглядит в native и broken-режимах."
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Semantics and roles
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Сначала дайте интерфейсу нативную структуру, и только потом решайте, нужен
              ли ARIA-мост
            </h2>
          </div>
          <StatusPill tone={summary.score >= 80 ? 'success' : 'warn'}>
            {ariaStrategy}
          </StatusPill>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
            <input
              type="radio"
              name="surface-mode"
              checked={surfaceMode === 'semantic'}
              onChange={() => setSurfaceMode('semantic')}
            />
            <span>Semantic screen через main / nav / section / button</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
            <input
              type="radio"
              name="surface-mode"
              checked={surfaceMode === 'div-soup'}
              onChange={() => setSurfaceMode('div-soup')}
            />
            <span>Div soup без landmarks и native controls</span>
          </label>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {[
            ['native', 'ARIA only when needed'],
            ['redundant', 'Лишний ARIA поверх native HTML'],
            ['wrong-role', 'Неверная роль спорит с элементом'],
          ].map(([value, label]) => (
            <label
              key={value}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700"
            >
              <input
                type="radio"
                name="aria-strategy"
                checked={ariaStrategy === value}
                onChange={() => setAriaStrategy(value as AriaStrategy)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={headingsAreOrdered}
            onChange={(event) => setHeadingsAreOrdered(event.target.checked)}
          />
          <span>Heading hierarchy остаётся последовательной</span>
        </label>

        {surfaceMode === 'semantic' ? (
          <main className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <header className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Semantic preview
              </p>
              {headingsAreOrdered ? (
                <h3 className="text-lg font-semibold text-slate-900">
                  Release workspace
                </h3>
              ) : (
                <h5 className="text-lg font-semibold text-slate-900">
                  Release workspace
                </h5>
              )}
            </header>

            <nav aria-label="Разделы preview" className="mt-4 flex flex-wrap gap-3">
              {sections.map((section) => renderSemanticAction(section))}
            </nav>

            <section
              aria-labelledby="selected-section-heading"
              className="mt-5 rounded-[20px] border border-slate-200 bg-white p-5"
            >
              {headingsAreOrdered ? (
                <h4
                  id="selected-section-heading"
                  className="text-base font-semibold text-slate-900"
                >
                  {selected.title}
                </h4>
              ) : (
                <h2
                  id="selected-section-heading"
                  className="text-base font-semibold text-slate-900"
                >
                  {selected.title}
                </h2>
              )}
              <p className="mt-3 text-sm leading-6 text-slate-600">{selected.body}</p>
            </section>
          </main>
        ) : (
          <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5">
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                Div soup preview
              </div>
              <div className="text-lg font-semibold text-amber-950">
                Release workspace
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {sections.map((section) => (
                <div
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className="rounded-xl border border-amber-300 bg-white px-4 py-3 text-sm font-semibold text-amber-950"
                >
                  {section.title}
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[20px] border border-amber-200 bg-white p-5">
              <div className="text-base font-semibold text-amber-950">
                {selected.title}
              </div>
              <p className="mt-3 text-sm leading-6 text-amber-950/80">{selected.body}</p>
            </div>
          </div>
        )}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <ListBlock title="Role map" items={summary.roleMap} />
        </Panel>
        <Panel>
          <ListBlock
            title="Что полезно проверить"
            items={[
              'Можно ли найти основные области экрана через landmarks.',
              'Совпадает ли тип интерактивного элемента с его реальным поведением.',
              'ARIA добавляет смысл или только дублирует то, что уже делает HTML.',
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}
