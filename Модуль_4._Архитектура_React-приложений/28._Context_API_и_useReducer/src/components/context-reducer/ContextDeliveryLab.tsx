import clsx from 'clsx';
import { createContext, useContext, useState, type ReactNode } from 'react';

import { deliveryTracks, type DeliveryTrack } from '../../lib/context-domain';
import { describeDelivery, type DeliveryMode } from '../../lib/delivery-model';
import { MetricCard, StatusPill } from '../ui';

type DeliveryContextValue = {
  selectedTrack: DeliveryTrack;
  setSelectedTrack: (track: DeliveryTrack) => void;
};

const TrackDeliveryContext = createContext<DeliveryContextValue | null>(null);

function useTrackDelivery() {
  const context = useContext(TrackDeliveryContext);

  if (!context) {
    throw new Error('useTrackDelivery must be used inside TrackDeliveryProvider.');
  }

  return context;
}

function TrackDeliveryProvider({ children }: { children: ReactNode }) {
  const [selectedTrack, setSelectedTrack] = useState<DeliveryTrack>('state');

  return (
    <TrackDeliveryContext.Provider value={{ selectedTrack, setSelectedTrack }}>
      {children}
    </TrackDeliveryContext.Provider>
  );
}

function DeliveryNode({
  title,
  subtitle,
  emphasized,
  children,
}: {
  title: string;
  subtitle: string;
  emphasized?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={clsx(
        'rounded-2xl border p-4',
        emphasized ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50',
      )}
    >
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{subtitle}</p>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

function PropsLeaf({
  selectedTrack,
  onSelectTrack,
}: {
  selectedTrack: DeliveryTrack;
  onSelectTrack: (track: DeliveryTrack) => void;
}) {
  return (
    <DeliveryNode
      title="Deep selector"
      subtitle="Именно этот компонент реально использует значение и callback."
      emphasized
    >
      <div className="flex flex-wrap gap-2">
        {deliveryTracks.map((track) => (
          <button
            key={track.id}
            type="button"
            onClick={() => onSelectTrack(track.id)}
            className={clsx(
              'rounded-xl px-3 py-2 text-sm font-medium transition',
              selectedTrack === track.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100',
            )}
          >
            {track.label}
          </button>
        ))}
      </div>
    </DeliveryNode>
  );
}

function PropsBranch() {
  const [selectedTrack, setSelectedTrack] = useState<DeliveryTrack>('state');
  const selectedMeta = deliveryTracks.find((track) => track.id === selectedTrack);

  return (
    <div className="space-y-3">
      <DeliveryNode
        title="Root"
        subtitle="Знает selectedTrack и onSelectTrack, а затем проталкивает их дальше."
      >
        <DeliveryNode
          title="Layout shell"
          subtitle="Сам не использует значение, но уже вынужден знать о чужих props."
        >
          <DeliveryNode
            title="Sidebar section"
            subtitle="Снова просто перекидывает props на следующий уровень."
          >
            <PropsLeaf selectedTrack={selectedTrack} onSelectTrack={setSelectedTrack} />
          </DeliveryNode>
        </DeliveryNode>
      </DeliveryNode>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
        Сейчас выбрано: <strong>{selectedMeta?.label}</strong>. Промежуточные компоненты
        были вынуждены держать на себе оба props, хотя реально они нужны только
        leaf-компоненту.
      </div>
    </div>
  );
}

function ContextLeaf() {
  const { selectedTrack, setSelectedTrack } = useTrackDelivery();

  return (
    <DeliveryNode
      title="Deep selector"
      subtitle="Leaf-компонент читает context напрямую и не просит промежуточные уровни тащить props."
      emphasized
    >
      <div className="flex flex-wrap gap-2">
        {deliveryTracks.map((track) => (
          <button
            key={track.id}
            type="button"
            onClick={() => setSelectedTrack(track.id)}
            className={clsx(
              'rounded-xl px-3 py-2 text-sm font-medium transition',
              selectedTrack === track.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100',
            )}
          >
            {track.label}
          </button>
        ))}
      </div>
    </DeliveryNode>
  );
}

function ContextSummary() {
  const { selectedTrack } = useTrackDelivery();
  const selectedMeta = deliveryTracks.find((track) => track.id === selectedTrack);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
      Сейчас выбрано: <strong>{selectedMeta?.label}</strong>. Layout-ветка остаётся
      чистой: она больше не знает про setter и не передаёт чужой API дальше по дереву.
    </div>
  );
}

function ContextBranch() {
  return (
    <TrackDeliveryProvider>
      <div className="space-y-3">
        <DeliveryNode
          title="Root"
          subtitle="Provider задаёт ближайшую область, внутри которой данные доступны без prop drilling."
        >
          <DeliveryNode
            title="Layout shell"
            subtitle="Layout-компонент снова отвечает только за layout и не знает про track API."
          >
            <DeliveryNode
              title="Sidebar section"
              subtitle="Промежуточный уровень остаётся нейтральным и не загрязняется чужими props."
            >
              <ContextLeaf />
            </DeliveryNode>
          </DeliveryNode>
        </DeliveryNode>

        <ContextSummary />
      </div>
    </TrackDeliveryProvider>
  );
}

export function ContextDeliveryLab() {
  const [focus, setFocus] = useState<DeliveryMode>('props');
  const report = describeDelivery(focus);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone={report.tone}>{report.tone}</StatusPill>
        <p className="text-sm leading-6 text-slate-600">{report.headline}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Фокус сравнения"
          value={focus === 'props' ? 'Prop drilling' : 'Context'}
          hint="Переключайте акцент, чтобы видеть риски обеих схем."
          tone={focus === 'props' ? 'accent' : 'cool'}
        />
        <MetricCard
          label="Промежуточных уровней"
          value={String(report.visibleIntermediaries)}
          hint="Сколько layout-компонентов вынуждены знать о чужих данных."
        />
        <MetricCard
          label="Главная мысль"
          value={focus === 'props' ? 'Не рано' : 'Не везде'}
          hint={report.summary}
        />
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-wrap gap-2">
          {(['props', 'context'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFocus(value)}
              className={clsx(
                'rounded-xl px-4 py-3 text-sm font-medium transition',
                focus === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100',
              )}
            >
              {value === 'props' ? 'Смотреть через props' : 'Смотреть через context'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div
          className={clsx(
            'rounded-[28px] border p-5 shadow-sm transition',
            focus === 'props'
              ? 'border-orange-300 bg-orange-50'
              : 'border-slate-200 bg-white',
          )}
        >
          <p className="text-sm font-semibold text-slate-900">Ветка с prop drilling</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Значение и callback проходят через уровни, которые сами не принимают решения.
          </p>
          <div className="mt-4">
            <PropsBranch />
          </div>
        </div>

        <div
          className={clsx(
            'rounded-[28px] border p-5 shadow-sm transition',
            focus === 'context'
              ? 'border-emerald-300 bg-emerald-50'
              : 'border-slate-200 bg-white',
          )}
        >
          <p className="text-sm font-semibold text-slate-900">Ветка с context delivery</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Provider задаёт область видимости, а leaf-компонент читает данные без лишнего
            знания промежуточных layout-узлов.
          </p>
          <div className="mt-4">
            <ContextBranch />
          </div>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {report.risks.map((risk) => (
          <div
            key={risk}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-700"
          >
            {risk}
          </div>
        ))}
      </div>
    </div>
  );
}
