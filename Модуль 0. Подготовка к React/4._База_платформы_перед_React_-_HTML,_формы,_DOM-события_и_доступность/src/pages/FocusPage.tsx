import { useRef, useState } from 'react';

import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  evaluateFocusScenario,
  interactiveKinds,
  tabModes,
  type InteractiveKind,
  type TabMode,
} from '../lib/focus-model';
import { projectStudy } from '../lib/project-study';

export function FocusPage() {
  const interactiveRef = useRef<HTMLElement | null>(null);
  const [kind, setKind] = useState<InteractiveKind>('button');
  const [tabMode, setTabMode] = useState<TabMode>('native');
  const [hasHref, setHasHref] = useState(true);
  const [addRole, setAddRole] = useState(true);
  const [addKeyboardSupport, setAddKeyboardSupport] = useState(true);
  const [focusState, setFocusState] = useState('ничего');
  const [interactionLog, setInteractionLog] = useState<string[]>([]);

  const scenario = evaluateFocusScenario({
    kind,
    hasHref,
    tabMode,
    addRole,
    addKeyboardSupport,
  });

  const pushLog = (line: string) => {
    setInteractionLog((current) => [line, ...current].slice(0, 8));
  };

  const resolvedTabIndex =
    tabMode === 'zero'
      ? 0
      : tabMode === 'minus-one'
        ? -1
        : tabMode === 'positive-three'
          ? 3
          : undefined;

  const commonProps = {
    className:
      'rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-100',
    ref: (node: HTMLElement | null) => {
      interactiveRef.current = node;
    },
    ...(resolvedTabIndex !== undefined ? { tabIndex: resolvedTabIndex } : {}),
    onFocus: () => {
      setFocusState(`${kind}:${tabMode}`);
      pushLog(`focus -> ${kind}`);
    },
    onBlur: () => pushLog(`blur -> ${kind}`),
    onClick: () => pushLog(`click -> ${kind}`),
  };

  const demoControl =
    kind === 'button' ? (
      <button
        {...commonProps}
        type="button"
        onKeyDown={(event) => pushLog(`keydown -> ${event.key}`)}
      >
        Native button
      </button>
    ) : kind === 'link' ? (
      <a
        {...commonProps}
        href={hasHref ? '#focus-demo' : undefined}
        onClick={(event) => {
          if (!hasHref) {
            event.preventDefault();
          }

          pushLog(`click -> link ${hasHref ? 'with href' : 'without href'}`);
        }}
        onKeyDown={(event) => pushLog(`keydown -> ${event.key}`)}
      >
        Native link
      </a>
    ) : (
      <div
        {...commonProps}
        role={addRole ? 'button' : undefined}
        onKeyDown={(event) => {
          pushLog(`keydown -> ${event.key}`);

          if (addKeyboardSupport && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            pushLog(`activate -> ${event.key}`);
          }
        }}
      >
        Fake button on div
      </div>
    );

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Lab 4"
        title="Фокус, таб-цепочка и клавиатурная навигация"
        copy="Эта лаборатория даёт собрать один и тот же interactive control разными способами: как button, как link и как div. Так видно, что focusability, keyboard activation и ref.focus() зависят не только от JavaScript, но и от element type, href, role и tabIndex."
        aside={
          <div className="space-y-3">
            <StatusPill tone={scenario.focusableInTabOrder ? 'success' : 'warn'}>
              {scenario.focusableInTabOrder ? 'in tab order' : 'out of tab order'}
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Попробуйте табнуться до элемента вручную, а затем сравните это с программным
              `focus()` через ref.
            </p>
          </div>
        }
      />

      <Panel className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Тип интерактивного узла
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {interactiveKinds.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setKind(item)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      kind === item
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
              <p className="text-sm font-semibold text-slate-800">tabIndex mode</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {tabModes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTabMode(item)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      tabMode === item
                        ? 'bg-emerald-600 text-white'
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
                  checked={hasHref}
                  onChange={(event) => setHasHref(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm leading-6 text-slate-700">
                  У ссылки есть `href`, поэтому она остаётся настоящей навигацией.
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={addRole}
                  onChange={(event) => setAddRole(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm leading-6 text-slate-700">
                  Для fake-control явно указывать `role="button"`.
                </span>
              </label>
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={addKeyboardSupport}
                onChange={(event) => setAddKeyboardSupport(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm leading-6 text-slate-700">
                Для fake-control вручную обрабатывать `Enter` и `Space`.
              </span>
            </label>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Live control
              </p>
              <div className="mt-4 flex flex-wrap gap-3">{demoControl}</div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    interactiveRef.current?.focus();
                    pushLog('focus() through ref');
                  }}
                  className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Фокусировать через ref
                </button>
                <button
                  type="button"
                  onClick={() => setInteractionLog([])}
                  className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Очистить log
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard
                label="tab order"
                value={scenario.focusableInTabOrder ? 'yes' : 'no'}
                hint="Попадает ли элемент в обычную клавиатурную цепочку."
              />
              <MetricCard
                label="keyboard"
                value={scenario.keyboardActivation}
                hint="Какая активация доступна без дополнительного кода."
                tone="accent"
              />
              <MetricCard
                label="programmatic focus"
                value={scenario.nativeFocusable ? 'possible' : 'fragile'}
                hint="Сможет ли ref.focus() работать предсказуемо."
                tone="cool"
              />
              <MetricCard
                label="active focus"
                value={focusState}
                hint="Последний элемент, который реально получил фокус."
                tone="dark"
              />
            </div>

            <CodeBlock label="focus markup" code={scenario.markupPreview} />
            <ListBlock
              title="Warnings"
              items={
                scenario.warnings.length > 0
                  ? scenario.warnings
                  : ['Нативная семантика и tab behavior сейчас выглядят устойчиво.']
              }
            />
            <ListBlock
              title="Interaction log"
              items={
                interactionLog.length > 0
                  ? interactionLog
                  : ['Сфокусируйте элемент, кликните по нему или нажмите Enter/Space.']
              }
            />
          </div>
        </div>
      </Panel>

      <Panel>
        <ProjectStudy
          files={projectStudy.focus.files}
          snippets={projectStudy.focus.snippets}
        />
      </Panel>
    </div>
  );
}
