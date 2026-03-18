export const projectStudy = {
  semantics: {
    files: [
      {
        path: 'src/App.tsx',
        note: 'Общая оболочка проекта сама построена на `<header>`, `<nav>`, `<main>` и `<footer>`.',
      },
      {
        path: 'src/lib/semantics-model.ts',
        note: 'Pure model для landmarks, heading outline и сравнений semantic/generic структуры.',
      },
      {
        path: 'src/pages/SemanticsPage.tsx',
        note: 'Страница рендерит структуру как реальные HTML-элементы, а не просто перечисляет теги в тексте.',
      },
    ],
    snippets: [
      {
        label: 'src/App.tsx',
        note: 'Тема про семантику выражена прямо в shell текущего проекта.',
        code: `<header>...</header>
<nav>...</nav>
<main className="panel p-6 sm:p-8">
  <ActiveComponent />
</main>
<footer>...</footer>`,
      },
      {
        label: 'src/lib/semantics-model.ts',
        note: 'Структура страницы вычисляется как модель landmarks и headings, а затем попадает в UI.',
        code: `const outline = [
  { element: elementFor('header'), label: 'Верхняя часть страницы' },
  { element: elementFor('nav'), label: 'Навигация' },
  { element: elementFor('main'), label: preset.title },
];`,
      },
    ],
  },
  forms: {
    files: [
      {
        path: 'src/pages/FormsPage.tsx',
        note: 'Здесь используется настоящая `<form>` с `FormData`, `fieldset`, `label`, `input`, `select`, `textarea` и `button type="submit"`.',
      },
      {
        path: 'src/lib/form-model.ts',
        note: 'Модель поясняет, как `name`, `disabled`, `readonly` и `required` влияют на поведение формы.',
      },
      {
        path: 'src/lib/platform-bridge-model.ts',
        note: 'Связывает платформенную форму с React-уровнем `onSubmit` и тестированием по label/role.',
      },
    ],
    snippets: [
      {
        label: 'src/pages/FormsPage.tsx',
        note: 'Форма здесь intentionally uncontrolled: браузер и FormData остаются источником истины для темы.',
        code: `const payload = new FormData(event.currentTarget);
const entries = Array.from(payload.entries());

if (!event.currentTarget.reportValidity()) {
  return;
}`,
      },
      {
        label: 'src/lib/form-model.ts',
        note: 'Эта модель отдельно фиксирует, почему disabled и missing name меняют payload.',
        code: `const omitted = [
  ...(!config.trackHasName ? ['track: отсутствует, потому что у select нет name'] : []),
  ...(config.messageMode === 'disabled'
    ? ['message: отсутствует, потому что поле disabled']
    : []),
];`,
      },
    ],
  },
  events: {
    files: [
      {
        path: 'src/pages/EventsPage.tsx',
        note: 'Путь события собирается через реальные native listeners, а не через выдуманную симуляцию.',
      },
      {
        path: 'src/lib/event-model.ts',
        note: 'Форматирование и summary event log вынесены в предметный слой.',
      },
      {
        path: 'src/lib/platform-bridge-model.ts',
        note: 'Показывает, почему DOM propagation остаётся важным и для React events.',
      },
    ],
    snippets: [
      {
        label: 'src/pages/EventsPage.tsx',
        note: 'Listeners вешаются через `addEventListener` в обе фазы, чтобы тема была выражена самой реализацией.',
        code: `node.addEventListener('click', captureHandler, true);
node.addEventListener('click', bubbleHandler);

if (isLinkBubblePhase) {
  if (preventDefaultRef.current) event.preventDefault();
  if (stopPropagationRef.current) event.stopPropagation();
}`,
      },
      {
        label: 'src/lib/event-model.ts',
        note: 'Лог событий остаётся читаемой моделью и легко тестируется отдельно от DOM.',
        code: `export const formatNativeEventLine = (record) =>
  \`\${record.phase.toUpperCase()} • \${record.node} • defaultPrevented=\${record.defaultPrevented}\`;`,
      },
    ],
  },
  focus: {
    files: [
      {
        path: 'src/pages/FocusPage.tsx',
        note: 'Здесь соединяются нативная focusability, keyboard behavior и `ref.focus()`.',
      },
      {
        path: 'src/lib/focus-model.ts',
        note: 'Описывает, когда element попадает в tab order и что нужно fake-control для клавиатуры.',
      },
      {
        path: 'src/main.tsx',
        note: 'Вход React в DOM оставлен явным, чтобы было видно, где потом работают refs и focus management.',
      },
    ],
    snippets: [
      {
        label: 'src/pages/FocusPage.tsx',
        note: 'Текущий узел фокусируется через реальный DOM ref, а не через абстрактную команду без target.',
        code: `const interactiveRef = useRef<HTMLElement | null>(null);

const focusInteractive = () => {
  interactiveRef.current?.focus();
};`,
      },
      {
        label: 'src/lib/focus-model.ts',
        note: 'Фокус и клавиатура зависят не только от JS, но и от element type, href и tabIndex.',
        code: `const focusableInTabOrder =
  tabMode === 'minus-one'
    ? false
    : kind === 'button'
      ? true
      : kind === 'link'
        ? hasHref || tabMode !== 'native'
        : tabMode !== 'native';`,
      },
    ],
  },
  accessibility: {
    files: [
      {
        path: 'src/pages/AccessibilityPage.tsx',
        note: 'Интерактивный разбор accessible name, native role и избыточного ARIA.',
      },
      {
        path: 'src/lib/accessibility-model.ts',
        note: 'Правила имени, роли и ARIA вынесены в отдельную модель.',
      },
      {
        path: 'src/components/ui.tsx',
        note: 'Переиспользуемые UI-блоки проекта сами построены на корректных button/section/header структурах.',
      },
    ],
    snippets: [
      {
        label: 'src/lib/accessibility-model.ts',
        note: 'ARIA здесь не украшение: модель явно говорит, когда он нужен, а когда вредно дублирует нативную семантику.',
        code: `...(addRedundantRole ? ['Нативному элементу не нужен повторяющий его role.'] : []),
...(pattern === 'icon-button' && !hasAriaLabel
  ? ['Icon-only button почти всегда требует aria-label.']
  : []),`,
      },
      {
        label: 'src/pages/AccessibilityPage.tsx',
        note: 'В самой странице используются реальные label/button/input-связи вместо псевдо-демо на div.',
        code: `<button type="button" aria-label="Открыть меню">
  <svg aria-hidden="true" />
</button>`,
      },
    ],
  },
  bridge: {
    files: [
      {
        path: 'src/lib/platform-bridge-model.ts',
        note: 'Связывает платформенные примитивы с React use-case: формы, роутинг, события, refs и тестирование.',
      },
      {
        path: 'src/pages/PlatformBridgePage.tsx',
        note: 'Интерактивный selector сценариев и последствий нарушения platform contract.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Unit tests подтверждают ключевые причинно-следственные связи темы.',
      },
    ],
    snippets: [
      {
        label: 'src/lib/platform-bridge-model.ts',
        note: 'Каждый React use-case жёстко привязан к конкретному платформенному контракту.',
        code: `{
  id: 'testing',
  platformLayer: 'role, label, accessible name',
  reactLayer: 'getByRole, getByLabelText, user-event',
}`,
      },
      {
        label: 'src/pages/PlatformBridgePage.tsx',
        note: 'Страница не пересказывает тему целиком, а даёт выбирать слой и смотреть, что ломается без платформенной базы.',
        code: `const scenario = getBridgeScenario(activeScenarioId, showFailure);
{scenario.visibleConsequences.map((item) => (
  <li key={item}>{item}</li>
))}`,
      },
    ],
  },
} as const;
