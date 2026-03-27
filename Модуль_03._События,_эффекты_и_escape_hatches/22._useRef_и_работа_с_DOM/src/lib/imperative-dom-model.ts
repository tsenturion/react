import type { StatusTone } from './learning-model';

export type ImperativeDomCase = 'safe' | 'conflict' | 'state-owned';

type ImperativeDomReport = {
  title: string;
  tone: StatusTone;
  summary: string;
  snippet: string;
};

const reports: Record<ImperativeDomCase, ImperativeDomReport> = {
  safe: {
    title: 'Imperative DOM as escape hatch',
    tone: 'success',
    summary:
      'Фокус, scroll и measurement нормально работают imperatively, потому что они направляют уже существующий DOM, а не подменяют источник истины.',
    snippet: [
      'inputRef.current?.focus();',
      'cardRef.current?.scrollIntoView({ behavior: "smooth" });',
    ].join('\n'),
  },
  conflict: {
    title: 'Manual mutation of React-owned DOM',
    tone: 'error',
    summary:
      'Если вы вручную меняете className, textContent или inline style там, где React тоже считает их своими, появляются конфликты и непредсказуемость.',
    snippet: [
      'cardRef.current?.classList.add("ring-4");',
      '// Следующий React render может перезаписать этот DOM вручную.',
    ].join('\n'),
  },
  'state-owned': {
    title: 'Visual state should stay declarative',
    tone: 'warn',
    summary:
      'Если внешний вид зависит от app-state, лучше выразить его через JSX и className, а не через набор ручных DOM-модификаций.',
    snippet: [
      'const toneClass = tone === "alert" ? "bg-amber-100" : "bg-slate-100";',
      'return <div className={toneClass}>{label}</div>;',
    ].join('\n'),
  },
};

export function buildImperativeDomReport(id: ImperativeDomCase) {
  return reports[id];
}

export function willReactOverwriteManualDom(nextRenderChangesClass: boolean) {
  return nextRenderChangesClass;
}
