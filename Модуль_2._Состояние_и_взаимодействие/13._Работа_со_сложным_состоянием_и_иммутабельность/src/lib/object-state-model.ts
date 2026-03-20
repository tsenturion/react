import type { LessonSettings } from './complex-state-domain';
import type { StatusTone } from './learning-model';

export type ObjectStateReport = {
  tone: StatusTone;
  stateLabel: string;
  summary: string;
  mutationWarning: string;
  snippet: string;
};

function nextTheme(theme: LessonSettings['theme']) {
  return theme === 'light' ? 'dark' : 'light';
}

export function toggleThemeImmutable(settings: LessonSettings): LessonSettings {
  return {
    ...settings,
    theme: nextTheme(settings.theme),
  };
}

export function toggleNotificationsImmutable(settings: LessonSettings): LessonSettings {
  return {
    ...settings,
    notifications: !settings.notifications,
  };
}

export function cycleDensityImmutable(settings: LessonSettings): LessonSettings {
  return {
    ...settings,
    density: settings.density === 'comfortable' ? 'compact' : 'comfortable',
  };
}

export function toggleThemeMutably(settings: LessonSettings): LessonSettings {
  settings.theme = nextTheme(settings.theme);
  return settings;
}

export function buildObjectStateReport(settings: LessonSettings): ObjectStateReport {
  const stateLabel = `${settings.theme} / ${
    settings.notifications ? 'notify on' : 'notify off'
  } / ${settings.density}`;

  return {
    tone: settings.theme === 'dark' ? 'warn' : 'success',
    stateLabel,
    summary:
      'Объект в state нужно заменять новой ссылкой. Тогда React видит новый reference и строит следующий UI из нового значения.',
    mutationWarning:
      'Если изменить поле прямо в существующем объекте и вернуть ту же ссылку, React может пропустить обновление. Позже это проявится как “внезапный” скачок интерфейса на чужом ререндере.',
    snippet: [
      'setSettings((current) => ({',
      '  ...current,',
      "  theme: current.theme === 'light' ? 'dark' : 'light',",
      '}));',
    ].join('\n'),
  };
}
