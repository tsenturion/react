import type { LessonLabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

const studyMap: Record<LessonLabId, StudyEntry> = {
  'class-name': {
    files: [
      {
        path: 'src/components/styling/MarketingCard.tsx',
        note: 'Реальный компонент собирает модификаторы через `className` и подключает обычный CSS-файл.',
      },
      {
        path: 'src/styles/marketing-card.css',
        note: 'Все визуальные правила живут в отдельном stylesheet: база, модификаторы и element-классы.',
      },
      {
        path: 'src/lib/class-name-model.ts',
        note: 'Модель считает активные модификаторы и даёт краткое объяснение, когда подход особенно удобен.',
      },
    ],
    snippets: [
      {
        label: 'className recipe',
        note: 'Именно так компонент собирает обычные CSS-модификаторы поверх базового класса.',
        code: [
          'className={clsx(',
          "  'marketing-card',",
          '  `marketing-card--${accent}`,',
          '  `marketing-card--${density}`,',
          '  `marketing-card--${emphasis}`,',
          '  outlined && "marketing-card--outlined",',
          ')}',
        ].join('\n'),
      },
      {
        label: 'CSS modifiers',
        note: 'Визуальные варианты описаны в CSS отдельно от JSX.',
        code: [
          '.marketing-card--amber {',
          '  --accent: #d97706;',
          '  --accent-soft: #fef3c7;',
          '}',
          '',
          '.marketing-card--compact .marketing-card__content {',
          '  padding: 1.1rem;',
          '}',
        ].join('\n'),
      },
    ],
  },
  modules: {
    files: [
      {
        path: 'src/components/styling/ModulePreviewCard.tsx',
        note: 'Компонент использует `styles.card`, `styles.title` и другие локальные классы из `.module.css`.',
      },
      {
        path: 'src/components/styling/ModulePreviewCard.module.css',
        note: 'Здесь лежат локальные классы вроде `.title` и `.note`, которые безопасны именно благодаря CSS Modules.',
      },
      {
        path: 'src/components/styling/GlobalScopeDemo.tsx',
        note: 'Соседний блок использует глобальный CSS, чтобы контраст с module-изоляцией был виден прямо в проекте.',
      },
      {
        path: 'src/styles/isolation-demo.css',
        note: 'Глобальный `.title` намеренно сделан generic, чтобы показать, почему module-изоляция вообще нужна.',
      },
    ],
    snippets: [
      {
        label: 'Module import',
        note: 'Компонент подключает `.module.css` как объект локальных классов.',
        code: [
          "import styles from './ModulePreviewCard.module.css';",
          '',
          '<article className={clsx(styles.card, styles[tone], compact && styles.compact)}>',
          '  <h3 className={styles.title}>Локальная `.title`</h3>',
          '</article>',
        ].join('\n'),
      },
      {
        label: 'Global collision source',
        note: 'Глобальный CSS может влиять на все одноимённые классы в приложении.',
        code: [
          '.global-scope-demo .title {',
          '  color: #9a3412;',
          '  font-size: 1.75rem;',
          '}',
        ].join('\n'),
      },
    ],
  },
  inline: {
    files: [
      {
        path: 'src/components/styling/InlineSurface.tsx',
        note: 'Компонент реально вычисляет `style`-объекты из числовых значений и передаёт их в JSX.',
      },
      {
        path: 'src/lib/inline-style-model.ts',
        note: 'Модель описывает, где inline styles помогают, а где начинают мешать.',
      },
      {
        path: 'src/pages/InlineStylesPage.tsx',
        note: 'Страница управляет runtime-значениями и показывает, как они меняют итоговый внешний вид.',
      },
    ],
    snippets: [
      {
        label: 'Runtime style object',
        note: 'Здесь `style` уместен, потому что значения реально вычисляются из слайдеров.',
        code: [
          'const surfaceStyle = {',
          '  borderRadius: `${radius}px`,',
          '  background: `linear-gradient(135deg, hsl(${hue} 90% 97%), white)`,',
          '  boxShadow: `0 18px ${18 + glow}px hsl(${hue} 70% 42% / 0.24)`,',
          '};',
        ].join('\n'),
      },
      {
        label: 'Inline bar',
        note: 'Длина progress-bar тоже приходит из runtime-данных, а не из фиксированного набора классов.',
        code: [
          'const barStyle = {',
          '  width: `${progress}%`,',
          '  background: `linear-gradient(90deg, ...)`,',
          '};',
        ].join('\n'),
      },
    ],
  },
  conditional: {
    files: [
      {
        path: 'src/components/styling/StateDemoButton.tsx',
        note: 'Кнопка собирает классы из tone map, density map и булевых флагов состояния.',
      },
      {
        path: 'src/lib/conditional-style-model.ts',
        note: 'Модель диагностирует конфликтные комбинации состояний и объясняет границы подхода.',
      },
      {
        path: 'src/pages/ConditionalStylingPage.tsx',
        note: 'Страница связывает toggles состояния и реальный conditional `className` в компоненте.',
      },
    ],
    snippets: [
      {
        label: 'Variant maps',
        note: 'Словари вариантов помогают не размазывать классы по длинным тернарным цепочкам.',
        code: [
          'const toneClasses = {',
          "  neutral: 'border-slate-300 bg-white text-slate-800',",
          "  success: 'border-emerald-300 bg-emerald-50 text-emerald-900',",
          "  danger: 'border-rose-300 bg-rose-50 text-rose-900',",
          '};',
        ].join('\n'),
      },
      {
        label: 'Conditional className',
        note: 'Состояние меняет внешний вид через короткие и явные модификаторы.',
        code: [
          'className={clsx(',
          '  toneClasses[tone],',
          '  selected && "ring-2 ring-slate-900/15",',
          '  busy && "animate-pulse",',
          '  disabled && "cursor-not-allowed opacity-45",',
          ')}',
        ].join('\n'),
      },
    ],
  },
  themes: {
    files: [
      {
        path: 'src/components/styling/ThemeStage.tsx',
        note: 'Компонент читает тему через `data-theme`, `data-density` и один и тот же JSX подстраивается под другой набор токенов.',
      },
      {
        path: 'src/styles/theme-stage.css',
        note: 'Токены темы описаны как CSS variables, а не как набор жёстко вшитых цветов в JSX.',
      },
      {
        path: 'src/lib/theme-model.ts',
        note: 'Модель фиксирует доступные токены и собирает объяснение текущего theme setup.',
      },
    ],
    snippets: [
      {
        label: 'Theme container',
        note: 'Контейнер задаёт тему и плотность через data-атрибуты.',
        code: [
          '<section className="theme-stage"',
          '  data-theme={theme}',
          '  data-density={density}',
          '  data-elevated={elevated}',
          '>',
        ].join('\n'),
      },
      {
        label: 'Theme tokens',
        note: 'Компоненты читают не прямые цвета, а CSS variables.',
        code: [
          ".theme-stage[data-theme='graphite'] {",
          '  --stage-bg: #0f172a;',
          '  --stage-surface: #111827;',
          '  --stage-text: #f8fafc;',
          '  --stage-accent: #38bdf8;',
          '}',
        ].join('\n'),
      },
    ],
  },
  architecture: {
    files: [
      {
        path: 'src/lib/styling-architecture-model.ts',
        note: 'Модель сравнивает подходы по ограничениям задачи и считает score для каждого варианта.',
      },
      {
        path: 'src/components/styling/RecipeButton.tsx',
        note: 'Компонент показывает более чистую архитектуру: recipe maps вынесены из JSX.',
      },
      {
        path: 'src/components/styling/RecipeButton.module.css',
        note: 'Статические variant-классы лежат в CSS Module, а component code только собирает нужную комбинацию.',
      },
      {
        path: 'src/pages/ArchitecturePage.tsx',
        note: 'Страница даёт quick presets и сравнение подходов не по вкусу, а по требованиям сценария.',
      },
    ],
    snippets: [
      {
        label: 'Approach scoring',
        note: 'Выбор подхода строится из ограничений задачи, а не из одной любимой технологии.',
        code: [
          'const approaches = ([',
          "  'class-css', 'css-modules', 'inline', 'hybrid'",
          '] as const)',
          '  .map((id) => scoreApproach(controls, id))',
          '  .sort((left, right) => right.score - left.score);',
        ].join('\n'),
      },
      {
        label: 'Recipe component',
        note: 'Так компонент остаётся читаемым даже при нескольких вариантах и состояниях.',
        code: [
          'const className = clsx(',
          '  styles.button,',
          '  toneClasses[tone],',
          '  densityClasses[density],',
          '  selected && styles.selected,',
          '  disabled && styles.disabled,',
          ');',
        ].join('\n'),
      },
    ],
  },
};

export function getProjectStudy(id: LessonLabId) {
  return studyMap[id];
}
