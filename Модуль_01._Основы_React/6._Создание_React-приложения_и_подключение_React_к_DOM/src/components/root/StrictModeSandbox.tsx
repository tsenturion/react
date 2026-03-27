import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import type {
  ProbeKind,
  RuntimeMode,
  StrictModeSnapshot,
} from '../../lib/strict-mode-model';

type StrictModeSandboxProps = {
  strictEnabled: boolean;
  probeKind: ProbeKind;
  refreshToken: number;
  onSnapshotChange?: (snapshot: StrictModeSnapshot) => void;
};

export function StrictModeSandbox({
  strictEnabled,
  probeKind,
  refreshToken,
  onSnapshotChange,
}: StrictModeSandboxProps) {
  const runtimeMode: RuntimeMode = import.meta.env.DEV ? 'development' : 'production';
  const sessionKey = `${probeKind}-${strictEnabled}-${refreshToken}`;

  return (
    <StrictModeRuntime
      key={sessionKey}
      runtimeMode={runtimeMode}
      strictEnabled={strictEnabled}
      probeKind={probeKind}
      onSnapshotChange={onSnapshotChange}
    />
  );
}

function StrictModeRuntime({
  runtimeMode,
  strictEnabled,
  probeKind,
  onSnapshotChange,
}: Omit<StrictModeSandboxProps, 'refreshToken'> & { runtimeMode: RuntimeMode }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<Root | null>(null);
  const [effectLogs, setEffectLogs] = useState<string[]>([]);
  const [renderedItems, setRenderedItems] = useState(0);

  useEffect(() => {
    onSnapshotChange?.({
      runtimeMode,
      strictEnabled,
      probeKind,
      renderedItems,
      effectLogCount: effectLogs.length,
    });
  }, [
    effectLogs.length,
    onSnapshotChange,
    probeKind,
    renderedItems,
    runtimeMode,
    strictEnabled,
  ]);

  useEffect(() => {
    if (!hostRef.current) {
      return;
    }

    if (!rootRef.current) {
      // Это отдельный root вне главного App tree: так можно честно сравнить
      // subtree с StrictMode и без него, даже если всё приложение сверху уже обёрнуто в StrictMode.
      rootRef.current = createRoot(hostRef.current);
    }

    const sourceItems = ['root', 'app', 'widget'];
    const probe =
      probeKind === 'pure' ? (
        <PureProbe
          sourceItems={sourceItems}
          onEffectEvent={(entry) =>
            setEffectLogs((current) => [entry, ...current].slice(0, 8))
          }
          onRenderedItems={setRenderedItems}
        />
      ) : (
        <ImpureProbe
          sourceItems={sourceItems}
          onEffectEvent={(entry) =>
            setEffectLogs((current) => [entry, ...current].slice(0, 8))
          }
          onRenderedItems={setRenderedItems}
        />
      );

    rootRef.current.render(strictEnabled ? <StrictMode>{probe}</StrictMode> : probe);
  }, [probeKind, strictEnabled]);

  useEffect(() => {
    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
      }
    };
  }, []);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Runtime host
        </p>
        <div
          ref={hostRef}
          className="mt-3 min-h-[240px] rounded-[20px] border border-dashed border-slate-300 bg-white p-4"
        />
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Runtime mode
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{runtimeMode}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Сейчас sandbox исполняется в режиме {runtimeMode}. Именно он определяет, будут
            ли StrictMode dev-checks дублировать часть поведения.
          </p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Effect journal
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {effectLogs.length > 0 ? (
              effectLogs.map((entry) => <li key={entry}>{entry}</li>)
            ) : (
              <li>После перемонтирования здесь появятся mount/cleanup записи.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PureProbe({
  sourceItems,
  onEffectEvent,
  onRenderedItems,
}: {
  sourceItems: string[];
  onEffectEvent: (entry: string) => void;
  onRenderedItems: (count: number) => void;
}) {
  const visibleItems = [...sourceItems, 'render snapshot'];

  useEffect(() => {
    onRenderedItems(visibleItems.length);
    onEffectEvent('Pure probe: effect mount');

    return () => {
      onEffectEvent('Pure probe: cleanup');
    };
  }, [onEffectEvent, onRenderedItems, visibleItems.length]);

  return (
    <section className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
        Pure probe
      </p>
      <p className="mt-2 text-sm leading-6 text-emerald-900/80">
        Компонент не мутирует входные данные в render.
      </p>
      <ul className="mt-4 space-y-2 text-sm text-emerald-950">
        {visibleItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function ImpureProbe({
  sourceItems,
  onEffectEvent,
  onRenderedItems,
}: {
  sourceItems: string[];
  onEffectEvent: (entry: string) => void;
  onRenderedItems: (count: number) => void;
}) {
  sourceItems.push(`render side effect ${sourceItems.length}`);

  useEffect(() => {
    onRenderedItems(sourceItems.length);
    onEffectEvent('Impure probe: effect mount');

    return () => {
      onEffectEvent('Impure probe: cleanup');
    };
  }, [onEffectEvent, onRenderedItems, sourceItems]);

  return (
    <section className="rounded-[20px] border border-rose-200 bg-rose-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
        Impure probe
      </p>
      <p className="mt-2 text-sm leading-6 text-rose-900/80">
        Компонент мутирует входной массив прямо в render. Это намеренно плохой пример для
        демонстрации того, как StrictMode помогает заметить проблему.
      </p>
      <ul className="mt-4 space-y-2 text-sm text-rose-950">
        {sourceItems.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
