import clsx from 'clsx';
import { useEffect, useEffectEvent, useState } from 'react';

import {
  createPresenceHub,
  effectRooms,
  type PresencePacket,
  type SubscriptionMode,
} from '../../lib/effect-domain';
import { buildSubscriptionReport } from '../../lib/effect-subscription-model';
import { CodeBlock, Panel, StatusPill } from '../ui';

const sharedHub = createPresenceHub();

export function SubscriptionLab() {
  const [roomId, setRoomId] = useState<(typeof effectRooms)[number]['id']>('dom');
  const [mode, setMode] = useState<SubscriptionMode>('cleanup');
  const [packets, setPackets] = useState<PresencePacket[]>([]);
  const [subscriberSnapshot, setSubscriberSnapshot] = useState<Record<string, number>>(
    sharedHub.snapshot(),
  );
  const [log, setLog] = useState<string[]>([]);

  const report = buildSubscriptionReport(mode);
  const activeRoom = effectRooms.find((room) => room.id === roomId) ?? effectRooms[0];

  const refreshSnapshotFromEffect = useEffectEvent(() => {
    setSubscriberSnapshot(sharedHub.snapshot());
  });

  const appendEffectLog = useEffectEvent((message: string) => {
    setLog((current) => [message, ...current].slice(0, 10));
  });

  function refreshSnapshot() {
    setSubscriberSnapshot(sharedHub.snapshot());
  }

  function appendLog(message: string) {
    setLog((current) => [message, ...current].slice(0, 10));
  }

  useEffect(() => {
    const unsubscribe = sharedHub.subscribe(roomId, (packet) => {
      setPackets((current) => [packet, ...current].slice(0, 8));
    });

    appendEffectLog(`setup subscription → ${roomId}`);
    refreshSnapshotFromEffect();

    if (mode === 'cleanup') {
      return () => {
        unsubscribe();
        appendEffectLog(`cleanup subscription → ${roomId}`);
        refreshSnapshotFromEffect();
      };
    }

    return undefined;
  }, [roomId, mode]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {(['cleanup', 'no-cleanup'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={clsx('chip', mode === item && 'chip-active')}
            >
              {item === 'cleanup' ? 'С cleanup' : 'Без cleanup'}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {effectRooms.map((room) => (
            <button
              key={room.id}
              type="button"
              onClick={() => setRoomId(room.id)}
              className={clsx('chip', roomId === room.id && 'chip-active')}
            >
              {room.title}
            </button>
          ))}
        </div>

        <div className="grid gap-3">
          {effectRooms.map((room) => (
            <div
              key={room.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{room.title}</p>
                <p className="text-sm leading-6 text-slate-600">{room.area}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">
                  listeners: {subscriberSnapshot[room.id] ?? 0}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const packet = sharedHub.emit(
                      room.id,
                      `external packet for ${room.title}`,
                    );
                    appendLog(`emit #${packet.sequence} → ${room.id}`);
                    refreshSnapshot();
                  }}
                  className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Эмитировать сообщение
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            active room
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{activeRoom.title}</p>
        </div>

        <CodeBlock label={report.title} code={report.snippet} />
      </Panel>

      <Panel className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Subscription log</h3>
          <StatusPill tone={report.tone}>{mode}</StatusPill>
        </div>
        <p className="text-sm leading-6 text-slate-600">{report.summary}</p>

        <div className="space-y-2">
          {packets.length > 0 ? (
            packets.map((packet) => (
              <div
                key={packet.sequence}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  #{packet.sequence} / {packet.roomId}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{packet.message}</p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-500">
              Переключайте room и отправляйте внешние сообщения. В режиме без cleanup
              старые rooms продолжат доставлять пакеты.
            </div>
          )}
        </div>

        <div className="space-y-2">
          {log.map((entry, index) => (
            <div
              key={`${entry}-${index}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
            >
              {entry}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
