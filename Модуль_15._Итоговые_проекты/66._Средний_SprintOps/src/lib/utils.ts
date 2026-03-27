export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function formatRelativeTime(value: string) {
  const deltaMs = Date.now() - new Date(value).getTime();
  const deltaMinutes = Math.round(deltaMs / (60 * 1000));

  if (deltaMinutes < 1) {
    return 'только что';
  }

  if (deltaMinutes < 60) {
    return `${deltaMinutes} мин назад`;
  }

  const deltaHours = Math.round(deltaMinutes / 60);
  if (deltaHours < 24) {
    return `${deltaHours} ч назад`;
  }

  const deltaDays = Math.round(deltaHours / 24);
  return `${deltaDays} дн назад`;
}

export function sanitizeRedirectPath(value: string | null) {
  if (!value) {
    return '/app/dashboard';
  }

  try {
    const decoded = decodeURIComponent(value);
    if (decoded.startsWith('/app')) {
      return decoded;
    }
  } catch {
    return '/app/dashboard';
  }

  return '/app/dashboard';
}
