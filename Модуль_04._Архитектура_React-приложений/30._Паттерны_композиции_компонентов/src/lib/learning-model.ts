export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'compound'
  | 'render-props'
  | 'hoc'
  | 'children'
  | 'alternatives'
  | 'tradeoffs';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
}[] = [
  {
    id: 'compound',
    label: '1. Compound',
    blurb: 'Как строить связанный API из подкомпонентов с общим состоянием и контрактом.',
  },
  {
    id: 'render-props',
    label: '2. Render props',
    blurb:
      'Как отдавать управление рендерингом наружу, сохраняя логику внутри компонента.',
  },
  {
    id: 'hoc',
    label: '3. HOC',
    blurb: 'Где higher-order components всё ещё полезны, а где уже утяжеляют код.',
  },
  {
    id: 'children',
    label: '4. Children API',
    blurb: 'cloneElement и Children API: сила, ограничения и хрупкие контракты.',
  },
  {
    id: 'alternatives',
    label: '5. Alternatives',
    blurb: 'Как выбирать между паттернами и современными альтернативами.',
  },
  {
    id: 'tradeoffs',
    label: '6. Boundaries',
    blurb:
      'Границы, стоимость и anti-patterns при проектировании гибкого API компонента.',
  },
] as const;
