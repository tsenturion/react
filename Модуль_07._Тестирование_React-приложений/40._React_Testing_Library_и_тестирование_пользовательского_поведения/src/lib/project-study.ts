import type { LabId } from './learning-model';

type ProjectStudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, ProjectStudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/lib/rtl-domain.ts',
        note: 'Здесь лежат guide cards, query targets и smell-карты, из которых строится весь урок.',
      },
      {
        path: 'src/lib/rtl-runtime.ts',
        note: 'Loader overview и pure-функции показывают, что стратегия RTL тоже выражается как предметная модель.',
      },
      {
        path: 'src/pages/OverviewPage.tsx',
        note: 'Страница связывает route-driven filter, guide cards и чтение темы через URL.',
      },
    ],
    snippets: [
      {
        label: 'rtl-runtime.ts',
        note: 'Overview loader получает focus из URL и отдаёт уже готовую модель страницы.',
        code: `export function overviewLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const focus = parseFocus(url.searchParams.get('focus'));

  return {
    focus,
    cards: filterGuidesByFocus(focus),
    requestUrl: \`\${url.pathname}\${url.search}\`,
  };
}`,
      },
      {
        label: 'rtl-domain.ts',
        note: 'Карточка темы описывает не инструмент, а поведенческий слой работы с Testing Library.',
        code: `{
  id: 'query-priority',
  focus: 'queries',
  summary: 'Ищите элемент по роли, имени и лейблу.',
}`,
      },
    ],
  },
  queries: {
    files: [
      {
        path: 'src/components/testing-library/QueryPriorityWorkbench.tsx',
        note: 'Компонент специально показывает роль, label, alert и status как реальные surfaces для RTL queries.',
      },
      {
        path: 'src/components/testing-library/QueryPriorityWorkbench.test.tsx',
        note: 'Тест проверяет доступные роли и пользовательский результат, а не внутренний state.',
      },
      {
        path: 'src/lib/rtl-runtime.ts',
        note: 'Функция `recommendPrimaryQuery` объясняет, почему выбран именно такой query.',
      },
    ],
    snippets: [
      {
        label: 'QueryPriorityWorkbench.tsx',
        note: 'Live surface намеренно построен на семантических элементах, а не на div-обёртках.',
        code: `<label htmlFor="report-email">
  <span>Email для отчёта</span>
  <input id="report-email" type="email" />
</label>`,
      },
      {
        label: 'QueryPriorityWorkbench.test.tsx',
        note: 'Тест ищет элементы через роль и label, а не через CSS-структуру.',
        code: `expect(
  screen.getByRole('button', { name: 'Сохранить фильтр' }),
).toBeInTheDocument();
expect(screen.getByLabelText('Email для отчёта')).toBeInTheDocument();`,
      },
    ],
  },
  interactions: {
    files: [
      {
        path: 'src/components/testing-library/InteractionSequenceLab.tsx',
        note: 'Компонент показывает, как одно пользовательское действие приводит к отложенному видимому результату.',
      },
      {
        path: 'src/components/testing-library/InteractionSequenceLab.test.tsx',
        note: 'Тест идёт через `userEvent` и ждёт `status`, а не читает промежуточный private flag.',
      },
      {
        path: 'src/lib/rtl-runtime.ts',
        note: 'Функция `recommendInteractionAssertion` моделирует выбор между sync и async behavior assertion.',
      },
    ],
    snippets: [
      {
        label: 'InteractionSequenceLab.tsx',
        note: 'Отложенный баннер нужен именно для observable async outcome, который видит пользователь.',
        code: `timeoutRef.current = window.setTimeout(() => {
  setAnnouncement(\`Фильтр "\${query.trim()}" применён.\`);
  setPending(false);
}, 120);`,
      },
      {
        label: 'InteractionSequenceLab.test.tsx',
        note: 'Тест отражает реальный сценарий: открыть, ввести, применить, дождаться статуса.',
        code: `await user.click(screen.getByRole('button', { name: 'Открыть фильтры' }));
await user.type(screen.getByLabelText('Поисковая строка'), 'rtl');
await user.click(screen.getByRole('button', { name: 'Применить фильтр' }));

expect(await screen.findByRole('status')).toHaveTextContent(/rtl/i);`,
      },
    ],
  },
  forms: {
    files: [
      {
        path: 'src/components/testing-library/FeedbackFormLab.tsx',
        note: 'Форма специально строится вокруг полей, alerts и status, а не вокруг внутренних validator hooks.',
      },
      {
        path: 'src/components/testing-library/FeedbackFormLab.test.tsx',
        note: 'Тест проходит через invalid submit и затем через валидный сценарий ввода.',
      },
      {
        path: 'src/lib/rtl-runtime.ts',
        note: 'Функция `evaluateFormCoverage` показывает, какие состояния форма ещё не покрывает.',
      },
    ],
    snippets: [
      {
        label: 'FeedbackFormLab.tsx',
        note: 'Ошибки и успех выводятся как доступные роли, которые реально видит пользователь.',
        code: `{errorList.map((item) => (
  <p key={item} role="alert">
    {item}
  </p>
))}`,
      },
      {
        label: 'FeedbackFormLab.test.tsx',
        note: 'Тест проверяет и alerts, и success-state после реального ввода.',
        code: `await user.click(screen.getByRole('button', { name: 'Отправить сценарий' }));
expect(screen.getAllByRole('alert').length).toBeGreaterThan(1);

expect(screen.getByRole('status')).toHaveTextContent(/review/i);`,
      },
    ],
  },
  'custom-render': {
    files: [
      {
        path: 'src/test/test-utils.tsx',
        note: 'Здесь лежит focused custom render helper с router и provider.',
      },
      {
        path: 'src/state/LessonTestPreferencesContext.tsx',
        note: 'Provider нужен и живой лаборатории, и тестам, поэтому helper не абстрактный, а проектный.',
      },
      {
        path: 'src/components/testing-library/ProviderHarnessLab.test.tsx',
        note: 'Тест использует helper и показывает, как setup становится короче, не теряя смысл сценария.',
      },
    ],
    snippets: [
      {
        label: 'test-utils.tsx',
        note: 'Helper скрывает только повторяемую инфраструктуру, а не пользовательский сценарий.',
        code: `return {
  user,
  ...render(
    <MemoryRouter initialEntries={[route]}>
      <LessonTestPreferencesProvider initialState={preferenceState}>
        {ui}
      </LessonTestPreferencesProvider>
    </MemoryRouter>,
  ),
};`,
      },
      {
        label: 'ProviderHarnessLab.test.tsx',
        note: 'Тест сразу описывает route и состояние provider, не дублируя boilerplate в каждом кейсе.',
        code: `const { user } = renderWithLessonProviders(<ProviderHarnessLab />, {
  route: '/custom-render?tab=providers',
  preferenceState: { density: 'compact', reviewMode: 'strict' },
});`,
      },
    ],
  },
  'anti-patterns': {
    files: [
      {
        path: 'src/lib/rtl-domain.ts',
        note: 'Smell-карты формулируют реальные anti-patterns в терминах поведения теста.',
      },
      {
        path: 'src/lib/rtl-runtime.ts',
        note: 'Функция `evaluateTestingSmell` помогает увидеть, когда тест уже ушёл в implementation details.',
      },
      {
        path: 'src/pages/AntiPatternsPage.tsx',
        note: 'Интерактивная страница собирает smell-профиль и показывает, как он влияет на итоговый verdict.',
      },
    ],
    snippets: [
      {
        label: 'rtl-runtime.ts',
        note: 'Smell verdict считается как явная модель, а не как неявное мнение в тексте.',
        code: `if (smellScore >= 35) {
  return {
    verdict: 'implementation-centric',
    betterApproach:
      'Перестройте тест вокруг роли, текста и пользовательского действия.',
  };
}`,
      },
      {
        label: 'AntiPatternsPage.tsx',
        note: 'Лаборатория не спорит абстрактно, а позволяет собрать smell-профиль руками.',
        code: `const recommendation = useMemo(
  () => evaluateTestingSmell(input),
  [input],
);`,
      },
    ],
  },
};
