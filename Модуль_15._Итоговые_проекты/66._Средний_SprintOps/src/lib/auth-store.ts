import { useSyncExternalStore } from 'react';

import type { Session } from './types';

interface AuthSnapshot {
  session: Session | null;
}

const STORAGE_KEY = 'sprintops.session';
const listeners = new Set<() => void>();

function readSessionFromStorage(): Session | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

let snapshot: AuthSnapshot = {
  session: readSessionFromStorage(),
};

function emit() {
  if (typeof window !== 'undefined') {
    if (snapshot.session) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot.session));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  listeners.forEach((listener) => listener());
}

export const authStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return snapshot;
  },
  login(session: Session) {
    snapshot = { session };
    emit();
  },
  logout() {
    snapshot = { session: null };
    emit();
  },
  reset() {
    snapshot = { session: null };
    emit();
  },
};

export function getCurrentSession() {
  return authStore.getSnapshot().session;
}

export function useSession() {
  return useSyncExternalStore(
    authStore.subscribe,
    () => authStore.getSnapshot().session,
    () => authStore.getSnapshot().session,
  );
}
