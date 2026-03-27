import type { StatusTone } from './common';

export type RunModeId = 'vite-dev' | 'vite-build' | 'vite-preview' | 'docker-prod';

export interface RunModeOption {
  id: RunModeId;
  label: string;
  hint: string;
}

export const runModeOptions: RunModeOption[] = [
  {
    id: 'vite-dev',
    label: 'Vite dev server',
    hint: 'Живой dev server, быстрый feedback loop и hot reload/HMR.',
  },
  {
    id: 'vite-build',
    label: 'Vite build',
    hint: 'Production сборка, bundler output и готовые dist-ассеты.',
  },
  {
    id: 'vite-preview',
    label: 'Vite preview',
    hint: 'Локальная раздача уже собранного dist без HMR.',
  },
  {
    id: 'docker-prod',
    label: 'Docker + Nginx',
    hint: 'Поставка build в контейнерном production-окружении.',
  },
];

export type RuntimeExpectationId =
  | 'instant-feedback'
  | 'hmr'
  | 'production-assets'
  | 'prod-like-behavior'
  | 'static-delivery'
  | 'browser-reads-src';

export interface RuntimeExpectationOption {
  id: RuntimeExpectationId;
  label: string;
  hint: string;
}

export const runtimeExpectationOptions: RuntimeExpectationOption[] = [
  {
    id: 'instant-feedback',
    label: 'Мгновенная обратная связь',
    hint: 'Ожидается, что правка в коде сразу отражается в интерфейсе.',
  },
  {
    id: 'hmr',
    label: 'HMR',
    hint: 'Режим должен переиспользовать состояние и обновлять модули без полной перезагрузки.',
  },
  {
    id: 'production-assets',
    label: 'Хэшированные production-ассеты',
    hint: 'Нужен настоящий build, а не просто отдача исходников.',
  },
  {
    id: 'prod-like-behavior',
    label: 'Поведение близко к production',
    hint: 'Режим должен показывать уже собранную, а не живую dev-среду.',
  },
  {
    id: 'static-delivery',
    label: 'Готовность к статической поставке',
    hint: 'Нужны артефакты, которые можно раздать через сервер или контейнер.',
  },
  {
    id: 'browser-reads-src',
    label: 'Браузер читает src напрямую',
    hint: 'Полезная ловушка: ожидание, что браузер может исполнять TSX, ES imports и npm imports без toolchain.',
  },
];

export interface RunModeStage {
  id: string;
  label: string;
  status: StatusTone;
  note: string;
}

export interface RunModeAnalysis {
  overall: StatusTone;
  stages: RunModeStage[];
  unsupported: RuntimeExpectationId[];
  before: string;
  after: string;
  mistakes: string[];
  importance: string[];
}

const runModeCapabilities: Record<RunModeId, Record<RuntimeExpectationId, boolean>> = {
  'vite-dev': {
    'instant-feedback': true,
    hmr: true,
    'production-assets': false,
    'prod-like-behavior': false,
    'static-delivery': false,
    'browser-reads-src': false,
  },
  'vite-build': {
    'instant-feedback': false,
    hmr: false,
    'production-assets': true,
    'prod-like-behavior': false,
    'static-delivery': true,
    'browser-reads-src': false,
  },
  'vite-preview': {
    'instant-feedback': false,
    hmr: false,
    'production-assets': true,
    'prod-like-behavior': true,
    'static-delivery': true,
    'browser-reads-src': false,
  },
  'docker-prod': {
    'instant-feedback': false,
    hmr: false,
    'production-assets': true,
    'prod-like-behavior': true,
    'static-delivery': true,
    'browser-reads-src': false,
  },
};

// Сравнение режимов выражено как обычная JS-модель: ожидания на входе,
// capabilities режима в центре и развёрнутый вывод для UI на выходе.
export function analyzeRunMode(
  mode: RunModeId,
  expectations: RuntimeExpectationId[],
): RunModeAnalysis {
  const unsupported = expectations.filter(
    (expectation) => !runModeCapabilities[mode][expectation],
  );

  const stages: RunModeStage[] = [
    {
      id: 'entry',
      label: '1. Как стартует режим',
      status: 'success',
      note:
        mode === 'vite-dev'
          ? 'Стартует live dev server, который обслуживает исходники через transform pipeline.'
          : mode === 'vite-build'
            ? 'Режим генерирует dist и не предназначен для живого клика по приложению.'
            : mode === 'vite-preview'
              ? 'Preview поднимает сервер поверх готового dist и поэтому ближе к production.'
              : 'Контейнер раздаёт заранее собранный dist через серверный runtime.',
    },
    {
      id: 'feedback',
      label: '2. Что происходит после правки файла',
      status: runModeCapabilities[mode].hmr ? 'success' : 'warn',
      note: runModeCapabilities[mode].hmr
        ? 'Изменения проходят через HMR и быстро возвращаются в браузер без полной production-пересборки.'
        : 'Этот режим не даёт HMR: чтобы увидеть новую правку, нужен новый build или перезапуск поставки.',
    },
    {
      id: 'artifacts',
      label: '3. Какие файлы видит браузер',
      status: runModeCapabilities[mode]['production-assets'] ? 'success' : 'warn',
      note: runModeCapabilities[mode]['production-assets']
        ? 'Браузер работает с готовыми production-ассетами из dist.'
        : 'Браузер получает подготовленные dev-модули, а не финальный production bundle.',
    },
    {
      id: 'expectations',
      label: '4. Совпадение с выбранными ожиданиями',
      status: unsupported.length > 0 ? 'error' : 'success',
      note:
        unsupported.length > 0
          ? `Этот режим не закрывает ожидания: ${unsupported.join(', ')}.`
          : 'Все выбранные ожидания соответствуют возможностям режима.',
    },
  ];

  const hasError = stages.some((stage) => stage.status === 'error');
  const hasWarn = stages.some((stage) => stage.status === 'warn');

  return {
    overall: hasError ? 'error' : hasWarn ? 'warn' : 'success',
    stages,
    unsupported,
    before:
      'До сравнения режимов легко смешать dev server, preview и production-доставку в один общий "запуск проекта".',
    after:
      'После сравнения видно, что каждый режим решает свою задачу: быстрые правки, сборку, проверку dist или реальную поставку.',
    mistakes: [
      'Ожидать HMR от production build или preview.',
      'Считать, что браузер читает `src/*.tsx` и ES imports напрямую без участия Vite.',
      'Проверять только `npm run dev` и думать, что production будет вести себя так же.',
    ],
    importance: [
      'Это помогает правильно выбирать команду под задачу: разработка, локальная проверка build или поставка.',
      'Понимание режимов резко уменьшает путаницу между исходниками, модульным графом, dist и реальным production-окружением.',
    ],
  };
}
