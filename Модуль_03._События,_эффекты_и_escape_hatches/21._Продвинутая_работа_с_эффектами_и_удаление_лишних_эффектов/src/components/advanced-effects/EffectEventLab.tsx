import clsx from 'clsx';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

import {
  createManualConnection,
  type EffectEventMode,
  type ManualConnection,
  type ThemeMode,
} from '../../lib/advanced-effect-domain';
import { Panel, StatusPill } from '../ui';

const themes: readonly ThemeMode[] = ['light', 'dark', 'contrast'];
const rooms = ['room-alpha', 'room-beta', 'room-gamma'] as const;

type RuntimeMode = EffectEventMode;

function RuntimeShell({
  note,
  connectionCount,
  disconnectCount,
  notificationTheme,
  logs,
  onEmit,
}: {
  note: string;
  connectionCount: number;
  disconnectCount: number;
  notificationTheme: string;
  logs: readonly string[];
  onEmit: () => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Connect
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {connectionCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Disconnect
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {disconnectCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Toast theme
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {notificationTheme}
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-600">{note}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <StatusPill tone="success">external callback</StatusPill>
          <button
            type="button"
            onClick={onEmit}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Эмулировать внешнее событие
          </button>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Журнал соединения
        </p>
        <div className="mt-4 space-y-2">
          {logs.map((line) => (
            <div
              key={line}
              className="rounded-2xl border border-white bg-white px-4 py-3 text-sm leading-6 text-slate-700"
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type RuntimeProps = {
  roomId: string;
  theme: ThemeMode;
};

function StaleThemeRuntime({ roomId, theme }: RuntimeProps) {
  const connectionRef = useRef<ManualConnection | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [connectionCount, setConnectionCount] = useState(0);
  const [disconnectCount, setDisconnectCount] = useState(0);
  const [notificationTheme, setNotificationTheme] = useState(theme);

  // Theme намеренно не входит в dependencies:
  // этот runtime нужен именно для демонстрации stale closure.
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const connection = createManualConnection(
      roomId,
      (message) => {
        setLogs((current) => [message, ...current].slice(0, 8));
        if (message.startsWith('connect')) {
          setConnectionCount((current) => current + 1);
        }
        if (message.startsWith('disconnect')) {
          setDisconnectCount((current) => current + 1);
        }
      },
      () => {
        setNotificationTheme(theme);
        setLogs((current) => [`toast -> theme ${theme}`, ...current].slice(0, 8));
      },
    );

    connectionRef.current = connection;

    return () => {
      connection.disconnect();
      if (connectionRef.current === connection) {
        connectionRef.current = null;
      }
    };
  }, [roomId]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <RuntimeShell
      note="Theme не входит в dependencies, поэтому reconnect не происходит. Но callback продолжает читать тему из того render, где effect был создан."
      connectionCount={connectionCount}
      disconnectCount={disconnectCount}
      notificationTheme={notificationTheme}
      logs={logs}
      onEmit={() => connectionRef.current?.emitConnected()}
    />
  );
}

function ThemeDependencyRuntime({ roomId, theme }: RuntimeProps) {
  const connectionRef = useRef<ManualConnection | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [connectionCount, setConnectionCount] = useState(0);
  const [disconnectCount, setDisconnectCount] = useState(0);
  const [notificationTheme, setNotificationTheme] = useState(theme);

  useEffect(() => {
    const connection = createManualConnection(
      roomId,
      (message) => {
        setLogs((current) => [message, ...current].slice(0, 8));
        if (message.startsWith('connect')) {
          setConnectionCount((current) => current + 1);
        }
        if (message.startsWith('disconnect')) {
          setDisconnectCount((current) => current + 1);
        }
      },
      () => {
        setNotificationTheme(theme);
        setLogs((current) => [`toast -> theme ${theme}`, ...current].slice(0, 8));
      },
    );

    connectionRef.current = connection;

    return () => {
      connection.disconnect();
      if (connectionRef.current === connection) {
        connectionRef.current = null;
      }
    };
  }, [roomId, theme]);

  return (
    <RuntimeShell
      note="Theme попала в dependencies, и каждое изменение темы перестраивает внешнее соединение, хотя сама синхронизация по roomId не изменилась."
      connectionCount={connectionCount}
      disconnectCount={disconnectCount}
      notificationTheme={notificationTheme}
      logs={logs}
      onEmit={() => connectionRef.current?.emitConnected()}
    />
  );
}

function EffectEventRuntime({ roomId, theme }: RuntimeProps) {
  const connectionRef = useRef<ManualConnection | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [connectionCount, setConnectionCount] = useState(0);
  const [disconnectCount, setDisconnectCount] = useState(0);
  const [notificationTheme, setNotificationTheme] = useState(theme);

  const onConnected = useEffectEvent(() => {
    setNotificationTheme(theme);
    setLogs((current) => [`toast -> theme ${theme}`, ...current].slice(0, 8));
  });

  useEffect(() => {
    // useEffectEvent позволяет effect-у зависеть только от roomId,
    // а внешний callback всё равно видит свежую тему текущего render-а.
    const connection = createManualConnection(
      roomId,
      (message) => {
        setLogs((current) => [message, ...current].slice(0, 8));
        if (message.startsWith('connect')) {
          setConnectionCount((current) => current + 1);
        }
        if (message.startsWith('disconnect')) {
          setDisconnectCount((current) => current + 1);
        }
      },
      () => {
        onConnected();
      },
    );

    connectionRef.current = connection;

    return () => {
      connection.disconnect();
      if (connectionRef.current === connection) {
        connectionRef.current = null;
      }
    };
  }, [roomId]);

  return (
    <RuntimeShell
      note="Effect синхронизирует только roomId. Theme остаётся доступной внутри внешнего callback без лишнего reconnect и без stale closure."
      connectionCount={connectionCount}
      disconnectCount={disconnectCount}
      notificationTheme={notificationTheme}
      logs={logs}
      onEmit={() => connectionRef.current?.emitConnected()}
    />
  );
}

export function EffectEventLab() {
  const [mode, setMode] = useState<RuntimeMode>('stale-theme');
  const [roomId, setRoomId] = useState<(typeof rooms)[number]>('room-alpha');
  const [theme, setTheme] = useState<ThemeMode>('light');

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {(
          [
            ['stale-theme', 'stale-theme'],
            ['theme-dependency', 'theme-dependency'],
            ['effect-event', 'useEffectEvent'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={clsx(
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              mode === id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-700">Room</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {rooms.map((room) => (
              <button
                key={room}
                type="button"
                onClick={() => setRoomId(room)}
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  roomId === room
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                )}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-700">Theme</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {themes.map((themeOption) => (
              <button
                key={themeOption}
                type="button"
                onClick={() => setTheme(themeOption)}
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  theme === themeOption
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                )}
              >
                {themeOption}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mode === 'stale-theme' ? (
        <StaleThemeRuntime roomId={roomId} theme={theme} />
      ) : null}
      {mode === 'theme-dependency' ? (
        <ThemeDependencyRuntime roomId={roomId} theme={theme} />
      ) : null}
      {mode === 'effect-event' ? (
        <EffectEventRuntime roomId={roomId} theme={theme} />
      ) : null}
    </Panel>
  );
}
