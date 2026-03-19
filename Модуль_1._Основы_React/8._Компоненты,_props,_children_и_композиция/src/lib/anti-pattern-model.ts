import type { StatusTone } from './learning-model';

export type MirrorReport = {
  tone: StatusTone;
  title: string;
  note: string;
};

export type MutationReport = {
  tone: StatusTone;
  title: string;
  note: string;
};

export function buildMirrorReport(
  parentTitle: string,
  badLocalTitle: string,
): MirrorReport {
  if (parentTitle === badLocalTitle) {
    return {
      tone: 'success',
      title: 'Зеркало пока синхронно',
      note: 'Пока parent title и локальная копия совпадают, проблема не видна, но она уже заложена в архитектуру.',
    };
  }

  return {
    tone: 'warn',
    title: 'Локальная копия оторвалась от props',
    note: 'Компонент один раз скопировал значение из props в state и теперь живёт по собственной версии данных.',
  };
}

export function buildMutationReport(
  initialLength: number,
  currentLength: number,
): MutationReport {
  if (currentLength === initialLength) {
    return {
      tone: 'success',
      title: 'Исходный массив не мутирован',
      note: 'Родительские данные не менялись вне `setState`, состояние остаётся предсказуемым.',
    };
  }

  return {
    tone: 'error',
    title: 'Props/state мутированы напрямую',
    note: 'Данные изменились без нормального обновления состояния. Другие компоненты увидят сюрприз при следующем рендере.',
  };
}
