export type TrackKind = 'input' | 'render' | 'commit' | 'network' | 'paint';

export type TrackSample = {
  id: string;
  label: string;
  kind: TrackKind;
  startMs: number;
  durationMs: number;
};

export function summarizeTrackSamples(samples: readonly TrackSample[]) {
  if (samples.length === 0) {
    return {
      totalDuration: 0,
      longestTrack: null,
      dominantKind: 'render',
      guidance:
        'Сначала запишите interaction trace, иначе browser Performance panel покажет слишком мало сигнала.',
    } as const;
  }

  const totalDuration = samples.reduce((sum, item) => sum + item.durationMs, 0);
  const longestTrack = samples.reduce((max, item) =>
    item.durationMs > max.durationMs ? item : max,
  );

  const totalsByKind = samples.reduce<Record<TrackKind, number>>(
    (acc, item) => {
      acc[item.kind] += item.durationMs;
      return acc;
    },
    {
      input: 0,
      render: 0,
      commit: 0,
      network: 0,
      paint: 0,
    },
  );

  const dominantKind = (Object.entries(totalsByKind) as [TrackKind, number][]).sort(
    (left, right) => right[1] - left[1],
  )[0][0];

  const guidance =
    dominantKind === 'network'
      ? 'Основной бюджет уходит в сеть: React Profiler здесь вторичен, сначала разбирайте waterfalls и retries.'
      : dominantKind === 'paint'
        ? 'Дерево React может быть нормальным, а лаг сидит в layout/paint. Нужен browser trace, а не только Profiler.'
        : 'Главный сигнал сидит внутри render/commit path: React Profiler и component tree дадут больше пользы.';

  return {
    totalDuration,
    longestTrack,
    dominantKind,
    guidance,
  } as const;
}
