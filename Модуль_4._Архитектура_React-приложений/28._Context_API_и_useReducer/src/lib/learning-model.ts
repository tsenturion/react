export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'context'
  | 'reducer'
  | 'architecture'
  | 'boundaries'
  | 'strategy'
  | 'container';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
}[] = [
  {
    id: 'context',
    label: '1. Context delivery',
    blurb: 'Когда context помогает убрать prop drilling, а когда он не нужен.',
  },
  {
    id: 'reducer',
    label: '2. useReducer logic',
    blurb: 'Как reducer собирает сложные переходы состояния в одну модель.',
  },
  {
    id: 'architecture',
    label: '3. Context + Reducer',
    blurb: 'Как delivery и update logic соединяются в одну архитектуру.',
  },
  {
    id: 'boundaries',
    label: '4. Provider boundaries',
    blurb: 'Почему границы провайдера важны не меньше самого context.',
  },
  {
    id: 'strategy',
    label: '5. Strategy compare',
    blurb: 'Когда хватит lifting state up, а когда уже нужен Context + Reducer.',
  },
  {
    id: 'container',
    label: '6. Global container',
    blurb: 'Как не превратить всё приложение в один шумный глобальный store.',
  },
] as const;
