import { useEffect, useEffectEvent, useState } from 'react';

import {
  buildPulseMessage,
  describeResubscribeRisk,
  pulseThemeOptions,
  roomOptions,
  type PulseDetail,
  type PulseTheme,
  type RoomId,
} from '../../lib/effect-event-model';
import { MetricCard, Panel, StatusPill } from '../ui';

const pulseEventName = 'lesson-51-priority-pulse';

function LegacySubscriptionCard({
  roomId,
  theme,
  subscriptionCount,
}: {
  roomId: RoomId;
  theme: PulseTheme;
  subscriptionCount: number;
}) {
  const [handledEvents, setHandledEvents] = useState(0);
  const [lastMessage, setLastMessage] = useState('Пока pulse не приходил.');

  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<PulseDetail>).detail;

      if (detail.roomId !== roomId) {
        return;
      }

      setHandledEvents((current) => current + 1);
      setLastMessage(buildPulseMessage(detail, theme));
    };

    window.addEventListener(pulseEventName, listener as EventListener);

    return () => {
      window.removeEventListener(pulseEventName, listener as EventListener);
    };
  }, [roomId, theme]);

  return (
    <Panel className="space-y-4 border-rose-200 bg-rose-50">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">
          Legacy dependency-bound effect
        </p>
        <StatusPill tone="error">theme in deps</StatusPill>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <MetricCard
          label="Subscriptions"
          value={String(subscriptionCount)}
          hint="Theme change пересоздаёт listener, даже если внешний room source не менялся."
          tone="accent"
        />
        <MetricCard
          label="Handled pulses"
          value={String(handledEvents)}
          hint="События обрабатываются корректно, но цена — лишние resubscribe."
          tone="cool"
        />
      </div>
      <p className="text-sm leading-6 text-slate-700">{lastMessage}</p>
      <p className="text-sm leading-6 text-slate-600">{describeResubscribeRisk(false)}</p>
    </Panel>
  );
}

function EffectEventSubscriptionCard({
  roomId,
  theme,
  subscriptionCount,
}: {
  roomId: RoomId;
  theme: PulseTheme;
  subscriptionCount: number;
}) {
  const [handledEvents, setHandledEvents] = useState(0);
  const [lastMessage, setLastMessage] = useState('Пока pulse не приходил.');

  const onPulse = useEffectEvent((detail: PulseDetail) => {
    setHandledEvents((current) => current + 1);
    setLastMessage(buildPulseMessage(detail, theme));
  });

  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<PulseDetail>).detail;

      if (detail.roomId !== roomId) {
        return;
      }

      onPulse(detail);
    };

    // useEffectEvent держит callback актуальным без того, чтобы theme ломала
    // стабильность самой подписки на внешний источник.
    window.addEventListener(pulseEventName, listener as EventListener);

    return () => {
      window.removeEventListener(pulseEventName, listener as EventListener);
    };
  }, [roomId]);

  return (
    <Panel className="space-y-4 border-emerald-200 bg-emerald-50">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">
          Effect-local callback via useEffectEvent
        </p>
        <StatusPill tone="success">theme outside deps</StatusPill>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <MetricCard
          label="Subscriptions"
          value={String(subscriptionCount)}
          hint="Theme switch не трогает listener, если room source остаётся прежним."
          tone="accent"
        />
        <MetricCard
          label="Handled pulses"
          value={String(handledEvents)}
          hint="Callback всё равно читает актуальную тему и форматирует pulse по новым правилам."
          tone="cool"
        />
      </div>
      <p className="text-sm leading-6 text-slate-700">{lastMessage}</p>
      <p className="text-sm leading-6 text-slate-600">{describeResubscribeRisk(true)}</p>
    </Panel>
  );
}

export function EffectEventLab() {
  const [roomId, setRoomId] = useState<RoomId>('release');
  const [theme, setTheme] = useState<PulseTheme>('calm');
  const [sequence, setSequence] = useState(0);
  const [legacySubscriptions, setLegacySubscriptions] = useState(1);
  const [effectEventSubscriptions, setEffectEventSubscriptions] = useState(1);

  function handleRoomChange(nextRoomId: RoomId) {
    setRoomId(nextRoomId);
    setLegacySubscriptions((current) => current + 1);
    setEffectEventSubscriptions((current) => current + 1);
  }

  function handleThemeChange(nextTheme: PulseTheme) {
    setTheme(nextTheme);
    setLegacySubscriptions((current) => current + 1);
  }

  function emitPulse() {
    const nextSequence = sequence + 1;
    setSequence(nextSequence);

    window.dispatchEvent(
      new CustomEvent<PulseDetail>(pulseEventName, {
        detail: { roomId, sequence: nextSequence },
      }),
    );
  }

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Room source</span>
              <select
                value={roomId}
                onChange={(event) => {
                  handleRoomChange(event.target.value as RoomId);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                {roomOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Visual theme</span>
              <select
                value={theme}
                onChange={(event) => {
                  handleThemeChange(event.target.value as PulseTheme);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                {pulseThemeOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={emitPulse}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              Emit pulse
            </button>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <LegacySubscriptionCard
              roomId={roomId}
              theme={theme}
              subscriptionCount={legacySubscriptions}
            />
            <EffectEventSubscriptionCard
              roomId={roomId}
              theme={theme}
              subscriptionCount={effectEventSubscriptions}
            />
          </div>
        </div>
      </Panel>
    </div>
  );
}
