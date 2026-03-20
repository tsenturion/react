import type { ScrollBehaviorMode, ScrollBlockMode } from './ref-domain';
import type { StatusTone } from './learning-model';

export type ScrollCase = 'scroll-into-view' | 'ref-map' | 'window-scroll';

type ScrollReport = {
  title: string;
  tone: StatusTone;
  summary: string;
  snippet: string;
};

const reports: Record<ScrollCase, ScrollReport> = {
  'scroll-into-view': {
    title: 'Element ref + scrollIntoView',
    tone: 'success',
    summary:
      'Когда target уже существует в DOM, ref даёт прямой доступ к нему без глобального поиска по document.',
    snippet: [
      'cardRef.current?.scrollIntoView({',
      '  behavior: "smooth",',
      '  block: "center",',
      '});',
    ].join('\n'),
  },
  'ref-map': {
    title: 'Collection of refs',
    tone: 'success',
    summary:
      'Для списка удобно хранить map из id в DOM-узлы, чтобы прокрутка оставалась привязанной к данным, а не к querySelector.',
    snippet: [
      'const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});',
      'itemRefs.current[id]?.scrollIntoView({ behavior, block });',
    ].join('\n'),
  },
  'window-scroll': {
    title: 'Global window scroll as fallback',
    tone: 'warn',
    summary:
      'Глобальный scroll допустим, но он хуже отражает структуру дерева компонентов и хуже связывается с конкретным DOM-узлом.',
    snippet: ['window.scrollTo({ top: 0, behavior: "smooth" });'].join('\n'),
  },
};

export function buildScrollReport(id: ScrollCase) {
  return reports[id];
}

export function describeScrollOptions(
  behavior: ScrollBehaviorMode,
  block: ScrollBlockMode,
) {
  return `${behavior} / ${block}`;
}
