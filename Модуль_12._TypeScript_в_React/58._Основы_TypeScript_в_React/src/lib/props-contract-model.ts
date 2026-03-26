export type PropsScenarioId = 'lesson-card' | 'toolbar-action' | 'notice-panel';

export type ContractMode = 'loose' | 'typed' | 'over-flexible';

export type ContractReport = {
  readonly id: ContractMode;
  readonly label: string;
  readonly apiClarity: 'low' | 'medium' | 'high';
  readonly runtimeRisk: 'low' | 'medium' | 'high';
  readonly editorHelp: 'low' | 'medium' | 'high';
  readonly summary: string;
  readonly recommendation?: 'recommended' | 'watch';
};

type ScenarioMeta = {
  readonly id: PropsScenarioId;
  readonly label: string;
  readonly blurb: string;
  readonly typedSnippet: string;
  readonly looseSnippet: string;
  readonly wins: readonly string[];
};

const scenarioMetaById: Record<PropsScenarioId, ScenarioMeta> = {
  'lesson-card': {
    id: 'lesson-card',
    label: 'Lesson card',
    blurb:
      'Карточка урока может вести по ссылке или запускать локальное действие, но не должна поддерживать обе модели одновременно.',
    typedSnippet: `type LessonCardProps = {
  title: string;
  children: React.ReactNode;
} & (
  | { actionKind: 'link'; href: string; onAction?: never }
  | { actionKind: 'button'; onAction: () => void; href?: never }
);`,
    looseSnippet: `type LessonCardProps = {
  title?: string;
  href?: string;
  onAction?: () => void;
  children?: React.ReactNode;
};`,
    wins: [
      'Типы делают невозможной комбинацию `href` + `onAction` без явного выбора режима.',
      'Required `children` подсказывает, что карточка не должна рендериться пустой.',
    ],
  },
  'toolbar-action': {
    id: 'toolbar-action',
    label: 'Toolbar action',
    blurb:
      'Кнопка панели должна отличать destructive и neutral режимы и всегда иметь читаемую подпись.',
    typedSnippet: `type ToolbarActionProps = {
  label: string;
  shortcut?: string;
} & (
  | { tone: 'neutral'; confirmText?: never }
  | { tone: 'danger'; confirmText: string }
);`,
    looseSnippet: `type ToolbarActionProps = {
  label?: string;
  tone?: string;
  confirmText?: string;
};`,
    wins: [
      'Discriminated union показывает, что dangerous action требует отдельного подтверждения.',
      'Компонент получает более честный API без магических строковых режимов.',
    ],
  },
  'notice-panel': {
    id: 'notice-panel',
    label: 'Notice panel',
    blurb:
      'Панель уведомления может быть либо краткой, либо с раскрытым описанием и вторичным слотом действий.',
    typedSnippet: `type NoticePanelProps = {
  title: string;
  children: React.ReactNode;
} & (
  | { density: 'compact'; secondaryAction?: never }
  | { density: 'detailed'; secondaryAction: string }
);`,
    looseSnippet: `type NoticePanelProps = {
  title?: string;
  children?: React.ReactNode;
  density?: 'compact' | 'detailed';
  secondaryAction?: string;
};`,
    wins: [
      'Описание secondary action появляется только там, где реально есть подробный режим.',
      'Children остаётся явной частью API, а не побочным допущением.',
    ],
  },
};

export function getPropsScenario(id: PropsScenarioId): ScenarioMeta {
  return scenarioMetaById[id];
}

export function buildContractReports(): readonly ContractReport[] {
  return [
    {
      id: 'loose',
      label: 'Loose props',
      apiClarity: 'low',
      runtimeRisk: 'high',
      editorHelp: 'low',
      summary:
        'Компонент принимает слишком широкую форму данных, поэтому ошибки обнаруживаются поздно и обычно уже в UI.',
      recommendation: 'watch',
    },
    {
      id: 'typed',
      label: 'Typed contract',
      apiClarity: 'high',
      runtimeRisk: 'low',
      editorHelp: 'high',
      summary:
        'Типы оформляют честный контракт компонента и подсказывают допустимые варианты использования прямо в редакторе.',
      recommendation: 'recommended',
    },
    {
      id: 'over-flexible',
      label: 'Over-flexible API',
      apiClarity: 'medium',
      runtimeRisk: 'medium',
      editorHelp: 'medium',
      summary:
        'Формально типы есть, но они слишком широкие, поэтому полезность TypeScript резко падает и компонент снова становится источником двусмысленности.',
      recommendation: 'watch',
    },
  ] as const;
}
