export type QueueProfile = 'stable' | 'flaky' | 'empty';

export type ReleaseQueueItem = {
  id: string;
  title: string;
  owner: string;
  status: 'queued' | 'ready' | 'blocked';
};

const stableQueue: readonly ReleaseQueueItem[] = [
  {
    id: 'rq-101',
    title: 'Release summary for checkout flow',
    owner: 'qa-core',
    status: 'queued',
  },
  {
    id: 'rq-102',
    title: 'Auth redirect regression pack',
    owner: 'security-squad',
    status: 'ready',
  },
  {
    id: 'rq-103',
    title: 'Catalog smoke after route split',
    owner: 'growth-ui',
    status: 'blocked',
  },
];

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function loadReleaseQueue(profile: QueueProfile, attempt: number) {
  await delay(420);

  if (profile === 'flaky' && attempt === 1) {
    throw new Error('Транспортный слой не подтвердил очередь с первой попытки.');
  }

  if (profile === 'empty') {
    return [];
  }

  return [...stableQueue];
}
