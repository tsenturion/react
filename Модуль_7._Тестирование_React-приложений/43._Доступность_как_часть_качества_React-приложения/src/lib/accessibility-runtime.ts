import type { LoaderFunctionArgs } from 'react-router-dom';

import { accessibilityGuides, type AccessibilityFocus } from './accessibility-domain';

function formatLoadedAt() {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date());
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

export type LessonShellLoaderData = {
  loadedAt: string;
  liveLabs: number;
  shellLandmarks: number;
  verificationLayers: number;
};

export async function lessonShellLoader(): Promise<LessonShellLoaderData> {
  return {
    loadedAt: formatLoadedAt(),
    liveLabs: 6,
    shellLandmarks: 4,
    verificationLayers: 3,
  };
}

export type OverviewLoaderData = {
  focus: AccessibilityFocus;
  guides: typeof accessibilityGuides;
  requestUrl: string;
};

export function parseOverviewFocus(value: string | null): AccessibilityFocus {
  if (
    value === 'labels' ||
    value === 'keyboard' ||
    value === 'semantics' ||
    value === 'testing' ||
    value === 'architecture'
  ) {
    return value;
  }

  return 'all';
}

export async function overviewLoader({
  request,
}: LoaderFunctionArgs): Promise<OverviewLoaderData> {
  const url = new URL(request.url);
  const focus = parseOverviewFocus(url.searchParams.get('focus'));

  return {
    focus,
    guides:
      focus === 'all'
        ? accessibilityGuides
        : accessibilityGuides.filter((guide) => guide.focus === focus),
    requestUrl: `${url.pathname}${url.search}`,
  };
}

export type NamingMode = 'visible-label' | 'placeholder-only' | 'aria-label-only';

export type LabelScenarioInput = {
  namingMode: NamingMode;
  linksHint: boolean;
  linksError: boolean;
};

export function summarizeLabelScenario(input: LabelScenarioInput) {
  const score = clamp(
    45 +
      (input.namingMode === 'visible-label' ? 35 : 0) +
      (input.namingMode === 'aria-label-only' ? 10 : 0) -
      (input.namingMode === 'placeholder-only' ? 25 : 0) +
      (input.linksHint ? 10 : -5) +
      (input.linksError ? 10 : -10),
  );

  const nameSource =
    input.namingMode === 'visible-label'
      ? 'visible label'
      : input.namingMode === 'aria-label-only'
        ? 'aria-label without visible binding'
        : 'placeholder only';

  const verdict =
    score >= 80
      ? 'Поле читаетcя устойчиво'
      : score >= 55
        ? 'Имя поля держится, но модель хрупкая'
        : 'Поле легко теряет смысл и ошибку';

  const strengths = [
    input.namingMode === 'visible-label'
      ? 'Видимая подпись связана с контролом и даёт устойчивый accessible name.'
      : 'Accessible name опирается не на label, а на более хрупкую стратегию.',
    input.linksHint
      ? 'Подсказка входит в модель поля через aria-describedby.'
      : 'Подсказка визуально есть, но assistive tech о ней не узнает автоматически.',
    input.linksError
      ? 'Ошибка входит в описание поля и не живёт отдельно от контрола.'
      : 'Ошибка показывается отдельно и может не читаться в контексте поля.',
  ];

  const risks = [
    input.namingMode === 'placeholder-only'
      ? 'Placeholder исчезает во время ввода и не заменяет связанный label.'
      : 'Имя поля не теряется во время ввода.',
    input.namingMode === 'aria-label-only'
      ? 'aria-label помогает технологии чтения, но видимая подпись остаётся несвязанной для мыши и зрения.'
      : 'Видимое имя и техническое имя не расходятся.',
  ];

  return { score, verdict, nameSource, strengths, risks };
}

export type KeyboardScenarioInput = {
  usesSemanticControls: boolean;
  restoresFocus: boolean;
  supportsEscape: boolean;
  clickOnlyHotspots: boolean;
};

export function summarizeKeyboardScenario(input: KeyboardScenarioInput) {
  const score = clamp(
    35 +
      (input.usesSemanticControls ? 25 : -10) +
      (input.restoresFocus ? 20 : -20) +
      (input.supportsEscape ? 10 : -10) +
      (input.clickOnlyHotspots ? -25 : 10),
  );

  const verdict =
    score >= 80
      ? 'Keyboard-путь предсказуем'
      : score >= 55
        ? 'Путь работает частично, но есть риск потери ориентира'
        : 'Клавиатурный сценарий рвётся';

  const tabPreview = input.clickOnlyHotspots
    ? ['Открыть диалог действий', 'Поиск по действиям', 'Закрыть диалог']
    : [
        'Быстрый поиск',
        'Сохранить как черновик',
        'Открыть диалог действий',
        'Поиск по действиям',
        'Закрыть диалог',
      ];

  const risks = [
    input.usesSemanticControls
      ? 'Действия уже выражены через button и попадают в стандартный keyboard flow.'
      : 'Generic element требует ручного keyboard-поведения и легко выпадает из Tab-порядка.',
    input.restoresFocus
      ? 'После закрытия диалога фокус возвращается к триггеру.'
      : 'После закрытия диалога пользователь теряет опорную точку на экране.',
    input.supportsEscape
      ? 'Escape закрывает временный слой без мыши.'
      : 'У временного слоя нет ожидаемого способа закрытия с клавиатуры.',
  ];

  return { score, verdict, tabPreview, risks };
}

export type AriaStrategy = 'native' | 'redundant' | 'wrong-role';

export type SemanticsScenarioInput = {
  usesLandmarks: boolean;
  usesNativeControls: boolean;
  headingsAreOrdered: boolean;
  ariaStrategy: AriaStrategy;
};

export function summarizeSemanticsScenario(input: SemanticsScenarioInput) {
  const score = clamp(
    40 +
      (input.usesLandmarks ? 20 : -15) +
      (input.usesNativeControls ? 20 : -20) +
      (input.headingsAreOrdered ? 10 : -10) +
      (input.ariaStrategy === 'native' ? 15 : 0) -
      (input.ariaStrategy === 'redundant' ? 10 : 0) -
      (input.ariaStrategy === 'wrong-role' ? 25 : 0),
  );

  const verdict =
    score >= 80
      ? 'Структура читается нативно'
      : score >= 55
        ? 'Структура ещё различима, но роли начинают мешать'
        : 'Семантика интерфейса размыта';

  const roleMap = [
    input.usesLandmarks
      ? 'banner / navigation / main / contentinfo'
      : 'landmarks отсутствуют',
    input.usesNativeControls ? 'action -> button' : 'action -> div with onClick',
    input.ariaStrategy === 'native'
      ? 'ARIA добавляется только там, где нужен реальный мост'
      : input.ariaStrategy === 'redundant'
        ? 'ARIA дублирует нативную семантику'
        : 'ARIA спорит с нативной ролью и сбивает модель',
  ];

  return { score, verdict, roleMap };
}

export type TestingScenarioInput = {
  queriesByRole: boolean;
  checksKeyboard: boolean;
  checksAnnouncements: boolean;
  usesTestIds: boolean;
  assertsClasses: boolean;
};

export function summarizeTestingScenario(input: TestingScenarioInput) {
  const score = clamp(
    35 +
      (input.queriesByRole ? 25 : -20) +
      (input.checksKeyboard ? 15 : -10) +
      (input.checksAnnouncements ? 15 : -10) -
      (input.usesTestIds ? 10 : 0) -
      (input.assertsClasses ? 20 : 0),
  );

  const verdict =
    score >= 80
      ? 'Тесты говорят языком пользователя'
      : score >= 55
        ? 'Тесты уже видят поведение, но ещё держатся за реализацию'
        : 'Покрытие слабо страхует accessibility-регрессии';

  const checks = [
    input.queriesByRole
      ? 'Поиск по role/name страхует доступное имя и роль одновременно.'
      : 'Поиск обходит роль и имя, поэтому реальный интерфейс остаётся непроверенным.',
    input.checksKeyboard
      ? 'Keyboard flow проверяется как часть поведения.'
      : 'Клавиатурный путь остаётся непроверенным.',
    input.checksAnnouncements
      ? 'alert/status участвуют в assertions и страхуют async feedback.'
      : 'Сообщения об ошибке или статусы не входят в тестовую модель.',
  ];

  return { score, verdict, checks };
}

export type ArchitectureScenarioInput = {
  hasForms: boolean;
  hasNavigation: boolean;
  hasDialog: boolean;
  hasCustomWidget: boolean;
  hasAsyncStatus: boolean;
  testsByBehavior: boolean;
};

export function summarizeArchitectureScenario(input: ArchitectureScenarioInput) {
  const score = clamp(
    30 +
      (input.hasForms ? 10 : 0) +
      (input.hasNavigation ? 10 : 0) +
      (input.hasDialog ? 10 : 0) +
      (input.hasCustomWidget ? 15 : 0) +
      (input.hasAsyncStatus ? 10 : 0) +
      (input.testsByBehavior ? 15 : -15),
  );

  const priorities = [
    input.hasForms
      ? 'Формы требуют связанного имени, подсказки и объявляемой ошибки.'
      : 'Форменный слой не задаёт основную сложность.',
    input.hasNavigation
      ? 'Маршруты и landmarks должны оставаться понятными между экранами.'
      : 'Навигационный слой можно держать локальным.',
    input.hasDialog
      ? 'Диалогу нужен входной фокус, Escape и возврат к триггеру.'
      : 'Слой временных поверхностей пока не главный источник риска.',
    input.hasCustomWidget
      ? 'Кастомный widget нужно сравнивать с native alternative и явно планировать роли/keys.'
      : 'Можно опираться на native controls и не тащить лишний ARIA.',
    input.hasAsyncStatus
      ? 'Статусы загрузки и ошибки должны объявляться так же явно, как визуально рисуются.'
      : 'Сценарии статусов не доминируют в архитектуре.',
  ];

  const verdict =
    score >= 70
      ? 'Доступность уже встроена в архитектурные решения'
      : 'Есть риск, что a11y останется поздней доработкой';

  return { score, verdict, priorities };
}

export type AuditChecklistItem = {
  title: string;
  passed: boolean;
  detail: string;
};

export function buildAuditChecklist(input: {
  hasVisibleLabel: boolean;
  linksError: boolean;
  usesButtonElement: boolean;
  hasLandmarks: boolean;
}) {
  const items: AuditChecklistItem[] = [
    {
      title: 'Контролу доступно имя',
      passed: input.hasVisibleLabel,
      detail: input.hasVisibleLabel
        ? 'Поле можно найти по видимой подписи.'
        : 'У поля нет связанной видимой label, поэтому поиск по имени становится хрупким.',
    },
    {
      title: 'Ошибка связана с полем',
      passed: input.linksError,
      detail: input.linksError
        ? 'Ошибка входит в aria-describedby и читается в контексте поля.'
        : 'Ошибка живёт отдельно от поля и легко теряется для assistive tech.',
    },
    {
      title: 'Действие выражено через button',
      passed: input.usesButtonElement,
      detail: input.usesButtonElement
        ? 'Нативный control уже несёт роль, имя и keyboard-поведение.'
        : 'Generic element требует ручного поведения и повышает риск пропуска в тестах.',
    },
    {
      title: 'Preview разбит на landmarks',
      passed: input.hasLandmarks,
      detail: input.hasLandmarks
        ? 'Области экрана можно быстро найти по landmarks.'
        : 'Структура не выражена через semantic regions.',
    },
  ];

  return items;
}

export function recommendedQueries(input: {
  hasVisibleLabel: boolean;
  usesButtonElement: boolean;
}) {
  return [
    input.hasVisibleLabel
      ? "screen.getByRole('textbox', { name: 'Email для релизных уведомлений' })"
      : 'В текущем broken-режиме поиск по имени не должен быть надёжным.',
    input.usesButtonElement
      ? "screen.getByRole('button', { name: 'Отправить форму' })"
      : 'Сначала почините control, а не подстраивайте тест под div-hotspot.',
    "screen.getByRole('alert') или screen.getByRole('status') для user-visible сообщений",
  ];
}
