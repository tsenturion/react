import type { LabId } from './learning-model';

type ProjectStudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, ProjectStudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/lib/async-testing-domain.ts',
        note: 'Здесь лежат guide cards, setup cards и smell-карты, из которых строится вся карта урока.',
      },
      {
        path: 'src/lib/async-testing-runtime.ts',
        note: 'Loader overview и pure-функции показывают, что выбор async test strategy выражается как предметная модель.',
      },
      {
        path: 'src/router.tsx',
        note: 'Lesson shell, навигация лабораторий и route-driven filter собирают тему в одно приложение.',
      },
    ],
    snippets: [
      {
        label: 'async-testing-runtime.ts',
        note: 'Overview loader получает focus из URL и отдаёт уже готовую модель страницы.',
        code: `export function overviewLoader({ request }: LoaderFunctionArgs): OverviewLoaderData {
  const url = new URL(request.url);
  const focus = parseFocus(url.searchParams.get('focus'));

  return {
    focus,
    guides: filterGuidesByFocus(focus),
    setupCards,
  };
}`,
      },
      {
        label: 'async-testing-domain.ts',
        note: 'Карточка темы описывает не абстрактный инструмент, а практическую границу async testing.',
        code: `{
  id: 'mocked-http',
  focus: 'http-mocks',
  summary: 'Запрос удобнее подменять на границе fetch или client adapter.',
}`,
      },
    ],
  },
  waiting: {
    files: [
      {
        path: 'src/components/async-testing/AsyncResourceLab.tsx',
        note: 'Компонент проходит через loading, error, empty и success и защищён от stale result при быстрой смене сценария.',
      },
      {
        path: 'src/components/async-testing/AsyncResourceLab.test.tsx',
        note: 'Тест проверяет loading и новый запрос после rerender с другим resource key.',
      },
      {
        path: 'src/test/deferred.ts',
        note: 'Deferred helper делает порядок завершения Promise явным и не требует реальных ожиданий по времени.',
      },
    ],
    snippets: [
      {
        label: 'AsyncResourceLab.tsx',
        note: 'Последний request побеждает: это защищает и UI, и тест от запоздавшего старого ответа.',
        code: `const requestId = latestRequestRef.current + 1;
latestRequestRef.current = requestId;

void loadRecords(scenario, resourceKey).then((nextRecords) => {
  if (latestRequestRef.current !== requestId) {
    return;
  }

  setRecords(nextRecords);
  setStatus(nextRecords.length > 0 ? 'success' : 'empty');
});`,
      },
      {
        label: 'AsyncResourceLab.test.tsx',
        note: 'Тест двигает сценарий через rerender и ждёт новый наблюдаемый результат.',
        code: `rerender(<AsyncResourceLab resourceKey="beta" loadRecords={loadRecords} />);

expect(screen.getByRole('status')).toHaveTextContent('Загрузка сценария');

secondRequest.resolve([
  {
    id: 'beta-visible-state',
    title: 'Beta result',
    note: 'Новый ключ вызвал новый async flow.',
  },
]);`,
      },
    ],
  },
  'http-mocks': {
    files: [
      {
        path: 'src/components/async-testing/MockedHttpLab.tsx',
        note: 'Компонент использует реальный fetch-helper и делает retry через ту же HTTP-границу.',
      },
      {
        path: 'src/lib/async-testing-http.ts',
        note: 'HTTP helper выделяет границу между React-компонентом и внешним fetch/API контрактом.',
      },
      {
        path: 'src/test/mock-fetch.ts',
        note: 'Mock helpers подменяют fetch глобально, но не вмешиваются во внутреннюю UI-логику компонента.',
      },
    ],
    snippets: [
      {
        label: 'async-testing-http.ts',
        note: 'HTTP helper проверяет и статус ответа, и форму payload до того, как данные попадут в UI.',
        code: `const response = await fetch(endpoint, { signal });

if (!response.ok) {
  throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
}

const payload: unknown = await response.json();`,
      },
      {
        label: 'MockedHttpLab.test.tsx',
        note: 'Сначала приходит контролируемая ошибка, затем успешный retry через тот же пользовательский поток.',
        code: `await user.click(screen.getByRole('button', { name: 'Загрузить через fetch' }));
expect(await screen.findByRole('alert')).toHaveTextContent('HTTP 503');

await user.click(screen.getByRole('button', { name: 'Повторить запрос' }));
expect(await screen.findByText('Повторный запрос после ошибки')).toBeInTheDocument();`,
      },
    ],
  },
  providers: {
    files: [
      {
        path: 'src/components/async-testing/ProviderHarnessLab.tsx',
        note: 'Компонент одновременно читает route и context, поэтому для теста ему нужен focused provider harness.',
      },
      {
        path: 'src/state/AsyncTestHarnessContext.tsx',
        note: 'Provider хранит assertion mode и network mode и показывает, что test harness имеет собственный контракт.',
      },
      {
        path: 'src/test/test-utils.tsx',
        note: 'Custom render helper поднимает только MemoryRouter и provider, не превращаясь в скрытый mini-framework.',
      },
    ],
    snippets: [
      {
        label: 'test-utils.tsx',
        note: 'Helper скрывает только повторяемую инфраструктуру, а пользовательский сценарий остаётся явным в тесте.',
        code: `return {
  user: userEvent.setup(),
  ...render(
    <MemoryRouter initialEntries={[route]}>
      <AsyncTestHarnessProvider initialState={harnessState}>
        {ui}
      </AsyncTestHarnessProvider>
    </MemoryRouter>,
  ),
};`,
      },
      {
        label: 'ProviderHarnessLab.test.tsx',
        note: 'Тест явно задаёт route и provider state, но не повторяет boilerplate в каждом сценарии.',
        code: `const { user } = renderWithAsyncProviders(<ProviderHarnessLab />, {
  route: '/providers-and-context?tab=retry',
  harnessState: {
    assertionMode: 'isolated',
    networkMode: 'mocked-http',
  },
});`,
      },
    ],
  },
  environment: {
    files: [
      {
        path: 'src/components/async-testing/PollingEnvironmentLab.tsx',
        note: 'Polling-компонент показывает, зачем fake timers и cleanup должны быть частью общего test environment.',
      },
      {
        path: 'src/components/async-testing/PollingEnvironmentLab.test.tsx',
        note: 'Тест двигает время вручную и проверяет, что после остановки polling счётчик больше не растёт.',
      },
      {
        path: 'vitest.setup.ts',
        note: 'Общий setup очищает DOM, восстанавливает mocks и возвращает real timers после каждого теста.',
      },
      {
        path: 'vitest.config.ts',
        note: 'Vitest конфиг фиксирует jsdom, globals и setup file как часть тестового окружения.',
      },
    ],
    snippets: [
      {
        label: 'PollingEnvironmentLab.tsx',
        note: 'Идентификатор таймера хранится в ref, чтобы cleanup оставался надёжным и не зависел от stale closure.',
        code: `intervalIdRef.current = window.setInterval(() => {
  setTicks((current) => current + 1);
}, intervalMs);

useEffect(() => stopPolling, []);`,
      },
      {
        label: 'vitest.setup.ts',
        note: 'Reset среды после каждого теста удерживает async suite независимым от порядка запуска файлов.',
        code: `afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});`,
      },
    ],
  },
  'anti-fragility': {
    files: [
      {
        path: 'src/lib/async-testing-domain.ts',
        note: 'Smell-карты описывают sleep, leaking environment и over-mocking как реальные источники хрупкости.',
      },
      {
        path: 'src/lib/async-testing-runtime.ts',
        note: 'Функции оценки стратегии и smell-профиля позволяют увидеть, где тест перестаёт быть устойчивым.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Unit tests проверяют сами правила урока: разбор route, mock strategy, provider harness и environment verdict.',
      },
    ],
    snippets: [
      {
        label: 'async-testing-runtime.ts',
        note: 'Smell verdict считается как явная модель, а не как расплывчатая текстовая рекомендация.',
        code: `const issues = [
  input.usesSleep && 'Тест ждёт время, а не результат.',
  input.assertsImplementation &&
    'Тест фиксирует детали реализации вместо пользовательского сценария.',
].filter(Boolean) as string[];`,
      },
      {
        label: 'learning-model.test.ts',
        note: 'Тест фиксирует, что хрупкая стратегия определяется по observable признакам, а не по внутренним вызовам.',
        code: `expect(
  evaluateTestingSmell({
    usesSleep: true,
    assertsImplementation: true,
    leaksEnvironment: true,
    overMocks: false,
  }).severity,
).toBe('Высокая хрупкость');`,
      },
    ],
  },
};
