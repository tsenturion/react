import type { StatusTone } from './common';

export type QualityToolId =
  | 'typescript'
  | 'eslint'
  | 'prettier'
  | 'vitest'
  | 'strict-mode';

export interface QualityToolOption {
  id: QualityToolId;
  label: string;
  hint: string;
}

export const qualityToolOptions: QualityToolOption[] = [
  {
    id: 'typescript',
    label: 'TypeScript',
    hint: 'Ловит несовместимые типы до запуска браузера.',
  },
  {
    id: 'eslint',
    label: 'ESLint',
    hint: 'Делает видимыми проблемы imports, hooks и инженерной дисциплины.',
  },
  {
    id: 'prettier',
    label: 'Prettier',
    hint: 'Фиксирует единый стиль проекта и уменьшает шум в diff.',
  },
  {
    id: 'vitest',
    label: 'Vitest',
    hint: 'Проверяет поведение чистых функций и регрессии в логике.',
  },
  {
    id: 'strict-mode',
    label: 'StrictMode',
    hint: 'Помогает заметить нечистые render-паттерны в dev-режиме.',
  },
];

export type QualityIssueId =
  | 'type-mismatch'
  | 'unused-import'
  | 'format-drift'
  | 'logic-regression'
  | 'impure-render';

export interface QualityIssueOption {
  id: QualityIssueId;
  label: string;
  hint: string;
}

export const qualityIssueOptions: QualityIssueOption[] = [
  {
    id: 'type-mismatch',
    label: 'Типы расходятся с данными',
    hint: 'Например, функция ожидает число, а получает строку.',
  },
  {
    id: 'unused-import',
    label: 'Код и imports дрейфуют',
    hint: 'В файле висят неиспользуемые импорты и нарушается инженерная чистота.',
  },
  {
    id: 'format-drift',
    label: 'Стиль кода распадается',
    hint: 'Разные отступы, кавычки и переносы мешают читать diff и review.',
  },
  {
    id: 'logic-regression',
    label: 'Чистая функция сломалась',
    hint: 'Изменение модели дало неверный результат в одном из сценариев.',
  },
  {
    id: 'impure-render',
    label: 'Рендер содержит нечистую логику',
    hint: 'Например, в JSX или в теле компонента появляется нестабильный side effect.',
  },
];

export interface QualityStage {
  id: string;
  label: string;
  status: StatusTone;
  note: string;
}

export interface QualitySafetyAnalysis {
  overall: StatusTone;
  stages: QualityStage[];
  before: string;
  after: string;
  caughtBy: string[];
  blindSpots: string[];
  codeSample: string;
}

const qualityIssueSnippets: Record<QualityIssueId, string> = {
  'type-mismatch': [
    'interface BootStats {',
    '  commands: number;',
    '}',
    '',
    'const stats: BootStats = {',
    '  commands: "5",',
    '};',
  ].join('\n'),
  'unused-import': [
    "import { useState, useMemo } from 'react';",
    '',
    'export function Shell() {',
    '  const [active, setActive] = useState("boot");',
    '  return <button onClick={() => setActive("quality")}>{active}</button>;',
    '}',
  ].join('\n'),
  'format-drift': [
    'export function shell(){',
    'return<div className="panel"><span>React Project Anatomy</span></div>',
    '}',
  ].join('\n'),
  'logic-regression': [
    'export function scoreMode(value: number) {',
    '  return value > 2 ? "success" : "success";',
    '}',
  ].join('\n'),
  'impure-render': [
    'export function ClockPage() {',
    '  const renderedAt = Date.now();',
    '  return <p>rendered at {renderedAt}</p>;',
    '}',
  ].join('\n'),
};

export function analyzeQualitySafety(
  tools: QualityToolId[],
  issue: QualityIssueId,
): QualitySafetyAnalysis {
  const toolSet = new Set(tools);
  const caughtBy: string[] = [];
  const stages: QualityStage[] = [];

  const catchesType = issue === 'type-mismatch' && toolSet.has('typescript');
  const catchesLint = issue === 'unused-import' && toolSet.has('eslint');
  const catchesFormat = issue === 'format-drift' && toolSet.has('prettier');
  const catchesTest = issue === 'logic-regression' && toolSet.has('vitest');
  const catchesStrict = issue === 'impure-render' && toolSet.has('strict-mode');

  stages.push({
    id: 'format',
    label: '1. Форматирование и читаемость',
    status: catchesFormat ? 'success' : issue === 'format-drift' ? 'warn' : 'success',
    note: catchesFormat
      ? 'Prettier останавливает дрейф стиля до review.'
      : issue === 'format-drift'
        ? 'Без Prettier стиль начинает зависеть от привычек автора и IDE.'
        : 'Эта проблема не относится к слою форматирования.',
  });

  stages.push({
    id: 'lint',
    label: '2. Статический анализ',
    status: catchesLint ? 'success' : issue === 'unused-import' ? 'warn' : 'success',
    note: catchesLint
      ? 'ESLint ловит инженерную несогласованность до браузера.'
      : issue === 'unused-import'
        ? 'Без ESLint дрейф imports долго остаётся незамеченным.'
        : 'Эта ошибка не обязана проявляться на lint-слое.',
  });

  stages.push({
    id: 'types',
    label: '3. Типовая проверка',
    status: catchesType ? 'success' : issue === 'type-mismatch' ? 'error' : 'success',
    note: catchesType
      ? 'TypeScript прерывает цепочку раньше браузера.'
      : issue === 'type-mismatch'
        ? 'Если типовой слой выключен, ошибка может дожить до runtime и поломать данные.'
        : 'Это не типовая ошибка.',
  });

  stages.push({
    id: 'tests',
    label: '4. Тестовый слой',
    status: catchesTest ? 'success' : issue === 'logic-regression' ? 'warn' : 'success',
    note: catchesTest
      ? 'Vitest ловит регрессию на уровне чистой функции.'
      : issue === 'logic-regression'
        ? 'Без tests сломанная логика проявится только в интерфейсе или production-сценарии.'
        : 'Эта проблема не требует unit tests как основного барьера.',
  });

  stages.push({
    id: 'runtime',
    label: '5. Dev runtime',
    status: catchesStrict ? 'success' : issue === 'impure-render' ? 'warn' : 'success',
    note: catchesStrict
      ? 'StrictMode повышает шанс заметить нечистый render ещё в dev-цикле.'
      : issue === 'impure-render'
        ? 'Без StrictMode такой паттерн может долго жить как "случайное" поведение интерфейса.'
        : 'Для выбранной проблемы runtime-слой не является главным барьером.',
  });

  if (catchesFormat) {
    caughtBy.push('Prettier');
  }
  if (catchesLint) {
    caughtBy.push('ESLint');
  }
  if (catchesType) {
    caughtBy.push('TypeScript');
  }
  if (catchesTest) {
    caughtBy.push('Vitest');
  }
  if (catchesStrict) {
    caughtBy.push('StrictMode');
  }

  const blindSpots = [
    issue === 'format-drift'
      ? 'Форматтер не проверяет бизнес-логику и не заменяет lint/tests.'
      : 'Даже хороший формат не гарантирует правильное поведение программы.',
    issue === 'unused-import'
      ? 'Lint не заменяет типовую проверку и runtime-сценарии.'
      : 'Статический анализ не поймает всё без других quality-gates.',
    issue === 'type-mismatch'
      ? 'TypeScript не доказывает корректность бизнес-логики, только согласованность типов.'
      : 'Типы сами по себе не гарантируют отсутствие регрессий.',
    issue === 'logic-regression'
      ? 'Tests нужно писать осмысленно: пустой test script не помогает.'
      : 'Unit tests особенно сильны там, где есть чистые функции и явные ожидания.',
  ];

  const overall =
    caughtBy.length > 0
      ? issue === 'impure-render' && !catchesStrict
        ? 'warn'
        : 'success'
      : issue === 'format-drift'
        ? 'warn'
        : 'error';

  return {
    overall,
    stages,
    before:
      'До подключения quality-слоёв проект слишком часто узнаёт о проблеме поздно: в build, в браузере или уже после регрессии.',
    after:
      'После подключения quality-слоёв ошибка ловится на своём уровне: формат, lint, типы, тесты или dev runtime.',
    caughtBy:
      caughtBy.length > 0
        ? caughtBy
        : ['Ни один из выбранных слоёв не ловит эту проблему достаточно рано.'],
    blindSpots,
    codeSample: qualityIssueSnippets[issue],
  };
}
