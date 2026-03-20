import clsx from 'clsx';
import { useEffect, useId, useInsertionEffect, useRef, useState } from 'react';

import {
  styleThemes,
  type InjectionMode,
  type StyleThemeId,
} from '../../lib/dom-hooks-domain';
import {
  buildInjectedThemeCss,
  buildInjectionTimeline,
  describeInjectionMode,
} from '../../lib/insertion-effect-model';
import { Panel, StatusPill } from '../ui';

export function InsertionEffectLab() {
  const scopeClass = `insertion-scope-${useId().replace(/:/g, '')}`;
  const styleNodeRef = useRef<HTMLStyleElement | null>(null);
  const [injectionMode, setInjectionMode] = useState<InjectionMode>('insertion');
  const [themeId, setThemeId] = useState<StyleThemeId>('signal');

  const cssText = buildInjectedThemeCss(scopeClass, themeId);
  const timeline = buildInjectionTimeline(injectionMode);
  const report = describeInjectionMode(injectionMode);

  useInsertionEffect(() => {
    if (injectionMode !== 'insertion') {
      return;
    }

    // useInsertionEffect оставляем только для style injection:
    // здесь нет state update, только подготовка CSS-правил в head.
    const node = styleNodeRef.current ?? document.createElement('style');

    if (styleNodeRef.current === null) {
      node.setAttribute('data-lesson-style', scopeClass);
      document.head.append(node);
      styleNodeRef.current = node;
    }

    node.replaceChildren(document.createTextNode(cssText));
  }, [cssText, injectionMode, scopeClass]);

  useEffect(() => {
    if (injectionMode !== 'effect') {
      return;
    }

    const node = styleNodeRef.current ?? document.createElement('style');

    if (styleNodeRef.current === null) {
      node.setAttribute('data-lesson-style', scopeClass);
      document.head.append(node);
      styleNodeRef.current = node;
    }

    node.replaceChildren(document.createTextNode(cssText));
  }, [cssText, injectionMode, scopeClass]);

  useEffect(() => {
    return () => {
      styleNodeRef.current?.remove();
      styleNodeRef.current = null;
    };
  }, []);

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="success">{report.title}</StatusPill>
        <span className="text-sm text-slate-500">
          Style tag:{' '}
          <strong>
            {injectionMode === 'insertion' ? 'before paint' : 'after paint'}
          </strong>
        </span>
        <span className="text-sm text-slate-500">
          CSS bytes: <strong>{cssText.length}</strong>
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Injection mode</span>
          <div className="flex flex-wrap gap-2">
            {(['insertion', 'effect'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setInjectionMode(option)}
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  injectionMode === option
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Theme runtime</span>
          <div className="flex flex-wrap gap-2">
            {styleThemes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setThemeId(theme.id)}
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  themeId === theme.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                )}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </label>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className={scopeClass}>
          <div className="theme-shell">
            <span className="theme-pill">{injectionMode}</span>
            <div className="theme-card">
              <h3 className="text-xl font-semibold">Runtime style injection</h3>
              <p className="mt-3 text-sm leading-6">
                В этой зоне стили не лежат в статическом CSS-файле. Они вставляются
                текущим уроком прямо в <code>document.head</code>.
              </p>
              <button type="button" className="theme-action">
                Rebuild theme contract
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-blue-200 bg-blue-50/80 p-5 text-sm leading-6 text-blue-950">
            {report.summary}
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Timeline
            </p>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {timeline.map((step, index) => (
                <li
                  key={step}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  {index + 1}. {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Panel>
  );
}
