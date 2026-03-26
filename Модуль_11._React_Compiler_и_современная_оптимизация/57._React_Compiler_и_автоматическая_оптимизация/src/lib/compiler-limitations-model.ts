export type LimitationId =
  | 'impure-render'
  | 'mutable-props'
  | 'context-blast-radius'
  | 'incompatible-library'
  | 'architecture-gap';

export type LimitationCase = {
  readonly id: LimitationId;
  readonly title: string;
  readonly helpLevel: 'none' | 'partial' | 'strong';
  readonly compilerOutcome: string;
  readonly why: string;
  readonly fix: string;
  readonly beforeSnippet: string;
  readonly afterSnippet: string;
};

const limitationCases: Record<LimitationId, LimitationCase> = {
  'impure-render': {
    id: 'impure-render',
    title: 'Impure render logic',
    helpLevel: 'none',
    compilerOutcome:
      'Компилятор пропустит оптимизацию: рендер зависит от побочного действия и не остаётся чистой функцией от props/state.',
    why: 'Если компонент пишет во внешний объект, мутирует ref в render ради данных или полагается на время/случайность, compiler cannot prove safety.',
    fix: 'Верните чистоту: вынесите side effects в event handlers/effects и оставьте render только синхронизацией JSX с состоянием.',
    beforeSnippet: `function ClockCard() {
  auditStore.lastRender = Date.now();
  return <div>{auditStore.lastRender}</div>;
}`,
    afterSnippet: `function ClockCard({ timestamp }: { timestamp: number }) {
  return <div>{timestamp}</div>;
}`,
  },
  'mutable-props': {
    id: 'mutable-props',
    title: 'Mutable props and shared objects',
    helpLevel: 'none',
    compilerOutcome:
      'Автоматическая мемоизация ломается, когда один и тот же объект меняют по месту вместо создания нового значения.',
    why: 'Compiler опирается на предсказуемость значений. In-place mutation размывает границу между “старым” и “новым” состоянием.',
    fix: 'Перейдите к immutable updates и перестаньте передавать shared mutable containers через props.',
    beforeSnippet: `function toggleCard(card: Card) {
  card.selected = !card.selected;
  return card;
}`,
    afterSnippet: `function toggleCard(card: Card) {
  return { ...card, selected: !card.selected };
}`,
  },
  'context-blast-radius': {
    id: 'context-blast-radius',
    title: 'Context blast radius',
    helpLevel: 'partial',
    compilerOutcome:
      'Compiler может оптимизировать локальные subtree, но не отменит глобальный re-render storm от oversized provider.',
    why: 'Если один provider несёт слишком много state и обновляется часто, работа распространяется по дереву до того, как включается автоматическая мемоизация.',
    fix: 'Разделите provider boundaries, colocate state и не держите unrelated values в одном frequently changing context.',
    beforeSnippet: `const AppContext = createContext({
  filters,
  theme,
  auth,
  panelDraft,
  hoveredRowId,
});`,
    afterSnippet: `const FiltersContext = createContext(filters);
const ThemeContext = createContext(theme);
const DraftContext = createContext(panelDraft);`,
  },
  'incompatible-library': {
    id: 'incompatible-library',
    title: 'Incompatible third-party library',
    helpLevel: 'partial',
    compilerOutcome:
      'Compiler-friendly component может существовать рядом с library boundary, но hidden mutation или imperative subscriptions всё равно ограничат эффект.',
    why: 'Некоторые библиотеки требуют stable callback identity вручную, мутируют входные объекты или зависят от imperative lifecycle.',
    fix: 'Локализуйте boundary, добавьте adapter layer и не смешивайте impurity library с остальным compiler-friendly деревом.',
    beforeSnippet: `widget.mount({
  config,
  onChange: () => syncSelection(widget.getSelection()),
});`,
    afterSnippet: `const widgetAdapter = createWidgetAdapter(widget);
widgetAdapter.mount({
  config,
  onSelectionChange: handleSelectionChange,
});`,
  },
  'architecture-gap': {
    id: 'architecture-gap',
    title: 'Architecture gap',
    helpLevel: 'none',
    compilerOutcome:
      'Compiler не исправит network waterfall, гигантский список без virtualization и тяжёлый effect chain.',
    why: 'Это не проблема references identity, а проблема того, где живут данные, как бьётся экран и какая работа реально выполняется.',
    fix: 'Оптимизируйте architecture: split routes, move state closer, defer heavy work и уберите лишние запросы.',
    beforeSnippet: `useEffect(() => {
  fetchSummary();
  fetchRows();
  fetchAudit();
}, [projectId]);`,
    afterSnippet: `const summaryQuery = useSummaryQuery(projectId);
const rowsQuery = useRowsQuery(projectId);
const auditQuery = useAuditQuery(projectId);`,
  },
};

export function getLimitationCase(id: LimitationId): LimitationCase {
  return limitationCases[id];
}

export function listLimitationCases(): readonly LimitationCase[] {
  return Object.values(limitationCases);
}
