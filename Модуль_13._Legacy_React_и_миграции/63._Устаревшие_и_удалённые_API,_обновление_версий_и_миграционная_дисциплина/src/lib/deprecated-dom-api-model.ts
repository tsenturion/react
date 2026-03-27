import type { StatusTone } from './learning-model';

export type DeprecatedApiId =
  | 'find-dom-node'
  | 'render'
  | 'hydrate'
  | 'unmount-component-at-node'
  | 'legacy-context'
  | 'string-refs';

export type RuntimeMode = '18.3-warning' | '19-break';

export type DeprecatedApiCard = {
  id: DeprecatedApiId;
  title: string;
  removedInReact19: boolean;
  oldApi: string;
  replacement: string;
  whyItBreaks: string;
  hiddenAssumption: string;
};

export const deprecatedApiCatalog: readonly DeprecatedApiCard[] = [
  {
    id: 'find-dom-node',
    title: 'findDOMNode',
    removedInReact19: true,
    oldApi: 'findDOMNode(component)',
    replacement: 'ref на конкретный DOM node или ref-as-prop / forwardRef bridge',
    whyItBreaks:
      'Старый API полагается на неявный поиск DOM узла по component instance и плохо сочетается с современным React tree.',
    hiddenAssumption:
      'Компонентный instance всегда можно безопасно и однозначно сопоставить с одним DOM узлом.',
  },
  {
    id: 'render',
    title: 'ReactDOM.render',
    removedInReact19: true,
    oldApi: 'ReactDOM.render(<App />, container)',
    replacement: 'createRoot(container).render(<App />)',
    whyItBreaks:
      'Root lifecycle и rendering model в современной версии React организованы вокруг явного root object.',
    hiddenAssumption:
      'Container сам по себе достаточно описывает lifecycle mounted tree.',
  },
  {
    id: 'hydrate',
    title: 'ReactDOM.hydrate',
    removedInReact19: true,
    oldApi: 'hydrate(<App />, container)',
    replacement: 'hydrateRoot(container, <App />)',
    whyItBreaks:
      'Hydration теперь тоже управляется root object, а не отдельной процедурой без явного root lifecycle.',
    hiddenAssumption:
      'Hydration можно рассматривать как почти тот же render с другой точкой входа.',
  },
  {
    id: 'unmount-component-at-node',
    title: 'unmountComponentAtNode',
    removedInReact19: true,
    oldApi: 'unmountComponentAtNode(container)',
    replacement: 'root.unmount()',
    whyItBreaks:
      'Unmount теперь связан с тем же root instance, который выполнял mount/hydration.',
    hiddenAssumption:
      'Размонтирование можно безопасно делать только по container без знания root ownership.',
  },
  {
    id: 'legacy-context',
    title: 'Legacy context',
    removedInReact19: false,
    oldApi: 'childContextTypes / contextTypes',
    replacement:
      'createContext + useContext / contextType / Consumer as migration bridge',
    whyItBreaks:
      'Даже если API уже не является основной моделью, его неявность сильно усложняет migration reasoning.',
    hiddenAssumption:
      'Context flow можно читать без явной provider boundary и точного ownership значения.',
  },
  {
    id: 'string-refs',
    title: 'String refs',
    removedInReact19: false,
    oldApi: 'ref="input"',
    replacement: 'createRef, callback refs, ref-as-prop',
    whyItBreaks:
      'String refs прячут доступ к instance fields и делают ref flow менее предсказуемым.',
    hiddenAssumption:
      'Imperative доступ к узлам и instance state можно держать как скрытый побочный канал.',
  },
] as const;

export function summarizeDeprecatedApis(
  selectedIds: readonly DeprecatedApiId[],
  runtimeMode: RuntimeMode,
): {
  tone: StatusTone;
  removedCount: number;
  warningCount: number;
  title: string;
  copy: string;
  nextSteps: string[];
} {
  const selectedCards = deprecatedApiCatalog.filter((item) =>
    selectedIds.includes(item.id),
  );
  const removedCount = selectedCards.filter((item) => item.removedInReact19).length;
  const warningCount = selectedCards.length - removedCount;

  if (selectedCards.length === 0) {
    return {
      tone: 'success',
      removedCount: 0,
      warningCount: 0,
      title: 'Явных deprecated call sites не выбрано',
      copy: 'Это хороший знак, но он ещё не гарантирует, что миграция не упрётся в implicit assumptions вокруг rendering, refs или supporting code.',
      nextSteps: [
        'Проверьте custom entrypoints и bootstrap helpers.',
        'Сверьте test suite с migration-sensitive сценариями.',
      ],
    };
  }

  if (runtimeMode === '19-break' && removedCount > 0) {
    return {
      tone: 'error',
      removedCount,
      warningCount,
      title: `React 19 сломает ${removedCount} удалённых call site${removedCount > 1 ? 'ов' : ''}`,
      copy: 'Здесь уже недостаточно warnings cleanup. Нужна замена точки входа и проверка привязанных к ней runtime assumptions.',
      nextSteps: [
        'Переведите entrypoint на createRoot / hydrateRoot / root.unmount.',
        'Проверьте refs, cleanup и side effects, которые жили вокруг старого root API.',
        'Запустите tests по критическим пользовательским сценариям после замены.',
      ],
    };
  }

  return {
    tone: removedCount > 0 ? 'warn' : 'success',
    removedCount,
    warningCount,
    title:
      runtimeMode === '18.3-warning'
        ? 'React 18.3 показывает, где миграция уже должна начаться'
        : 'Остались migration surfaces, но прямого removed DOM API blocker меньше',
    copy:
      runtimeMode === '18.3-warning'
        ? 'Этот режим полезен как инвентаризация: warnings позволяют собрать карту работ до реального перехода на 19.'
        : 'Даже если removed DOM API уже убраны, supporting code и старые assumptions всё ещё нужно перепроверить.',
    nextSteps: [
      'Соберите inventory всех call sites и связанных adapters.',
      'Отдельно проверьте legacy context, string refs и старые entrypoint helpers.',
      'Не завершайте migration plan только на codemod changes.',
    ],
  };
}

export const removedDomMigrationRules = [
  'Removed API почти всегда тянут за собой старые assumptions о mount/hydrate/unmount lifecycle.',
  '18.3 полезен как этап предупреждений, а не как финальная migration goal.',
  'Если старый DOM API используется глубоко в helpers или third-party wrappers, root-level замена сама по себе не завершает работу.',
  'Migration checklist должен покрывать не только app root, но и тестовые harnesses, storybook adapters и internal mount helpers.',
] as const;
