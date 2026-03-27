import type { EffectEventMode, ThemeMode } from './advanced-effect-domain';
import type { StatusTone } from './learning-model';

type EffectEventReport = {
  title: string;
  tone: StatusTone;
  summary: string;
  snippet: string;
};

const reports: Record<EffectEventMode, EffectEventReport> = {
  'stale-theme': {
    title: 'Старое значение из closure',
    tone: 'warn',
    summary:
      'Подключение не пересоздаётся, но внешний callback продолжает читать theme из того render, где effect был создан.',
    snippet: [
      'useEffect(() => {',
      '  const connection = connectRoom(roomId, () => {',
      '    showToast(theme);',
      '  });',
      '  return () => connection.disconnect();',
      '}, [roomId]);',
    ].join('\n'),
  },
  'theme-dependency': {
    title: 'Theme в dependencies',
    tone: 'error',
    summary:
      'Theme становится частью внешней синхронизации, и каждый её change приводит к лишнему disconnect/connect.',
    snippet: [
      'useEffect(() => {',
      '  const connection = connectRoom(roomId, () => showToast(theme));',
      '  return () => connection.disconnect();',
      '}, [roomId, theme]);',
    ].join('\n'),
  },
  'effect-event': {
    title: 'useEffectEvent читает актуальную тему',
    tone: 'success',
    summary:
      'Effect синхронизируется только по roomId, а не-reactive callback получает свежую theme без лишнего reconnect.',
    snippet: [
      'const onConnected = useEffectEvent(() => {',
      '  showToast(theme);',
      '});',
      '',
      'useEffect(() => {',
      '  const connection = connectRoom(roomId, onConnected);',
      '  return () => connection.disconnect();',
      '}, [roomId]);',
    ].join('\n'),
  },
};

export function buildEffectEventReport(mode: EffectEventMode) {
  return reports[mode];
}

export function getReconnectCount(mode: EffectEventMode, themeChanges: number) {
  if (mode === 'theme-dependency') {
    return 1 + themeChanges;
  }

  return 1;
}

export function getNotificationTheme(
  mode: EffectEventMode,
  initialTheme: ThemeMode,
  latestTheme: ThemeMode,
) {
  if (mode === 'stale-theme') {
    return initialTheme;
  }

  return latestTheme;
}
