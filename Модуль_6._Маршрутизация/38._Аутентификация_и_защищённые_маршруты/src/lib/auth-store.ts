import { authPersonas, type AuthPersona, type AuthSession } from './auth-domain';

type RefreshMode = 'success' | 'fail-next';

export type AuthSnapshot = {
  session: AuthSession | null;
  intendedPath: string | null;
  auditTrail: readonly string[];
  nextRefreshMode: RefreshMode;
};

type RefreshResult =
  | { ok: true; session: AuthSession }
  | { ok: false; reason: 'no-session' | 'refresh-failed' };

const listeners = new Set<() => void>();
let tokenCounter = 0;

let snapshot: AuthSnapshot = {
  session: null,
  intendedPath: null,
  auditTrail: [
    'Стартовое состояние: сессии нет, все protected routes должны вести на login.',
  ],
  nextRefreshMode: 'success',
};

function emitChange() {
  listeners.forEach((listener) => listener());
}

function appendAudit(message: string) {
  snapshot = {
    ...snapshot,
    auditTrail: [`${stamp()} — ${message}`, ...snapshot.auditTrail].slice(0, 8),
  };
}

function stamp() {
  return new Date().toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function requirePersona(personaId: string) {
  const persona = authPersonas.find((item) => item.id === personaId);

  if (!persona) {
    throw new Error(`Unknown auth persona: ${personaId}`);
  }

  return persona;
}

function buildSession(persona: AuthPersona, source: AuthSession['source']): AuthSession {
  const now = Date.now();

  return {
    userId: persona.id,
    displayName: persona.displayName,
    role: persona.role,
    accessToken: `atk-${persona.role}-${++tokenCounter}`,
    refreshToken: `rtk-${persona.id}`,
    issuedAt: now,
    expiresAt: now + 1000 * 60 * 5,
    lastRefreshAt: source === 'refresh' ? now : 0,
    source,
  };
}

export const authSessionStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => listeners.delete(listener);
  },

  getSnapshot() {
    return snapshot;
  },

  setIntent(path: string) {
    if (!path || snapshot.intendedPath === path) {
      return;
    }

    snapshot = {
      ...snapshot,
      intendedPath: path,
    };
    appendAudit(`Сохранено намерение перейти на ${path}.`);
    emitChange();
  },

  clearIntent() {
    if (!snapshot.intendedPath) {
      return;
    }

    snapshot = {
      ...snapshot,
      intendedPath: null,
    };
    appendAudit('Intent path очищен после успешного входа или явного reset.');
    emitChange();
  },

  loginAsPersona(personaId: string) {
    const persona = requirePersona(personaId);
    const session = buildSession(persona, 'login');

    snapshot = {
      ...snapshot,
      session,
      nextRefreshMode: 'success',
    };
    appendAudit(`Вход как ${persona.displayName} (${persona.role}).`);
    emitChange();

    return session;
  },

  logout(reason: string) {
    snapshot = {
      ...snapshot,
      session: null,
      nextRefreshMode: 'success',
    };
    appendAudit(`Выход из системы: ${reason}.`);
    emitChange();
  },

  expireSession() {
    if (!snapshot.session) {
      appendAudit('Попытка просрочить сессию пропущена: активной сессии нет.');
      emitChange();
      return null;
    }

    snapshot = {
      ...snapshot,
      session: {
        ...snapshot.session,
        expiresAt: Date.now() - 1000,
      },
    };
    appendAudit(
      'Токен искусственно просрочен для демонстрации refresh и redirect logic.',
    );
    emitChange();

    return snapshot.session;
  },

  armRefreshFailure() {
    snapshot = {
      ...snapshot,
      nextRefreshMode: 'fail-next',
    };
    appendAudit('Следующая refresh попытка принудительно завершится неудачей.');
    emitChange();
  },

  refreshSession(source: string): RefreshResult {
    if (!snapshot.session) {
      appendAudit(`Refresh из ${source} пропущен: активной сессии нет.`);
      emitChange();

      return {
        ok: false,
        reason: 'no-session',
      };
    }

    if (snapshot.nextRefreshMode === 'fail-next') {
      snapshot = {
        ...snapshot,
        session: null,
        nextRefreshMode: 'success',
      };
      appendAudit(`Refresh из ${source} не удался, сессия очищена.`);
      emitChange();

      return {
        ok: false,
        reason: 'refresh-failed',
      };
    }

    const persona = requirePersona(snapshot.session.userId);
    const session = buildSession(persona, 'refresh');

    snapshot = {
      ...snapshot,
      session,
      nextRefreshMode: 'success',
    };
    appendAudit(`Refresh из ${source} успешно продлил сессию.`);
    emitChange();

    return {
      ok: true,
      session,
    };
  },
};
