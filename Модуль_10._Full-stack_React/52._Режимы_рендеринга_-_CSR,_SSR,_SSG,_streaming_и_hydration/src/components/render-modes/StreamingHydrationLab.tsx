import { useState } from 'react';

import {
  simulateStreamingHydration,
  streamingProfiles,
  type SegmentId,
  type StreamingProfileId,
} from '../../lib/streaming-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function StreamingHydrationLab() {
  const [profileId, setProfileId] = useState<StreamingProfileId>('search');
  const [networkMs, setNetworkMs] = useState(90);
  const [jsBootMs, setJsBootMs] = useState(220);
  const [selectedSegment, setSelectedSegment] = useState<SegmentId | 'none'>('results');

  const profile =
    streamingProfiles.find((item) => item.id === profileId) ?? streamingProfiles[0];
  const simulation = simulateStreamingHydration({
    profileId,
    networkMs,
    jsBootMs,
    selectedSegment,
  });

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Streaming timeline</span>
          <p className="text-sm leading-6 text-slate-600">
            Здесь видно, почему streaming и selective hydration работают только вместе:
            HTML может прийти раньше, но важный island всё равно должен ожить в нужном
            порядке.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Профиль экрана</span>
            <select
              value={profileId}
              onChange={(event) => setProfileId(event.target.value as StreamingProfileId)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            >
              {streamingProfiles.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-sm leading-6 text-slate-500">{profile.note}</p>
          </label>

          <div className="grid gap-4">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Сеть: {networkMs}ms
              </span>
              <input
                type="range"
                min="40"
                max="300"
                step="10"
                value={networkMs}
                onChange={(event) => setNetworkMs(Number(event.target.value))}
                className="w-full"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                JS boot: {jsBootMs}ms
              </span>
              <input
                type="range"
                min="80"
                max="500"
                step="10"
                value={jsBootMs}
                onChange={(event) => setJsBootMs(Number(event.target.value))}
                className="w-full"
              />
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700">
            Какая секция получает пользовательское намерение первой
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedSegment('none')}
              className={`chip ${selectedSegment === 'none' ? 'chip-active' : ''}`}
            >
              Без приоритета
            </button>
            {profile.segments.map((segment) => (
              <button
                key={segment.id}
                type="button"
                onClick={() => setSelectedSegment(segment.id)}
                className={`chip ${selectedSegment === segment.id ? 'chip-active' : ''}`}
              >
                {segment.label}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Shell visible"
          value={`${simulation.shellVisibleMs}ms`}
          hint="Когда пользователь видит первую пригодную структуру страницы."
          tone="cool"
        />
        <MetricCard
          label="Выигрыш selective hydration"
          value={`${simulation.selectedBenefitMs}ms`}
          hint="Насколько быстрее оживает выбранная секция по сравнению с обычным порядком."
          tone={simulation.selectedBenefitMs > 0 ? 'accent' : 'default'}
        />
        <MetricCard
          label="Порядок"
          value={simulation.selectiveOrder.join(' -> ')}
          hint="Очередь гидрации после учёта пользовательского намерения."
          tone="dark"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-slate-900">Boundary timings</h3>
            {simulation.selectedBenefitMs > 0 ? (
              <StatusPill tone="success">Selective hydration помогает</StatusPill>
            ) : (
              <StatusPill tone="warn">Порядок не меняется</StatusPill>
            )}
          </div>

          <div className="space-y-3">
            {simulation.rows.map((row) => (
              <div
                key={row.id}
                data-testid={`segment-row-${row.id}`}
                className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-800">{row.label}</p>
                  {selectedSegment === row.id ? (
                    <StatusPill tone="success">User intent</StatusPill>
                  ) : null}
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <MetricCard
                    label="Server chunk"
                    value={`${row.streamedAtMs}ms`}
                    hint="Когда boundary доехала с сервера."
                  />
                  <MetricCard
                    label="Default hydrate"
                    value={`${row.defaultHydratedAtMs}ms`}
                    hint="Обычный порядок оживления."
                    tone="accent"
                  />
                  <MetricCard
                    label="Selective hydrate"
                    value={`${row.selectiveHydratedAtMs}ms`}
                    hint="Порядок с учётом раннего interaction."
                    tone="cool"
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <ListBlock
            title="Лента событий"
            items={simulation.timeline.map(
              (item) => `${item.atMs}ms · ${item.phase} · ${item.label}`,
            )}
          />
        </Panel>
      </div>
    </div>
  );
}
