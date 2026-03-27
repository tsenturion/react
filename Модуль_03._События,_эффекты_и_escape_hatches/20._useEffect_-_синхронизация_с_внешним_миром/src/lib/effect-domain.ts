export type EffectScenario =
  | 'derived-value'
  | 'document-title'
  | 'timer'
  | 'subscription'
  | 'fetch'
  | 'form-reset';

export type DependencyStrategy = 'complete' | 'missing-room';
export type TimerMode = 'cleanup' | 'leak';
export type SubscriptionMode = 'cleanup' | 'no-cleanup';
export type RequestMode = 'cancel-stale' | 'allow-stale';
export type EffectPitfallMode = 'derived-in-effect' | 'unstable-dependency' | 'loop-risk';

export type EffectRoom = {
  id: string;
  title: string;
  area: 'browser' | 'network' | 'integration';
};

export type PresencePacket = {
  sequence: number;
  roomId: string;
  message: string;
};

export type EffectArticle = {
  id: string;
  title: string;
  kind: 'synchronization' | 'cleanup' | 'dependencies' | 'pitfall';
  summary: string;
};

export const effectScenarios = [
  {
    id: 'derived-value',
    title: 'Собрать значение из уже имеющихся props/state',
  },
  {
    id: 'document-title',
    title: 'Синхронизировать заголовок документа с текущим экраном',
  },
  {
    id: 'timer',
    title: 'Подключить таймер или interval',
  },
  {
    id: 'subscription',
    title: 'Подписаться на внешний источник сообщений',
  },
  {
    id: 'fetch',
    title: 'Загрузить данные по запросу пользователя',
  },
  {
    id: 'form-reset',
    title: 'Пересчитать значение, которое можно получить прямо в render',
  },
] as const satisfies readonly { id: EffectScenario; title: string }[];

export const effectRooms = [
  { id: 'dom', title: 'DOM bridge', area: 'browser' },
  { id: 'network', title: 'Network sync', area: 'network' },
  { id: 'analytics', title: 'Analytics integration', area: 'integration' },
] as const satisfies readonly EffectRoom[];

type PresenceListener = (packet: PresencePacket) => void;

export function createPresenceHub(rooms: readonly EffectRoom[] = effectRooms) {
  const listeners = new Map<string, Set<PresenceListener>>();
  let sequence = 0;

  rooms.forEach((room) => {
    listeners.set(room.id, new Set());
  });

  return {
    subscribe(roomId: string, listener: PresenceListener) {
      const bucket = listeners.get(roomId);
      if (!bucket) {
        throw new Error(`Unknown room "${roomId}"`);
      }

      bucket.add(listener);

      return () => {
        bucket.delete(listener);
      };
    },

    emit(roomId: string, message: string) {
      const bucket = listeners.get(roomId);
      if (!bucket) {
        throw new Error(`Unknown room "${roomId}"`);
      }

      sequence += 1;
      const packet = {
        sequence,
        roomId,
        message,
      } satisfies PresencePacket;

      bucket.forEach((listener) => listener(packet));
      return packet;
    },

    snapshot() {
      return Object.fromEntries(
        [...listeners.entries()].map(([roomId, bucket]) => [roomId, bucket.size]),
      ) as Record<string, number>;
    },
  };
}
