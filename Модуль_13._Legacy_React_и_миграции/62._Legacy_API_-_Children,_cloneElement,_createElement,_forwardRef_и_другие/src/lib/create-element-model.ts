export type LegacyBlock = {
  id: string;
  kind: 'metric' | 'note' | 'list';
  title: string;
  body: string;
};

export type LegacyLayout = 'section' | 'article' | 'aside';

export const baseBlocks: readonly LegacyBlock[] = [
  {
    id: 'children',
    kind: 'metric',
    title: 'Opaque children',
    body: 'Children APIs работают с input tree, а не с результатом render.',
  },
  {
    id: 'clone',
    kind: 'note',
    title: 'cloneElement risk',
    body: 'Неявное расширение props даёт мощность, но делает API менее прозрачным.',
  },
  {
    id: 'refs',
    kind: 'list',
    title: 'Refs path',
    body: 'createRef -> forwardRef -> ref-as-prop.',
  },
] as const;

export function describeFactoryState(layout: LegacyLayout, showFooter: boolean): string {
  return `${layout} factory tree${showFooter ? ' с footer branch' : ' без footer branch'}`;
}

export function buildFactorySnippet(
  layout: LegacyLayout,
  emphasize: boolean,
  showFooter: boolean,
): string {
  return `return createElement(
  '${layout}',
  { className: '${emphasize ? 'highlighted-root' : 'plain-root'}' },
  createElement('header', null, 'Legacy API dashboard'),
  blocks.map((block) => renderLegacyBlock(block)),
  ${showFooter ? "createElement('footer', null, 'Factory footer')" : 'null'},
);`;
}

export const createElementGuardrails = [
  'Если tree заранее известен, JSX почти всегда читабельнее createElement.',
  'createElement уместен там, где UI приходит из registry, descriptor-модели или code generation.',
  'Низкоуровневость API полезна для понимания React, но не оправдывает избыточную ручную запись.',
] as const;
