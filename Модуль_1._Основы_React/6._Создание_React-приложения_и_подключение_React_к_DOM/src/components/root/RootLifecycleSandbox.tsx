import { useEffect, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import type { RootLifecycleSnapshot, SandboxView } from '../../lib/root-lifecycle-model';

type RootLifecycleSandboxProps = {
  onSnapshotChange?: (snapshot: RootLifecycleSnapshot) => void;
};

export function RootLifecycleSandbox({ onSnapshotChange }: RootLifecycleSandboxProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<Root | null>(null);
  const [hostPresent, setHostPresent] = useState(true);
  const [rootCreated, setRootCreated] = useState(false);
  const [activeView, setActiveView] = useState<SandboxView>('none');
  const [logs, setLogs] = useState<string[]>([]);

  const appendLog = (message: string) => {
    setLogs((current) =>
      [`${new Date().toLocaleTimeString('ru-RU')} — ${message}`, ...current].slice(0, 12),
    );
  };

  useEffect(() => {
    onSnapshotChange?.({
      hostPresent,
      rootCreated,
      treeMounted: activeView !== 'none',
      activeView,
      logCount: logs.length,
    });
  }, [activeView, hostPresent, logs.length, onSnapshotChange, rootCreated]);

  useEffect(() => {
    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
      }
    };
  }, []);

  const createSandboxRoot = () => {
    if (!hostRef.current) {
      appendLog('createRoot(...) невозможен: host-контейнер сейчас отсутствует.');
      return;
    }

    if (rootRef.current) {
      appendLog(
        'React Root уже создан. Повторный createRoot для того же контейнера не нужен.',
      );
      return;
    }

    // Отдельный sub-root нужен специально для урока: так видно реальный lifecycle root
    // и можно монтировать/размонтировать поддерево независимо от главного App root.
    rootRef.current = createRoot(hostRef.current);
    setRootCreated(true);
    appendLog('Создан отдельный React Root через createRoot(container).');
  };

  const renderView = (nextView: Exclude<SandboxView, 'none'>) => {
    if (!rootRef.current) {
      appendLog(
        'Сначала нужно создать React Root, а уже потом вызывать root.render(...).',
      );
      return;
    }

    const element =
      nextView === 'counter' ? (
        <SandboxCounterCard onLog={appendLog} />
      ) : (
        <SandboxMessageCard onLog={appendLog} />
      );

    rootRef.current.render(element);
    setActiveView(nextView);
    appendLog(
      nextView === 'counter'
        ? 'В root смонтирован интерактивный counter-widget.'
        : 'В root смонтирован текстовый info-widget.',
    );
  };

  const unmountRoot = () => {
    if (!rootRef.current) {
      appendLog('Размонтировать нечего: root пока не создан.');
      return;
    }

    rootRef.current.unmount();
    rootRef.current = null;
    setRootCreated(false);
    setActiveView('none');
    appendLog('React Root очищен через root.unmount().');
  };

  const toggleHostContainer = () => {
    if (hostPresent) {
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
        setRootCreated(false);
        setActiveView('none');
        appendLog('Host-контейнер удалён из DOM, root корректно размонтирован.');
      } else {
        appendLog('Host-контейнер убран из DOM до создания React Root.');
      }

      setHostPresent(false);
      return;
    }

    setHostPresent(true);
    appendLog('Host-контейнер снова добавлен в DOM.');
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div className="space-y-3">
        <button
          type="button"
          onClick={createSandboxRoot}
          className="chip w-full justify-center"
        >
          Создать React Root
        </button>
        <button
          type="button"
          onClick={() => renderView('counter')}
          className="chip w-full justify-center"
        >
          Смонтировать counter
        </button>
        <button
          type="button"
          onClick={() => renderView('message')}
          className="chip w-full justify-center"
        >
          Смонтировать message
        </button>
        <button
          type="button"
          onClick={unmountRoot}
          className="chip w-full justify-center"
        >
          Вызвать root.unmount()
        </button>
        <button
          type="button"
          onClick={toggleHostContainer}
          className="chip w-full justify-center"
        >
          {hostPresent ? 'Убрать host-контейнер' : 'Вернуть host-контейнер'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Host container
          </p>
          {hostPresent ? (
            <div
              ref={hostRef}
              className="mt-3 min-h-[220px] rounded-[20px] border border-dashed border-slate-300 bg-white p-4"
            />
          ) : (
            <div className="mt-3 rounded-[20px] border border-rose-200 bg-rose-50 p-6 text-sm leading-6 text-rose-900">
              Контейнер убран из DOM. React Root сейчас монтировать некуда.
            </div>
          )}
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Журнал lifecycle
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {logs.length > 0 ? (
              logs.map((entry) => <li key={entry}>{entry}</li>)
            ) : (
              <li>Журнал пуст. Начните с `createRoot(container)`.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SandboxCounterCard({ onLog }: { onLog: (line: string) => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    onLog('Counter-widget смонтирован в отдельный React Root.');

    return () => {
      onLog('Counter-widget очищен при unmount отдельного root.');
    };
  }, [onLog]);

  return (
    <section className="rounded-[20px] border border-blue-200 bg-blue-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
        Separate root
      </p>
      <h3 className="mt-2 text-xl font-semibold text-blue-950">Counter widget</h3>
      <p className="mt-2 text-sm leading-6 text-blue-900/80">
        Этот виджет живёт не внутри общего App tree, а в отдельном root.
      </p>
      <p className="mt-4 text-3xl font-bold tracking-tight text-blue-950">{count}</p>
      <button
        type="button"
        onClick={() => {
          setCount((current) => current + 1);
          onLog('Локальное состояние counter-widget обновлено внутри отдельного root.');
        }}
        className="mt-4 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
      >
        Увеличить счётчик
      </button>
    </section>
  );
}

function SandboxMessageCard({ onLog }: { onLog: (line: string) => void }) {
  useEffect(() => {
    onLog('Message-widget смонтирован как альтернативное дерево того же root.');

    return () => {
      onLog('Message-widget очищен при следующем root.render(...) или unmount.');
    };
  }, [onLog]);

  return (
    <section className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
        Separate root
      </p>
      <h3 className="mt-2 text-xl font-semibold text-emerald-950">Message widget</h3>
      <p className="mt-2 text-sm leading-6 text-emerald-900/80">
        Один и тот же root может отрисовывать другое React-поддерево через новый вызов
        `root.render(...)`.
      </p>
    </section>
  );
}
