import { useEffect, useRef, useState } from 'react';

import { buildReactNativeReport } from '../../lib/react-native-model';
import { ListBlock, Panel, StatusPill } from '../ui';

type BridgeEntry = {
  source: 'react' | 'native';
  host: 'wrapper' | 'button';
  type: string;
  target: string;
  currentTarget: string;
  nativeType: string;
};

function readNodeLabel(node: EventTarget | null) {
  if (!(node instanceof HTMLElement)) {
    return 'unknown';
  }

  return node.dataset.host ?? node.tagName.toLowerCase();
}

export function ReactNativeBridgeLab() {
  const [listenOnWrapper, setListenOnWrapper] = useState(true);
  const [listenOnButton, setListenOnButton] = useState(true);
  const [history, setHistory] = useState<BridgeEntry[]>([]);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const report = buildReactNativeReport();

  function pushEntry(entry: BridgeEntry) {
    setHistory((current) => [entry, ...current].slice(0, 10));
  }

  useEffect(() => {
    if (!listenOnWrapper) {
      return;
    }

    const node = wrapperRef.current;
    if (!node) {
      return;
    }

    function handleNativeClick(event: MouseEvent) {
      pushEntry({
        source: 'native',
        host: 'wrapper',
        type: event.type,
        target: readNodeLabel(event.target),
        currentTarget: readNodeLabel(event.currentTarget),
        nativeType: event.constructor.name,
      });
    }

    // В dev + StrictMode effect монтируется и снимается повторно.
    // Cleanup не даёт накопить дублирующиеся native-listeners.
    node.addEventListener('click', handleNativeClick);

    return () => {
      node.removeEventListener('click', handleNativeClick);
    };
  }, [listenOnWrapper]);

  useEffect(() => {
    if (!listenOnButton) {
      return;
    }

    const node = buttonRef.current;
    if (!node) {
      return;
    }

    function handleNativeClick(event: MouseEvent) {
      pushEntry({
        source: 'native',
        host: 'button',
        type: event.type,
        target: readNodeLabel(event.target),
        currentTarget: readNodeLabel(event.currentTarget),
        nativeType: event.constructor.name,
      });
    }

    node.addEventListener('click', handleNativeClick);

    return () => {
      node.removeEventListener('click', handleNativeClick);
    };
  }, [listenOnButton]);

  function handleReactClick(
    host: 'wrapper' | 'button',
    event: React.MouseEvent<HTMLElement>,
  ) {
    pushEntry({
      source: 'react',
      host,
      type: event.type,
      target: readNodeLabel(event.target),
      currentTarget: readNodeLabel(event.currentTarget),
      nativeType: event.nativeEvent.constructor.name,
    });
  }

  const reactCount = history.filter((entry) => entry.source === 'react').length;
  const nativeCount = history.filter((entry) => entry.source === 'native').length;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={listenOnWrapper}
              onChange={(event) => setListenOnWrapper(event.target.checked)}
            />
            native listener на wrapper
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={listenOnButton}
              onChange={(event) => setListenOnButton(event.target.checked)}
            />
            native listener на button
          </label>
        </div>

        <div
          ref={wrapperRef}
          data-host="wrapper"
          onClick={(event) => handleReactClick('wrapper', event)}
          className="rounded-[28px] border border-blue-200 bg-blue-50 p-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            wrapper
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Клик по внутренней кнопке одновременно пройдёт через React handler и через
            native listeners, если они включены.
          </p>
          <button
            ref={buttonRef}
            type="button"
            data-host="button"
            onClick={(event) => handleReactClick('button', event)}
            className="mt-5 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Нажмите, чтобы сравнить два уровня событий
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              React entries
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {reactCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Native entries
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {nativeCount}
            </p>
          </div>
        </div>
      </Panel>

      <Panel className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Bridge log</h3>
          <StatusPill tone={report.tone}>SyntheticEvent + DOM Event</StatusPill>
        </div>

        <ListBlock title="Что сравнивается" items={report.differences} />

        <div className="space-y-2">
          {history.length > 0 ? (
            history.map((entry, index) => (
              <div
                key={`${entry.source}-${entry.host}-${index}`}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {entry.source} / {entry.host}
                  </p>
                  <StatusPill tone={entry.source === 'react' ? 'success' : 'warn'}>
                    {entry.nativeType}
                  </StatusPill>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  target: <code>{entry.target}</code>, currentTarget:{' '}
                  <code>{entry.currentTarget}</code>
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-500">
              Нажмите кнопку слева. Здесь появится общий журнал React и native слушателей.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
