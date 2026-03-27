import type { LessonLabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

const studyMap: Record<LessonLabId, StudyEntry> = {
  timing: {
    files: [
      {
        path: 'src/components/dom-hooks/LayoutTimingLab.tsx',
        note: 'Здесь один и тот же popover прогоняется через layout- и passive-синхронизацию.',
      },
      {
        path: 'src/lib/layout-timing-model.ts',
        note: 'Модель держит phase order и pure вычисление позиции popover.',
      },
      {
        path: 'src/pages/LayoutTimingPage.tsx',
        note: 'Страница связывает visual demo с code-level объяснением timing hooks.',
      },
    ],
    snippets: [
      {
        label: 'Measure before paint',
        note: 'useLayoutEffect нужен, когда сначала надо прочитать геометрию DOM, а потом уже показывать готовый кадр.',
        code: [
          'useLayoutEffect(() => {',
          '  const next = computePopoverPlacement(anchorRect, stageRect, panelWidth, panelHeight);',
          '  setPlacement(next);',
          '}, [density, syncMode]);',
        ].join('\n'),
      },
      {
        label: 'Visible fallback reset',
        note: 'В обработчиках fallback намеренно возвращается, чтобы было видно, когда correction случается относительно paint.',
        code: [
          'function resetToFallback(nextStatus: string) {',
          '  setPlacement(fallbackPopoverPlacement);',
          '  setStatus(nextStatus);',
          '}',
        ].join('\n'),
      },
    ],
  },
  positioning: {
    files: [
      {
        path: 'src/components/dom-hooks/CriticalPositioningLab.tsx',
        note: 'Underline измеряется из реального DOM и поддерживается observer-ом на ширину дорожки.',
      },
      {
        path: 'src/lib/positioning-model.ts',
        note: 'Модель считает относительную геометрию underline и формулирует выводы по timing.',
      },
      {
        path: 'src/pages/PositioningPage.tsx',
        note: 'Страница связывает критичное позиционирование с useLayoutEffect и ResizeObserver.',
      },
    ],
    snippets: [
      {
        label: 'Relative indicator box',
        note: 'Underline рассчитывается относительно контейнера, а не из магических констант.',
        code: [
          'const next = computeIndicatorBox(',
          '  activeButton.getBoundingClientRect(),',
          '  stage.getBoundingClientRect(),',
          ');',
        ].join('\n'),
      },
      {
        label: 'Resize observer bridge',
        note: 'При resize underline должен измериться заново, иначе геометрия рассинхронизируется.',
        code: [
          'const observer = new ResizeObserver(measure);',
          'observer.observe(stage);',
          'return () => observer.disconnect();',
        ].join('\n'),
      },
    ],
  },
  insertion: {
    files: [
      {
        path: 'src/components/dom-hooks/InsertionEffectLab.tsx',
        note: 'Лаборатория реально вставляет style tag в document.head и переключает режим инъекции.',
      },
      {
        path: 'src/lib/insertion-effect-model.ts',
        note: 'Здесь формируется scoped CSS и timeline для useInsertionEffect vs useEffect.',
      },
      {
        path: 'src/pages/InsertionEffectPage.tsx',
        note: 'Страница связывает style injection с критичными сценариями CSS-in-JS.',
      },
    ],
    snippets: [
      {
        label: 'Style tag in head',
        note: 'useInsertionEffect здесь занимается только style injection и не трогает state.',
        code: [
          'useInsertionEffect(() => {',
          '  ensureStyleNode().textContent = cssText;',
          '}, [cssText, injectionMode]);',
        ].join('\n'),
      },
      {
        label: 'Scoped runtime CSS',
        note: 'Правила генерируются под конкретную scope-class, чтобы не растекаться по остальному приложению.',
        code: [
          'export function buildInjectedThemeCss(scopeClass: string, themeId: StyleThemeId) {',
          '  return `.${scopeClass} .theme-shell { ... }`;',
          '}',
        ].join('\n'),
      },
    ],
  },
  handle: {
    files: [
      {
        path: 'src/components/dom-hooks/ImperativePalette.tsx',
        note: 'Здесь child-компонент через useImperativeHandle отдаёт наружу только команды.',
      },
      {
        path: 'src/components/dom-hooks/ImperativeHandleLab.tsx',
        note: 'Родитель пользуется handle-командами и не трогает child state напрямую.',
      },
      {
        path: 'src/lib/imperative-handle-model.ts',
        note: 'Модель формулирует границу между узким API и утечкой внутренней реализации child-компонента.',
      },
    ],
    snippets: [
      {
        label: 'Expose commands only',
        note: 'Родитель получает команды, а не весь DOM child-компонента.',
        code: [
          'useImperativeHandle(ref, () => ({',
          '  open(prefill) { ... },',
          '  focusSearch() { ... },',
          '  reset() { ... },',
          '}), []);',
        ].join('\n'),
      },
      {
        label: 'Focus after open',
        note: 'Команда может сначала открыть child, а затем довести focus уже после commit его DOM.',
        code: [
          'pendingFocusRef.current = true;',
          'setIsOpen(true);',
          'useLayoutEffect(() => {',
          '  if (isOpen && pendingFocusRef.current) inputRef.current?.focus();',
          '}, [isOpen]);',
        ].join('\n'),
      },
    ],
  },
  widget: {
    files: [
      {
        path: 'src/components/dom-hooks/WidgetIntegrationLab.tsx',
        note: 'Лаборатория выделяет host div и подключает к нему внешний widget instance.',
      },
      {
        path: 'src/lib/dom-hooks-domain.ts',
        note: 'Здесь лежит createDemoWidget() и наборы данных/тем для внешней imperative-библиотеки.',
      },
      {
        path: 'src/lib/widget-integration-model.ts',
        note: 'Модель отделяет mount/update/cleanup и объясняет, когда sync bridge должен быть layout-sensitive.',
      },
    ],
    snippets: [
      {
        label: 'Dedicated widget host',
        note: 'React оставляет библиотеке отдельный host, а не смешивает её DOM с собственным JSX.',
        code: ['<div ref={hostRef} className="widget-host" />'].join('\n'),
      },
      {
        label: 'Imperative widget instance',
        note: 'После mount bridge обновляет существующий instance, а cleanup уничтожает его полностью.',
        code: [
          'widget.setTheme(themeId);',
          'widget.setDataset(datasetId);',
          'return () => {',
          '  widget.destroy();',
          '};',
        ].join('\n'),
      },
    ],
  },
  boundary: {
    files: [
      {
        path: 'src/components/dom-hooks/OverengineeringLab.tsx',
        note: 'Лаборатория сопоставляет реальные UI-сценарии и минимально нужный escape hatch.',
      },
      {
        path: 'src/lib/overengineering-model.ts',
        note: 'Модель показывает, где advanced DOM hooks оправданы, а где создают лишнюю архитектурную нагрузку.',
      },
      {
        path: 'src/pages/BoundaryPage.tsx',
        note: 'Страница собирает итоговый вывод по границам применения useLayoutEffect/useInsertionEffect/useImperativeHandle.',
      },
    ],
    snippets: [
      {
        label: 'Derived data stays in render',
        note: 'Если результат можно вычислить прямо из текущих данных, advanced hook тут лишний.',
        code: [
          'const filteredItems = items.filter((item) =>',
          '  item.title.toLowerCase().includes(query.toLowerCase()),',
          ');',
        ].join('\n'),
      },
      {
        label: 'Pick the smallest escape hatch',
        note: 'Граница выбора формулируется не названием hook, а природой задачи: measurement, style injection, child command или bridge к widget.',
        code: [
          'recommended: "Вычислить в render" | "ref + событие" | "useLayoutEffect" |',
          '             "useInsertionEffect" | "useImperativeHandle"',
        ].join('\n'),
      },
    ],
  },
};

export function getProjectStudy(id: LessonLabId) {
  return studyMap[id];
}
