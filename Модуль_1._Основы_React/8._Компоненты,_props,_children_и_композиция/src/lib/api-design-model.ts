export type BooleanSoupState = {
  isInfo: boolean;
  isSuccess: boolean;
  isWarning: boolean;
  isDanger: boolean;
  dense: boolean;
  centered: boolean;
  withBorder: boolean;
};

export type CleanApiState = {
  tone: 'info' | 'success' | 'warning' | 'danger';
  density: 'comfortable' | 'compact';
  align: 'start' | 'center';
  border: 'soft' | 'strong';
};

export type ApiComparison = {
  badWarnings: string[];
  resolvedTone: CleanApiState['tone'];
  badSnippet: string;
  goodSnippet: string;
};

export const defaultBooleanSoupState: BooleanSoupState = {
  isInfo: true,
  isSuccess: false,
  isWarning: false,
  isDanger: false,
  dense: false,
  centered: false,
  withBorder: true,
};

export const defaultCleanApiState: CleanApiState = {
  tone: 'info',
  density: 'comfortable',
  align: 'start',
  border: 'soft',
};

export function buildApiComparison(
  badState: BooleanSoupState,
  goodState: CleanApiState,
): ApiComparison {
  const tones = [
    badState.isInfo ? 'info' : null,
    badState.isSuccess ? 'success' : null,
    badState.isWarning ? 'warning' : null,
    badState.isDanger ? 'danger' : null,
  ].filter((item): item is CleanApiState['tone'] => item !== null);

  const resolvedTone = tones[0] ?? 'info';
  const badWarnings = [
    tones.length > 1
      ? 'Несколько tone-флагов true одновременно. Компонент вынужден гадать, что важнее.'
      : null,
    !badState.isInfo && !badState.isSuccess && !badState.isWarning && !badState.isDanger
      ? 'Не выбран ни один tone-флаг. Компонент получает неявное поведение по умолчанию.'
      : null,
    badState.centered && badState.dense
      ? 'Одновременно dense и centered затрудняют чтение API: непонятно, что является смысловым вариантом, а что только layout-настройкой.'
      : null,
  ].filter((item): item is string => item !== null);

  return {
    badWarnings,
    resolvedTone,
    badSnippet: [
      '<BooleanSoupCallout',
      `  isInfo={${String(badState.isInfo)}}`,
      `  isSuccess={${String(badState.isSuccess)}}`,
      `  isWarning={${String(badState.isWarning)}}`,
      `  isDanger={${String(badState.isDanger)}}`,
      `  dense={${String(badState.dense)}}`,
      `  centered={${String(badState.centered)}}`,
      `  withBorder={${String(badState.withBorder)}}`,
      '/>',
    ].join('\n'),
    goodSnippet: [
      '<Callout',
      `  tone="${goodState.tone}"`,
      `  density="${goodState.density}"`,
      `  align="${goodState.align}"`,
      `  border="${goodState.border}"`,
      '>',
      '  Прозрачный API вместо набора конфликтующих флагов.',
      '</Callout>',
    ].join('\n'),
  };
}
