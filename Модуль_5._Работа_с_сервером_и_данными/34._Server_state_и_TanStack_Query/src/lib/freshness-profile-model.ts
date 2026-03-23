import type { FreshnessProfileId } from './server-state-domain';

export function getFreshnessProfile(profile: FreshnessProfileId) {
  if (profile === 'aggressive') {
    return {
      id: profile,
      label: 'Aggressive freshness',
      staleTimeMs: 0,
      retryCount: 0,
      hint: 'Данные сразу считаются stale. Вы чаще рефетчите, но и чаще платите сетью.',
    };
  }

  if (profile === 'balanced') {
    return {
      id: profile,
      label: 'Balanced default',
      staleTimeMs: 5_000,
      retryCount: 1,
      hint: 'Хороший дефолт для экранов, где важны и адекватная свежесть, и умеренная стоимость запросов.',
    };
  }

  return {
    id: profile,
    label: 'Resilient cache',
    staleTimeMs: 20_000,
    retryCount: 2,
    hint: 'Подходит, когда одинаковый запрос часто переиспользуется и выдерживает небольшую устарелость.',
  };
}
