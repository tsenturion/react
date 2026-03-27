import { useEffect, useState } from 'react';

import type { ServerItem } from '../lib/state-domain';
import type { ServerSnapshot } from '../lib/server-state-model';

type Listener = () => void;

const initialSnapshot: ServerSnapshot = {
  status: 'idle',
  items: [],
  error: null,
  requestCount: 0,
  lastUpdated: null,
};

let snapshot: ServerSnapshot = initialSnapshot;
const listeners = new Set<Listener>();
let inFlightRequest: Promise<void> | null = null;

function emit() {
  listeners.forEach((listener) => listener());
}

function patchSnapshot(partial: Partial<ServerSnapshot>) {
  snapshot = {
    ...snapshot,
    ...partial,
  };
  emit();
}

async function loadPlaybook() {
  patchSnapshot({
    status: 'loading',
    error: null,
    requestCount: snapshot.requestCount + 1,
  });

  try {
    const response = await fetch('/data/state-architecture-playbook.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const items = (await response.json()) as ServerItem[];
    patchSnapshot({
      status: 'success',
      items,
      error: null,
      lastUpdated: Date.now(),
    });
  } catch (error) {
    patchSnapshot({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    inFlightRequest = null;
  }
}

function ensureLoaded() {
  if (snapshot.status === 'success' || snapshot.status === 'loading') {
    return;
  }

  if (!inFlightRequest) {
    inFlightRequest = loadPlaybook();
  }
}

function refetchPlaybook() {
  if (!inFlightRequest) {
    inFlightRequest = loadPlaybook();
  }
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useServerPlaybookQuery() {
  const [currentSnapshot, setCurrentSnapshot] = useState(snapshot);

  useEffect(() => {
    // Server state живёт на уровне модуля, а не внутри одной панели.
    // Поэтому отдельные компоненты только подписываются на уже существующий cache layer.
    ensureLoaded();
    return subscribe(() => {
      setCurrentSnapshot(snapshot);
    });
  }, []);

  return {
    snapshot: currentSnapshot,
    refetch: refetchPlaybook,
  };
}
