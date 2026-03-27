import type { StatusTone } from './common';

export type RuntimeMode = 'development' | 'production';
export type ProbeKind = 'pure' | 'impure';

export type StrictModeSnapshot = {
  runtimeMode: RuntimeMode;
  strictEnabled: boolean;
  probeKind: ProbeKind;
  renderedItems: number;
  effectLogCount: number;
};

export function describeStrictModeScenario(snapshot: StrictModeSnapshot) {
  const tone: StatusTone =
    snapshot.probeKind === 'impure' &&
    snapshot.strictEnabled &&
    snapshot.runtimeMode === 'development'
      ? 'success'
      : 'warn';

  const expectedRenderPattern =
    snapshot.runtimeMode === 'development' && snapshot.strictEnabled
      ? 'В development StrictMode может повторно вызвать render/effect-путь, чтобы подсветить нечистую логику.'
      : 'В production дополнительного StrictMode-дублирования не будет.';

  const usefulBecause = [
    'StrictMode помогает раньше увидеть код, который мутирует данные прямо в render.',
    'Повторный проход и cleanup облегчают поиск эффектов, которые не умеют корректно очищаться.',
    'Это dev-only инструмент дисциплины, а не production-фича для пользовательского поведения.',
  ];

  const misconceptions = [
    'Нельзя строить бизнес-логику в расчёте на то, что effect всегда сработает дважды.',
    'Если компонент ведёт себя странно только в StrictMode, это повод проверить чистоту render и cleanup, а не выключать проверку вслепую.',
    'Одинаковый код может вести себя по-разному в development и production именно из-за dev-only checks.',
  ];

  return {
    tone,
    expectedRenderPattern,
    usefulBecause,
    misconceptions,
    effectInterpretation:
      snapshot.effectLogCount === 0
        ? 'Сначала перемонтируйте sandbox, чтобы увидеть mount/cleanup журнал.'
        : `В журнале уже ${snapshot.effectLogCount} записей mount/cleanup.`,
    renderedItemsLabel:
      snapshot.probeKind === 'pure'
        ? `Pure probe рендерит стабильный список из ${snapshot.renderedItems} элементов.`
        : `Impure probe уже вывел ${snapshot.renderedItems} элементов: это помогает заметить render-side effects.`,
    before:
      'Без StrictMode нечистый код может выглядеть «работающим», пока не столкнётся с повторным рендером, remount или более сложным сценарием.',
    after:
      'StrictMode в development делает такие проблемы заметнее раньше, когда их ещё легко локализовать.',
  };
}
