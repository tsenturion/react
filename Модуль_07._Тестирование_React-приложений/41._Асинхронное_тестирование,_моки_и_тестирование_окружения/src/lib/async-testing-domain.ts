import type { LabId } from './learning-model';

export type GuideFocus =
  | 'all'
  | 'async-ui'
  | 'http-mocks'
  | 'providers'
  | 'environment'
  | 'anti-fragility';

export type MockScope = 'unit' | 'component' | 'integration';
export type AsyncScenario = 'success' | 'empty' | 'error';

export type AsyncGuide = {
  id: string;
  focus: Exclude<GuideFocus, 'all'>;
  title: string;
  summary: string;
  practicalUse: string;
  trap: string;
};

export type SetupCard = {
  id: string;
  title: string;
  summary: string;
};

export type SmellCard = {
  id: string;
  title: string;
  symptom: string;
  risk: string;
  better: string;
};

export type AsyncRecord = {
  id: string;
  title: string;
  note: string;
};

export const asyncGuides: readonly AsyncGuide[] = [
  {
    id: 'visible-states',
    focus: 'async-ui',
    title: 'Видимые async-состояния',
    summary:
      'Тест должен проходить через loading, error, empty и success так же, как это делает интерфейс.',
    practicalUse:
      'Такой тест выдерживает реальный ререндер и не ломается из-за внутренней перестройки state.',
    trap: 'Если пропустить loading/error, тест начинает проверять только счастливый путь и даёт ложное чувство надёжности.',
  },
  {
    id: 'mocked-http',
    focus: 'http-mocks',
    title: 'Моки HTTP на уровне границы',
    summary:
      'Запрос удобнее подменять на границе fetch или client adapter, а не в середине UI-логики.',
    practicalUse:
      'Так проще тестировать retries, ошибку сети и повторную загрузку без реального сервера.',
    trap: 'Слишком глубокий mock внутренних функций делает тест зависимым от реализации, а не от пользовательского поведения.',
  },
  {
    id: 'provider-harness',
    focus: 'providers',
    title: 'Provider-aware render helper',
    summary:
      'Компоненты с context и router лучше рендерить через маленький helper, а не дублировать обёртки в каждом тесте.',
    practicalUse:
      'Тест остаётся коротким, но всё ещё показывает route, search params и значение контекста как часть сценария.',
    trap: 'Слишком большой helper скрывает смысл теста и превращается в неочевидный mini-framework.',
  },
  {
    id: 'test-environment',
    focus: 'environment',
    title: 'Test environment как часть архитектуры',
    summary:
      'setup file, cleanup, reset timers и restore mocks предотвращают протекание состояния между тестами.',
    practicalUse:
      'Это особенно важно для polling, delayed UI и глобальных stub вроде fetch.',
    trap: 'Если окружение не сбрасывается, баги появляются только при полном прогоне набора тестов и их сложно локализовать.',
  },
  {
    id: 'anti-fragility',
    focus: 'anti-fragility',
    title: 'Как не делать async tests хрупкими',
    summary:
      'sleep, ручные pause и чтение внутренних callback-вызовов делают тесты медленными и ложно-зелёными.',
    practicalUse:
      'Лучше ждать наблюдаемый DOM-result и выбирать инструмент синхронизации под реальный контракт интерфейса.',
    trap: 'Когда тест зависит от времени, а не от видимого результата, он начинает флакать при любом изменении нагрузки.',
  },
] as const;

export const setupCards: readonly SetupCard[] = [
  {
    id: 'cleanup',
    title: 'cleanup и restore',
    summary:
      'После каждого теста нужно очищать DOM, mocks и timers, чтобы сценарии не влияли друг на друга.',
  },
  {
    id: 'custom-render',
    title: 'custom render helper',
    summary:
      'Router и providers удобно поднимать один раз, но helper должен скрывать только повторяемый шум.',
  },
  {
    id: 'visible-assertions',
    title: 'visible assertions',
    summary:
      'Асинхронность связывается не с setState, а с тем, что пользователь реально видит на экране.',
  },
] as const;

export const smellCards: readonly SmellCard[] = [
  {
    id: 'sleep',
    title: 'Фиксированный sleep',
    symptom: 'Тест ждёт 500ms, а не конкретный DOM-result.',
    risk: 'При ускорении или замедлении окружения такой тест начинает флакать.',
    better:
      'Ждите loading, alert, status или появление нужной сущности через findBy/waitFor.',
  },
  {
    id: 'implementation',
    title: 'Implementation assertions',
    symptom: 'Проверяются внутренние callback-вызовы и private state вместо интерфейса.',
    risk: 'Рефакторинг компонента ломает тест даже без изменения поведения.',
    better:
      'Фиксируйте видимое состояние, текст, доступные роли и последствия действий пользователя.',
  },
  {
    id: 'leaking-environment',
    title: 'Протекающее окружение',
    symptom: 'Моки и таймеры сохраняются между тестами.',
    risk: 'Порядок запуска файлов начинает влиять на результат прогона.',
    better:
      'Сбрасывайте окружение в `vitest.setup.ts` и не держите глобальные side effects дольше одного теста.',
  },
  {
    id: 'over-mocking',
    title: 'Чрезмерный mock',
    symptom: 'Тест знает больше о слоях инфраструктуры, чем о пользовательском сценарии.',
    risk: 'Выигрыш по скорости оборачивается потерей доверия к тесту.',
    better:
      'Мокайте сетевую границу или provider contract, а не каждую внутреннюю функцию по отдельности.',
  },
] as const;

export const demoRecords: Record<
  Exclude<AsyncScenario, 'error'>,
  readonly AsyncRecord[]
> = {
  success: [
    {
      id: 'wait-for-ui',
      title: 'Ожидать видимый результат',
      note: 'Проверка должна завершаться не таймером, а появлением DOM-контракта.',
    },
    {
      id: 'reset-after-test',
      title: 'Сбрасывать test environment',
      note: 'Очистка timers и mocks удерживает suite устойчивым при полном прогоне.',
    },
  ],
  empty: [],
};

export function describeLabFromPath(pathname: string): LabId {
  if (pathname.includes('loading-and-waiting')) {
    return 'waiting';
  }

  if (pathname.includes('mocked-http')) {
    return 'http-mocks';
  }

  if (pathname.includes('providers-and-context')) {
    return 'providers';
  }

  if (pathname.includes('test-environment')) {
    return 'environment';
  }

  if (pathname.includes('anti-fragility')) {
    return 'anti-fragility';
  }

  return 'overview';
}

export function filterGuidesByFocus(focus: GuideFocus): readonly AsyncGuide[] {
  if (focus === 'all') {
    return asyncGuides;
  }

  return asyncGuides.filter((guide) => guide.focus === focus);
}
