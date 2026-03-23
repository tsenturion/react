import type { LabId } from './learning-model';

type ProjectStudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, ProjectStudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/lib/testing-domain.ts',
        note: 'Здесь лежит карта test layers и кандидатных пользовательских путей, вокруг которых строится весь урок.',
      },
      {
        path: 'src/lib/testing-runtime.ts',
        note: 'Loader overview и стратегические pure-функции показывают, что тестовая стратегия может выражаться как предметная модель.',
      },
      {
        path: 'src/pages/OverviewPage.tsx',
        note: 'Страница связывает route-driven filter, карточки слоёв тестирования и логику чтения темы через URL.',
      },
    ],
    snippets: [
      {
        label: 'testing-runtime.ts',
        note: 'Overview loader получает focus из request URL и отдаёт уже готовую модель страницы.',
        code: `export async function overviewLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const focus = parseFocus(url.searchParams.get('focus'));
  const cards = filterGuidesByFocus(focus);

  return {
    focus,
    cards,
    requestUrl: \`\${url.pathname}\${url.search}\`,
  };
}`,
      },
      {
        label: 'testing-domain.ts',
        note: 'Каждый тестовый слой описан как отдельная смысловая сущность, а не как просто инструмент.',
        code: `export const testingGuides: readonly TestingGuide[] = [
  {
    id: 'component-behavior',
    focus: 'component',
    summary: 'Проверяют поведение одного компонента через доступный UI.',
  },
];`,
      },
    ],
  },
  unit: {
    files: [
      {
        path: 'src/lib/testing-runtime.ts',
        note: 'Функция `recommendUnitStrategy` моделирует, когда unit-first подход действительно оправдан.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Здесь идут unit tests pure-логики урока: фильтрация, рекомендации и архитектурные решения.',
      },
      {
        path: 'src/pages/UnitStrategyPage.tsx',
        note: 'Лаборатория хранит только входные признаки и показывает результат через pure recommendation.',
      },
    ],
    snippets: [
      {
        label: 'testing-runtime.ts',
        note: 'Unit recommendation зависит от свойств сценария, а не от личных предпочтений по инструментам.',
        code: `if (positiveSignals >= 4) {
  return {
    model: 'Unit-first',
    score: 93,
  };
}`,
      },
      {
        label: 'learning-model.test.ts',
        note: 'Реальный unit test проверяет результат рекомендации, а не внутренние шаги вычисления.',
        code: `expect(
  recommendUnitStrategy({
    pureLogic: true,
    branching: true,
    deterministic: true,
    uiFree: true,
    expensiveSetup: false,
    crossBrowser: false,
  }).model,
).toBe('Unit-first');`,
      },
    ],
  },
  component: {
    files: [
      {
        path: 'src/components/testing-strategy/BehaviorWorkbench.tsx',
        note: 'Компонент специально построен так, чтобы тестировать его через лейблы, доступный UI, disabled state и visible feedback.',
      },
      {
        path: 'src/components/testing-strategy/BehaviorWorkbench.test.tsx',
        note: 'Component tests работают через `userEvent`, роли и user-visible поведение, а не через внутренний state.',
      },
      {
        path: 'src/pages/ComponentBehaviorPage.tsx',
        note: 'Страница объясняет, что именно должен утверждать behavior-first component test.',
      },
    ],
    snippets: [
      {
        label: 'BehaviorWorkbench.tsx',
        note: 'Компонент даёт доступный surface для теста: label, checkbox, disabled button и status banner.',
        code: `<input
  aria-label="Название сценария"
  type="text"
  value={title}
  onChange={(event) => {
    markDirty();
    setTitle(event.target.value);
  }}
/>`,
      },
      {
        label: 'BehaviorWorkbench.test.tsx',
        note: 'Тест утверждает наблюдаемое поведение: кнопка включается после действий и появляется статус.',
        code: `await user.click(screen.getByLabelText('Есть воспроизводимые шаги'));
await user.click(screen.getByRole('button', { name: 'Сохранить сценарий' }));

expect(screen.getByRole('status')).toHaveTextContent(
  /сценарий сохранён для regression pack/i,
);`,
      },
    ],
  },
  integration: {
    files: [
      {
        path: 'src/components/testing-strategy/ReleaseWorkbench.tsx',
        note: 'Этот mini-flow связывает scope, набор checks, риск и итоговый verdict внутри одного UI.',
      },
      {
        path: 'src/integration/release-workbench.test.tsx',
        note: 'Integration test проходит через несколько действий и проверяет итоговую согласованность интерфейса.',
      },
      {
        path: 'src/lib/testing-runtime.ts',
        note: 'Pure-функция `assessReleasePlan` остаётся основанием для workflow, но integration test смотрит уже на целый сценарий.',
      },
    ],
    snippets: [
      {
        label: 'ReleaseWorkbench.tsx',
        note: 'Integration surface строится вокруг нескольких взаимосвязанных controls и release log.',
        code: `const plan = useMemo(
  () =>
    assessReleasePlan({
      scope,
      selectedChecks,
      hasUserVisibleRisk,
      usesNetwork,
    }),
  [scope, selectedChecks, hasUserVisibleRisk, usesNetwork],
);`,
      },
      {
        label: 'release-workbench.test.tsx',
        note: 'Тест не знает внутреннего `plan`, а проверяет, как пользователь доводит сценарий до готового релиза.',
        code: `await user.click(screen.getByRole('radio', { name: 'critical' }));
await user.click(screen.getByRole('button', { name: 'integration' }));
await user.click(screen.getByRole('button', { name: 'e2e' }));

expect(screen.getByRole('button', { name: 'Подтвердить релиз' })).toBeEnabled();`,
      },
    ],
  },
  e2e: {
    files: [
      {
        path: 'playwright.config.ts',
        note: 'Playwright config показывает, что E2E живёт отдельно от Vitest-слоя и использует собственный browser runner.',
      },
      {
        path: 'tests/e2e/testing-strategy.spec.ts',
        note: 'В проекте есть реальный E2E spec с пользовательскими путями через routes и UI.',
      },
      {
        path: 'src/pages/E2EJourneysPage.tsx',
        note: 'Лаборатория объясняет, почему E2E нужен точечно и какие сигналы говорят в его пользу.',
      },
    ],
    snippets: [
      {
        label: 'playwright.config.ts',
        note: 'E2E слой запускается отдельно и при желании поднимает dev server сам.',
        code: `export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
  },
});`,
      },
      {
        label: 'tests/e2e/testing-strategy.spec.ts',
        note: 'E2E spec работает через реальные роли, поля и кнопки маршрутов проекта.',
        code: `await page.goto('/component-behavior');
await page.getByLabel('Есть воспроизводимые шаги').check();
await page.getByRole('button', { name: 'Сохранить сценарий' }).click();`,
      },
    ],
  },
  architecture: {
    files: [
      {
        path: 'src/lib/testing-runtime.ts',
        note: 'Функция `recommendTestingArchitecture` показывает распределение confidence по слоям по мере роста приложения.',
      },
      {
        path: 'src/pages/ArchitecturePage.tsx',
        note: 'Интерактивный advisor меняет стратегическую модель по признакам продукта и команды.',
      },
      {
        path: 'src/router.tsx',
        note: 'Сам lesson shell уже показывает route-driven структуру, где разные лаборатории соответствуют разным слоям test strategy.',
      },
    ],
    snippets: [
      {
        label: 'testing-runtime.ts',
        note: 'Архитектурная рекомендация выражена как чистая функция, а не как набор неявных советов в тексте.',
        code: `if (input.browserDependent && input.criticalFlows) {
  return {
    model: 'Layered strategy with targeted E2E',
    score: 92,
  };
}`,
      },
      {
        label: 'ArchitecturePage.tsx',
        note: 'Лаборатория хранит только признаки сценария, а вывод получает через pure-model recommendation.',
        code: `const recommendation = useMemo(
  () => recommendTestingArchitecture(input),
  [input],
);`,
      },
    ],
  },
};
