export type StatusTone = 'success' | 'warn' | 'error';

export type LabId = 'flux' | 'store' | 'flow' | 'compare' | 'tradeoffs' | 'architecture';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
}[] = [
  {
    id: 'flux',
    label: '1. Flux loop',
    blurb: 'Как событие превращается в action, reducer и новое состояние.',
  },
  {
    id: 'store',
    label: '2. Redux store',
    blurb: 'Централизованное состояние, actions, reducers и selectors в реальном коде.',
  },
  {
    id: 'flow',
    label: '3. One-way flow',
    blurb: 'Почему однонаправленный поток данных полезен на уровне приложения.',
  },
  {
    id: 'compare',
    label: '4. Context vs Redux',
    blurb: 'Когда хватит context, а когда уже нужна централизованная модель.',
  },
  {
    id: 'tradeoffs',
    label: '5. Overkill check',
    blurb: 'Когда Redux действительно нужен, а когда он создаёт лишний слой.',
  },
  {
    id: 'architecture',
    label: '6. Mental shift',
    blurb: 'Как меняются структура кода и способ мышления при переходе к store.',
  },
] as const;
