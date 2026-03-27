import { useEffect, useRef, useState } from 'react';

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
  describeEventScenario,
  formatNativeEventLine,
  summarizeNativeEventLog,
  type NativeEventRecord,
} from '../lib/event-model';
import { projectStudy } from '../lib/project-study';

export function EventsPage() {
  const surfaceRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const [preventDefaultOnLink, setPreventDefaultOnLink] = useState(false);
  const [stopPropagationOnLink, setStopPropagationOnLink] = useState(false);
  const [records, setRecords] = useState<NativeEventRecord[]>([]);

  useEffect(() => {
    const surface = surfaceRef.current;
    const panel = panelRef.current;
    const link = linkRef.current;

    if (!surface || !panel || !link) {
      return;
    }

    const nodes = [
      { id: 'surface' as const, node: surface },
      { id: 'panel' as const, node: panel },
      { id: 'link' as const, node: link },
    ];

    const cleanups = nodes.flatMap(({ id, node }) => {
      const captureHandler = (event: Event) => {
        setRecords((current) =>
          [
            ...current,
            {
              node: id,
              phase: 'capture' as const,
              defaultPrevented: event.defaultPrevented,
              hash: window.location.hash,
            },
          ].slice(-18),
        );
      };

      const bubbleHandler = (event: Event) => {
        if (id === 'link') {
          if (preventDefaultOnLink) {
            event.preventDefault();
          }

          if (stopPropagationOnLink) {
            event.stopPropagation();
          }
        }

        setRecords((current) =>
          [
            ...current,
            {
              node: id,
              phase: 'bubble' as const,
              defaultPrevented: event.defaultPrevented,
              hash: window.location.hash,
            },
          ].slice(-18),
        );
      };

      // Здесь используются native listeners в обе фазы специально:
      // лаборатория должна показывать именно DOM propagation, а не только React-обработчики.
      node.addEventListener('click', captureHandler, true);
      node.addEventListener('click', bubbleHandler);

      return [
        () => node.removeEventListener('click', captureHandler, true),
        () => node.removeEventListener('click', bubbleHandler),
      ];
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [preventDefaultOnLink, stopPropagationOnLink]);

  const summary = summarizeNativeEventLog(records);
  const scenario = describeEventScenario({
    stopPropagation: stopPropagationOnLink,
    preventDefault: preventDefaultOnLink,
  });

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Lab 3"
        title="Нативные DOM-события: capture, bubble, preventDefault и stopPropagation"
        copy="Эта лаборатория не имитирует путь события массивом шагов. Вместо этого вложенные элементы получают реальные native listeners в обе фазы, а вы можете увидеть порядок вызовов и влияние `preventDefault` и `stopPropagation` на hash-навигацию и всплытие."
        aside={
          <div className="space-y-3">
            <StatusPill
              tone={preventDefaultOnLink || stopPropagationOnLink ? 'warn' : 'success'}
            >
              native events
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Кликните по ссылке внизу и смотрите, как меняется event log слева и hash в
              адресе.
            </p>
          </div>
        }
      />

      <Panel className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={preventDefaultOnLink}
                  onChange={(event) => setPreventDefaultOnLink(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm leading-6 text-slate-700">
                  В bubble-phase у ссылки вызвать `preventDefault()`.
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={stopPropagationOnLink}
                  onChange={(event) => setStopPropagationOnLink(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm leading-6 text-slate-700">
                  В bubble-phase у ссылки вызвать `stopPropagation()`.
                </span>
              </label>
            </div>

            <section
              ref={surfaceRef}
              className="rounded-[28px] border border-slate-200 bg-slate-50 p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                surface
              </p>
              <article
                ref={panelRef}
                className="mt-4 rounded-[24px] border border-sky-200 bg-white p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  panel
                </p>
                <a
                  ref={linkRef}
                  href="#event-log"
                  className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Кликните по anchor
                </a>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Если default action не отменён, браузер переведёт hash на `#event-log`.
                </p>
              </article>
            </section>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setRecords([])}
                className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Очистить log
              </button>
              <button
                type="button"
                onClick={() => {
                  window.history.replaceState(
                    {},
                    '',
                    `${window.location.pathname}${window.location.search}`,
                  );
                  setRecords([]);
                }}
                className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Сбросить hash
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard
                label="capture calls"
                value={String(summary.captureCount)}
                hint="Количество вызовов capture-listeners в текущем log."
              />
              <MetricCard
                label="bubble calls"
                value={String(summary.bubbleCount)}
                hint="Количество вызовов bubble-listeners после target."
                tone="accent"
              />
              <MetricCard
                label="prevented"
                value={String(summary.preventedCount)}
                hint="Сколько записей зафиксировали уже отменённый default action."
                tone="cool"
              />
              <MetricCard
                label="current hash"
                value={window.location.hash || '#none'}
                hint="Anchor-навигация остаётся платформенным поведением, если её не отменять."
                tone="dark"
              />
            </div>

            <CodeBlock label="event model" code={scenario.codePreview} />
            <ListBlock title="Что ожидается" items={scenario.expectations} />
            <ListBlock
              title="Event log"
              items={
                records.length > 0
                  ? records.map(formatNativeEventLine)
                  : ['После клика по ссылке здесь появится фактический порядок вызовов.']
              }
            />
          </div>
        </div>
      </Panel>

      <Panel>
        <ProjectStudy
          files={projectStudy.events.files}
          snippets={projectStudy.events.snippets}
        />
      </Panel>
    </div>
  );
}
