import type { LabId } from './learning-model';

export type GuideFocus = 'all' | 'routes' | 'auth' | 'forms' | 'data' | 'boundaries';

export type E2EGuide = {
  id: string;
  focus: Exclude<GuideFocus, 'all'>;
  title: string;
  summary: string;
  signal: string;
  caution: string;
};

export type E2ESmell = {
  id: string;
  title: string;
  symptom: string;
  cost: string;
  saferMove: string;
};

export type RouteScreen = {
  id: string;
  label: string;
  path: string;
  purpose: string;
};

export const e2eGuides: readonly E2EGuide[] = [
  {
    id: 'route-system',
    focus: 'routes',
    title: 'Маршрут как часть сценария',
    summary: 'E2E проверяет не только компонент, но и путь пользователя между экранами.',
    signal: 'Переходы, redirect и URL влияют на итоговый сценарий.',
    caution: 'Если маршрут не влияет на поведение, не каждый переход нужно тащить в E2E.',
  },
  {
    id: 'auth-intent',
    focus: 'auth',
    title: 'Сохранение намерения',
    summary: 'После входа пользователь должен попасть туда, куда шёл изначально.',
    signal:
      'Redirect flow легко ломается, если route guard и login form живут раздельно.',
    caution: 'Проверяйте итоговый экран и URL, а не внутренние вызовы navigate.',
  },
  {
    id: 'form-review',
    focus: 'forms',
    title: 'Форма как journey',
    summary: 'Валидация, submit и следующий экран образуют один наблюдаемый путь.',
    signal: 'Системный тест особенно полезен, когда после submit меняется screen state.',
    caution: 'Не подменяйте E2E проверкой локального state формы.',
  },
  {
    id: 'data-recovery',
    focus: 'data',
    title: 'Восстановление после сбоя',
    summary:
      'E2E подтверждает, что loading, error и retry складываются в рабочий сценарий.',
    signal:
      'Пользователь видит не запросы, а очередь, ошибку и кнопку повторной попытки.',
    caution: 'Жёсткие таймауты делают тест хрупким и плохо объясняют причину падения.',
  },
  {
    id: 'cost-boundary',
    focus: 'boundaries',
    title: 'E2E как дорогой слой',
    summary:
      'Системные тесты дают сильную уверенность, но стоят дороже lower-level проверок.',
    signal:
      'Используйте E2E там, где нужно проверить стык маршрутов, auth, форм и данных.',
    caution: 'Не пытайтесь покрыть через браузер все частные ветки и технические детали.',
  },
];

export const e2eSmells: readonly E2ESmell[] = [
  {
    id: 'micro-assertions',
    title: 'Слишком мелкие утверждения',
    symptom:
      'Тест знает слишком много о промежуточных деталях и каждом частном DOM-штрихе.',
    cost: 'Любой косметический рефакторинг роняет сценарий без реальной пользовательской регрессии.',
    saferMove:
      'Оставляйте в E2E только шаги и итоговые сигналы, важные для пользователя.',
  },
  {
    id: 'duplicate-lower-layer',
    title: 'Дублирование component test',
    symptom:
      'Браузерный сценарий повторяет уже проверенную локальную валидацию один в один.',
    cost: 'Запусков больше, уверенности почти не прибавляется.',
    saferMove:
      'В E2E проверяйте целый переход между экранами, а детали формы оставляйте lower layers.',
  },
  {
    id: 'fixed-waits',
    title: 'Жёсткие ожидания по времени',
    symptom:
      'Сценарий полагается на sleep и магические задержки вместо наблюдаемых условий.',
    cost: 'Тесты становятся нестабильными и трудно объясняют, почему упали.',
    saferMove: 'Ждите role, URL, alert, status или конкретный экран, а не миллисекунды.',
  },
];

export const routeScreens: readonly RouteScreen[] = [
  {
    id: 'catalog',
    label: 'Каталог сценариев',
    path: '/route-journeys?screen=catalog',
    purpose: 'Стартовый экран, откуда пользователь идёт к нужному действию.',
  },
  {
    id: 'release-report',
    label: 'Релизный отчёт',
    path: '/workspace/release',
    purpose: 'Защищённый экран, который показывает связку маршрута и авторизации.',
  },
  {
    id: 'review',
    label: 'Review screen',
    path: '/submission-review',
    purpose: 'Экран после submit, который подтверждает завершение сценария.',
  },
];

export function filterGuidesByFocus(focus: GuideFocus) {
  if (focus === 'all') {
    return e2eGuides;
  }

  return e2eGuides.filter((guide) => guide.focus === focus);
}

export function describeLabFromPath(pathname: string): LabId {
  if (pathname.startsWith('/route-journeys')) {
    return 'routes';
  }

  if (
    pathname.startsWith('/auth-journeys') ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/workspace')
  ) {
    return 'auth';
  }

  if (
    pathname.startsWith('/form-journeys') ||
    pathname.startsWith('/submission-review')
  ) {
    return 'forms';
  }

  if (pathname.startsWith('/data-journeys')) {
    return 'data';
  }

  if (pathname.startsWith('/e2e-boundaries')) {
    return 'boundaries';
  }

  return 'overview';
}

export function sanitizeIntentPath(candidate: string | null) {
  if (!candidate || !candidate.startsWith('/')) {
    return '/workspace/release';
  }

  if (candidate.startsWith('//')) {
    return '/workspace/release';
  }

  return candidate;
}
