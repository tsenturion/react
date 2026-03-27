export type OverviewFocus = 'all' | 'dom' | 'upgrade' | 'channels' | 'tests' | 'workflow';

export type MigrationOverviewCard = {
  id: string;
  focus: Exclude<OverviewFocus, 'all'>;
  title: string;
  blurb: string;
  whyItMatters: string;
  caution: string;
  modernAlternative: string;
};

const overviewCards: readonly MigrationOverviewCard[] = [
  {
    id: 'removed-dom-apis',
    focus: 'dom',
    title:
      'Удалённые DOM API ломают не только entrypoint, но и старые предположения вокруг mounting',
    blurb:
      'findDOMNode, render, hydrate и unmountComponentAtNode долго жили как “рабочая база”, но в React 19 этот слой уже нельзя считать безопасным.',
    whyItMatters:
      'Миграция упирается не только в новое имя функции, а в переоценку того, как root создаётся, гидратируется и размонтируется.',
    caution:
      'Если заменить только вызов API и не проверить side effects, refs и cleanup paths, регрессии останутся в supporting code.',
    modernAlternative:
      'createRoot, hydrateRoot, явный root lifecycle и audit всего кода, завязанного на старый mount/unmount mental model.',
  },
  {
    id: '18-3-bridge',
    focus: 'upgrade',
    title:
      'React 18.3 полезен как предупреждающий мост перед 19, а не как финальная точка',
    blurb:
      '18.3 позволяет поймать deprecation signals заранее, чтобы обновление до 19 не превращалось в blind jump.',
    whyItMatters:
      'Это особенно полезно в больших кодовых базах, где removed API могут прятаться в adapters, тестовых harnesses и сторонних пакетах.',
    caution:
      'Если относиться к 18.3 как к формальному minor upgrade и не собрать warnings, ценность bridge release пропадает.',
    modernAlternative:
      'Использовать 18.3 как режим инвентаризации: warnings, audit call sites, фиксация assumptions и обновление test suite.',
  },
  {
    id: 'codemods',
    focus: 'channels',
    title: 'Codemods ускоряют миграцию, но не понимают архитектурный смысл изменений',
    blurb:
      'Автоматическая замена вызовов полезна, но не может сама решить, какой код теперь должен жить в root bootstrap, forms или refs layer.',
    whyItMatters:
      'Codemod хорошо обрабатывает синтаксис, но плохо понимает implicit contracts и runtime assumptions.',
    caution:
      'Если migration plan заканчивается на “запустили codemod”, то реальные риски просто переносятся дальше по дереву.',
    modernAlternative:
      'Codemod как старт, затем ручной audit мест, где старый API был связан с жизненным циклом, тестами или интеграциями.',
  },
  {
    id: 'release-channels',
    focus: 'channels',
    title:
      'Latest, Canary и Experimental нужны для разных задач, а не как иерархия “свежее = лучше”',
    blurb:
      'Канал релиза должен соответствовать задаче: стабильный rollout, проверка будущих API или исследование экспериментальных возможностей.',
    whyItMatters:
      'Ошибочный выбор канала создаёт лишний шум: прод-система получает нестабильный риск, а лабораторный проект лишается ранней обратной связи.',
    caution:
      'Смешивание production upgrade и исследовательских зависимостей в одном rollout делает отладку почти бессмысленной.',
    modernAlternative:
      'Latest для основного приложения, Canary для ранней проверки будущих возможностей, Experimental только для isolated exploration.',
  },
  {
    id: 'tests',
    focus: 'tests',
    title: 'Test suite в миграции важнее, чем список API replacements',
    blurb:
      'Именно тесты проверяют, не сломались ли предположения о рендеринге, effects, refs, формах и supporting code вокруг обновления.',
    whyItMatters: 'Миграция меняет поведение системы, а не только сигнатуры функций.',
    caution:
      'Если тесты привязаны к implementation details или покрывают только happy path, они не поймают migration regressions.',
    modernAlternative:
      'Поведенческие tests по критическим сценариям, audit тонких мест и staged rollout с обратной связью от мониторинга.',
  },
  {
    id: 'workflow',
    focus: 'workflow',
    title:
      'Migration discipline — это sequence: inventory → codemod → assumptions audit → test proof → rollout',
    blurb:
      'Обновление версии React становится рабочим процессом, а не одноразовым коммитом.',
    whyItMatters:
      'Так уменьшается вероятность того, что один fixed warning породит несколько скрытых runtime regressions.',
    caution:
      'Если шаги перепутаны, команда получает ложное ощущение завершённой миграции.',
    modernAlternative:
      'Планировать обновление как change program: инвентаризация, приоритизация, фиксация рисков, тестовые барьеры и staged delivery.',
  },
] as const;

export const migrationComparisonRows = [
  {
    legacy: '“Заменили deprecated API — миграция завершена”',
    modern:
      '“Проверили, какие assumptions вокруг render/effects/refs/forms больше невалидны”',
    note: 'Миграция — это проверка поведения, а не только compile success.',
  },
  {
    legacy: 'Codemod как полное решение',
    modern: 'Codemod как старт + ручной audit опасных поверхностей',
    note: 'Синтаксис меняется автоматически, архитектурная причина — нет.',
  },
  {
    legacy: 'Release channel выбирается по новизне',
    modern: 'Release channel выбирается по цели: stable rollout, preview, research',
    note: 'Latest, Canary и Experimental закрывают разные типы задач.',
  },
  {
    legacy: 'Tests проверяют только старый contract',
    modern: 'Tests становятся guardrail для нового rendering/runtime contract',
    note: 'Нужны проверки именно на migration-sensitive areas.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  switch (value) {
    case 'dom':
    case 'upgrade':
    case 'channels':
    case 'tests':
    case 'workflow':
      return value;
    default:
      return 'all';
  }
}

export function filterOverviewCardsByFocus(
  focus: OverviewFocus,
): readonly MigrationOverviewCard[] {
  if (focus === 'all') {
    return overviewCards;
  }

  return overviewCards.filter((card) => card.focus === focus);
}
