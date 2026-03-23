export type ResetReason = 'manual' | 'reset-keys' | 'remount';

export function haveResetKeysChanged(
  previous: readonly unknown[] = [],
  next: readonly unknown[] = [],
) {
  if (previous.length !== next.length) {
    return true;
  }

  for (let index = 0; index < previous.length; index += 1) {
    if (!Object.is(previous[index], next[index])) {
      return true;
    }
  }

  return false;
}

export function describeResetGuidance(reason: ResetReason, inputFixed: boolean) {
  if (reason === 'manual') {
    return inputFixed
      ? 'Повторный render сработает, потому что причина падения уже убрана.'
      : 'Обычный retry перерисует тот же самый сломанный subtree и ошибка повторится.';
  }

  if (reason === 'reset-keys') {
    return inputFixed
      ? 'Boundary сбросится автоматически, потому что вы изменили входные данные.'
      : 'Смена resetKeys помогает только тогда, когда новые данные действительно уводят компонент из аварийного состояния.';
  }

  return 'Remount через key выбрасывает старый subtree целиком и создаёт новый экземпляр с чистым внутренним состоянием.';
}
