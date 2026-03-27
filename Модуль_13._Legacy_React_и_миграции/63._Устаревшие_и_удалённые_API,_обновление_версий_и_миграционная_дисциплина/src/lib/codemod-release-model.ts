import type { StatusTone } from './learning-model';

export type ReleaseChannel = 'latest' | 'canary' | 'experimental';

export type CodebasePatternId =
  | 'removed-dom-helpers'
  | 'forward-ref-heavy'
  | 'custom-mount-harness'
  | 'forms-pipeline'
  | 'third-party-adapters';

export const releaseChannelCards: readonly {
  id: ReleaseChannel;
  title: string;
  note: string;
  tone: StatusTone;
}[] = [
  {
    id: 'latest',
    title: 'Latest',
    note: 'Основной production channel для стабильного обновления и поддержки.',
    tone: 'success',
  },
  {
    id: 'canary',
    title: 'Canary',
    note: 'Ранняя проверка будущих API и миграционных поверхностей до стабильного релиза.',
    tone: 'warn',
  },
  {
    id: 'experimental',
    title: 'Experimental',
    note: 'Исследовательский режим, не предназначенный для production rollout.',
    tone: 'error',
  },
] as const;

export const codemodCatalog: readonly {
  id: CodebasePatternId;
  title: string;
  codemod: string;
  why: string;
}[] = [
  {
    id: 'removed-dom-helpers',
    title: 'Старые DOM root helpers',
    codemod: 'react/19/replace-reactdom-render-root-apis',
    why: 'Помогает быстро убрать render/hydrate/unmountComponentAtNode на уровне синтаксиса.',
  },
  {
    id: 'forward-ref-heavy',
    title: 'Слой с большим количеством forwardRef',
    codemod: 'manual ref audit before any ref-as-prop rollout',
    why: 'Здесь codemod сам по себе редко достаточен: нужен ручной анализ wrapper contracts.',
  },
  {
    id: 'custom-mount-harness',
    title: 'Кастомные mount/unmount harnesses',
    codemod: 'entrypoint helper audit',
    why: 'Синтаксис часто прячется не в app root, а в support code и internal testing helpers.',
  },
  {
    id: 'forms-pipeline',
    title: 'Старый submit pipeline',
    codemod: 'forms regression checklist',
    why: 'Forms чаще ломаются не от прямого API rename, а от косвенных runtime assumptions.',
  },
  {
    id: 'third-party-adapters',
    title: 'Adapters и зависимости',
    codemod: 'dependency compatibility inventory',
    why: 'Если removed API живёт в dependency, локальный codemod не решит проблему целиком.',
  },
] as const;

export function recommendReleaseStrategy(
  channel: ReleaseChannel,
  selectedPatterns: readonly CodebasePatternId[],
): {
  tone: StatusTone;
  title: string;
  why: string;
  steps: string[];
  codemods: string[];
} {
  const selectedCodemods = codemodCatalog
    .filter((item) => selectedPatterns.includes(item.id))
    .map((item) => `${item.title}: ${item.codemod}`);

  if (channel === 'experimental') {
    return {
      tone: 'error',
      title: 'Experimental не подходит для production migration',
      why: 'Этот канал полезен только для исследовательских лабораторий, а не для подтверждения готовности основного приложения.',
      steps: [
        'Оставьте experimental только в изолированных sandboxes.',
        'Перенесите production migration plan в Latest или в Canary preview.',
      ],
      codemods: selectedCodemods,
    };
  }

  if (channel === 'canary') {
    return {
      tone: 'warn',
      title: 'Canary подходит для ранней валидации migration surface',
      why: 'Это хороший режим, когда нужно проверить новые изменения заранее, но ещё не делать полноценный production rollout.',
      steps: [
        'Используйте canary в отдельной ветке или isolated integration environment.',
        'Фиксируйте найденные issues как hypotheses перед stable upgrade.',
        'Не смешивайте canary exploration и основной production rollout в одном dependency graph.',
      ],
      codemods: selectedCodemods,
    };
  }

  return {
    tone: 'success',
    title: 'Latest — основной канал для реального обновления приложения',
    why: 'После аудита и проверки рисков именно Latest должен быть финальной точкой production migration.',
    steps: [
      'Пройдите inventory в 18.3 или отдельной audit-ветке.',
      'Примените codemods к явным call sites.',
      'Подтвердите change через test suite и staged rollout.',
    ],
    codemods: selectedCodemods,
  };
}
