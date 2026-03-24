import type { LabId } from './learning-model';

type ProjectStudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, ProjectStudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Shell урока сам использует skip link, landmarks, nav label и route announcement.',
      },
      {
        path: 'src/lib/accessibility-domain.ts',
        note: 'Guide cards и shell surfaces превращают тему доступности в предметную модель, а не в абстрактный текст.',
      },
      {
        path: 'src/lib/accessibility-runtime.ts',
        note: 'Overview loader и pure-модели показывают, как URL, качество и accessibility связаны между собой.',
      },
    ],
    snippets: [
      {
        label: 'router.tsx',
        note: 'Shell урока сам показывает, что доступность начинается не в отдельном компоненте, а в структуре приложения.',
        code: `<a href="#lesson-content" className="skip-link">
  Перейти к содержимому урока
</a>
<div className="sr-only" aria-live="polite">
  {\`Открыта лаборатория: \${activeLab.label}\`}
</div>`,
      },
      {
        label: 'accessibility-runtime.ts',
        note: 'Overview получает focus из URL и возвращает уже готовую карту темы.',
        code: `export async function overviewLoader({
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
    requestUrl: \`\${url.pathname}\${url.search}\`,
  };
}`,
      },
    ],
  },
  labels: {
    files: [
      {
        path: 'src/components/accessibility/LabelAndErrorsLab.tsx',
        note: 'Живой sandbox сравнивает visible label, placeholder-only и aria-label-only на одном и том же поле.',
      },
      {
        path: 'src/pages/LabelsPage.tsx',
        note: 'Страница связывает live-демо с anti-patterns, пояснениями и файлами проекта.',
      },
      {
        path: 'src/lib/accessibility-runtime.ts',
        note: 'Pure-функция считает силу accessible name и показывает, почему ошибка должна быть связана с полем.',
      },
    ],
    snippets: [
      {
        label: 'LabelAndErrorsLab.tsx',
        note: 'Описание поля собирается из hint и ошибки только тогда, когда они реально подключены к контролу.',
        code: `const describedBy = [
  linksHint ? hintId : null,
  hasError && linksError ? errorId : null,
]
  .filter(Boolean)
  .join(' ');`,
      },
      {
        label: 'accessibility-runtime.ts',
        note: 'Placeholder-only сразу снижает score, потому что поле теряет устойчивое имя во время ввода.',
        code: `const score = clamp(
  45 +
    (input.namingMode === 'visible-label' ? 35 : 0) +
    (input.namingMode === 'aria-label-only' ? 10 : 0) -
    (input.namingMode === 'placeholder-only' ? 25 : 0),
);`,
      },
    ],
  },
  keyboard: {
    files: [
      {
        path: 'src/components/accessibility/KeyboardFocusLab.tsx',
        note: 'Лаборатория моделирует native controls, click-only hotspots, dialog, Escape и возврат фокуса.',
      },
      {
        path: 'src/pages/KeyboardPage.tsx',
        note: 'Страница поясняет, где keyboard support живёт в архитектуре экрана, а не только в отдельных кнопках.',
      },
      {
        path: 'src/components/accessibility/KeyboardFocusLab.test.tsx',
        note: 'Component test страхует autofocus и возврат к триггеру после закрытия диалога.',
      },
    ],
    snippets: [
      {
        label: 'KeyboardFocusLab.tsx',
        note: 'Возврат к триггеру идёт после закрытия слоя, чтобы focus не потерялся между render passes.',
        code: `function closeDialog() {
  setDialogOpen(false);

  if (restoresFocus) {
    queueMicrotask(() => {
      openerRef.current?.focus();
    });
  }
}`,
      },
      {
        label: 'KeyboardFocusLab.test.tsx',
        note: 'Тест описывает тот же путь, который проходит человек: открыть диалог, ввести текст, закрыть, проверить focus.',
        code: `await user.click(screen.getByRole('button', { name: 'Открыть диалог действий' }));
expect(screen.getByRole('textbox', { name: 'Поиск по действиям' })).toHaveFocus();

await user.keyboard('{Escape}');
expect(screen.getByRole('button', { name: 'Открыть диалог действий' })).toHaveFocus();`,
      },
    ],
  },
  semantics: {
    files: [
      {
        path: 'src/components/accessibility/SemanticsAriaLab.tsx',
        note: 'Sandbox показывает native markup, div soup и сценарии, где ARIA дублирует или ломает нативную семантику.',
      },
      {
        path: 'src/pages/SemanticsPage.tsx',
        note: 'Страница связывает live-semantic preview с role map и ограничениями ARIA.',
      },
      {
        path: 'src/lib/accessibility-runtime.ts',
        note: 'Модель сравнивает landmarks, native controls и стратегию использования ролей.',
      },
    ],
    snippets: [
      {
        label: 'SemanticsAriaLab.tsx',
        note: 'Когда native button уже существует, лишняя роль только увеличивает шум.',
        code: `{ariaStrategy === 'redundant' ? (
  <button role="button" aria-label={section.title} type="button">
    {section.title}
  </button>
) : (
  <button type="button">{section.title}</button>
)}`,
      },
      {
        label: 'accessibility-runtime.ts',
        note: 'Неверная роль штрафуется сильнее, чем просто лишний ARIA, потому что ломает ментальную модель интерфейса.',
        code: `const score = clamp(
  40 +
    (input.usesLandmarks ? 20 : -15) +
    (input.usesNativeControls ? 20 : -20) +
    (input.headingsAreOrdered ? 10 : -10) +
    (input.ariaStrategy === 'native' ? 15 : 0) -
    (input.ariaStrategy === 'redundant' ? 10 : 0) -
    (input.ariaStrategy === 'wrong-role' ? 25 : 0),
);`,
      },
    ],
  },
  testing: {
    files: [
      {
        path: 'src/components/accessibility/AccessibilityAuditLab.tsx',
        note: 'Живой audit surface показывает, как одна и та же форма выглядит для UI и для role-based тестов.',
      },
      {
        path: 'src/components/accessibility/AccessibilityAuditLab.test.tsx',
        note: 'Тесты проверяют label, alert и button так же, как их должна читать реальная assistive технология.',
      },
      {
        path: 'src/test/test-utils.tsx',
        note: 'Custom render helper поднимает только router-контекст и не прячет сам пользовательский сценарий.',
      },
    ],
    snippets: [
      {
        label: 'AccessibilityAuditLab.tsx',
        note: 'Чек-лист строится не по DOM-деталям, а по признакам, влияющим на behaviour и доступную модель интерфейса.',
        code: `const report = buildAuditChecklist({
  hasVisibleLabel,
  linksError,
  usesButtonElement,
  hasLandmarks,
});`,
      },
      {
        label: 'test-utils.tsx',
        note: 'Тестовая инфраструктура остаётся минимальной: только router и user-event.',
        code: `return {
  user: userEvent.setup(),
  ...render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>),
};`,
      },
    ],
  },
  architecture: {
    files: [
      {
        path: 'src/components/accessibility/QualityBlueprintLab.tsx',
        note: 'Blueprint lab переводит accessibility из набора советов в архитектурные приоритеты для экрана.',
      },
      {
        path: 'src/pages/ArchitecturePage.tsx',
        note: 'Страница собирает формы, маршруты, диалоги, async status и tests в одну карту качества.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Unit tests фиксируют архитектурные verdicts и не дают предметной модели деградировать.',
      },
    ],
    snippets: [
      {
        label: 'QualityBlueprintLab.tsx',
        note: 'Архитектурная оценка рождается из набора реальных поверхностей интерфейса: формы, nav, dialog, async status, custom widget.',
        code: `const summary = summarizeArchitectureScenario({
  hasForms,
  hasNavigation,
  hasDialog,
  hasCustomWidget,
  hasAsyncStatus,
  testsByBehavior,
});`,
      },
      {
        label: 'learning-model.test.ts',
        note: 'Тест закрепляет, что custom widget должен поднимать приоритет архитектурной accessibility-проверки.',
        code: `expect(
  summarizeArchitectureScenario({
    hasForms: false,
    hasNavigation: true,
    hasDialog: false,
    hasCustomWidget: true,
    hasAsyncStatus: false,
    testsByBehavior: true,
  }).priorities[3],
).toContain('Кастомный widget');`,
      },
    ],
  },
};
