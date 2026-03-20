import type { LessonLabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

const studyMap: Record<LessonLabId, StudyEntry> = {
  position: {
    files: [
      {
        path: 'src/components/state-identity/PositionAnchorLab.tsx',
        note: 'Живой sandbox с одним slot и local state, который остаётся у того же экземпляра при смене props.',
      },
      {
        path: 'src/lib/state-position-model.ts',
        note: 'Чистая модель формулирует правило привязки state к type, slot и key.',
      },
      {
        path: 'src/pages/StatePositionPage.tsx',
        note: 'Страница связывает live-поведение и правило позиционной identity.',
      },
    ],
    snippets: [
      {
        label: 'Initial state from props',
        note: 'Здесь видно, что initial state берётся из props только на mount текущего экземпляра.',
        code: [
          'const [draft, setDraft] = useState(profile.seedDraft);',
          'const [checkpoints, setCheckpoints] = useState(0);',
        ].join('\n'),
      },
      {
        label: 'Same slot render',
        note: 'Тот же component type остаётся в том же месте дерева, поэтому state сохраняется.',
        code: ['<StableDraftCard profile={activeProfile} compact={compact} />'].join(
          '\n',
        ),
      },
    ],
  },
  branches: {
    files: [
      {
        path: 'src/components/state-identity/BranchIdentityLab.tsx',
        note: 'Компонент сравнивает reuse одного type и remount при смене type в том же slot.',
      },
      {
        path: 'src/lib/branch-identity-model.ts',
        note: 'Модель урока объясняет, когда conditional branch сохраняет экземпляр, а когда создаёт новый.',
      },
      {
        path: 'src/pages/BranchIdentityPage.tsx',
        note: 'Страница связывает mount/unmount журнал с архитектурным правилом React identity.',
      },
    ],
    snippets: [
      {
        label: 'Preserved branch',
        note: 'Один и тот же component type в slot сохраняет local state.',
        code: [
          "{mode === 'same-type' ? (",
          '  <SharedTrackPanel track={activeTrack} onLog={appendLog} />',
          ') : null}',
        ].join('\n'),
      },
      {
        label: 'Reset branch',
        note: 'Разные components в slot приводят к cleanup и новому mount.',
        code: [
          "{activeTrack.id === 'basic' ? (",
          '  <BasicTrackPanel track={activeTrack} onLog={appendLog} />',
          ') : (',
          '  <AdvancedTrackPanel track={activeTrack} onLog={appendLog} />',
          ')}',
        ].join('\n'),
      },
    ],
  },
  keys: {
    files: [
      {
        path: 'src/components/state-identity/KeyedResetLab.tsx',
        note: 'Здесь `key` действительно меняет identity границу для одного и того же ComposerCard.',
      },
      {
        path: 'src/lib/key-reset-model.ts',
        note: 'Модель описывает разницу между reuse subtree и осознанным reset через key.',
      },
      {
        path: 'src/pages/KeyResetPage.tsx',
        note: 'Страница связывает live-remount и типовой сценарий смены сущности.',
      },
    ],
    snippets: [
      {
        label: 'Key boundary',
        note: 'Изменение key создаёт новый экземпляр даже для того же component type.',
        code: [
          '<ComposerCard',
          "  key={useKey ? activeProfile.id : 'shared-composer'}",
          '  profile={activeProfile}',
          '/>',
        ].join('\n'),
      },
      {
        label: 'Reusable subtree',
        note: 'Без key React продолжает жить внутри того же экземпляра.',
        code: ['<ComposerCard profile={activeProfile} />'].join('\n'),
      },
    ],
  },
  lists: {
    files: [
      {
        path: 'src/components/state-identity/ListIdentityLab.tsx',
        note: 'Список с локальным состоянием строк показывает drift при плохих ключах и preserve при стабильных id.',
      },
      {
        path: 'src/lib/list-identity-model.ts',
        note: 'Здесь вычисляются reuse, remount и identity drift для разных key-стратегий.',
      },
      {
        path: 'src/pages/ListIdentityPage.tsx',
        note: 'Страница связывает diff-метрики и live reorder строк.',
      },
    ],
    snippets: [
      {
        label: 'Key strategy',
        note: 'Связь local state с данными определяется именно выбранным key.',
        code: [
          'const keyOf = (row, index) =>',
          "  strategy === 'stable-id' ? row.id : strategy === 'index' ? String(index) : `${row.id}-${version}`;",
        ].join('\n'),
      },
      {
        label: 'Row local state',
        note: 'Локальный state строки существует намеренно, чтобы показать перенос identity.',
        code: [
          'const [note, setNote] = useState(row.seedNote);',
          'const [ticks, setTicks] = useState(0);',
        ].join('\n'),
      },
    ],
  },
  tree: {
    files: [
      {
        path: 'src/components/state-identity/TreeMoveLab.tsx',
        note: 'Sandbox сравнивает visual reorder через CSS и реальный перенос subtree между слотами.',
      },
      {
        path: 'src/lib/tree-move-model.ts',
        note: 'Модель объясняет, почему одинаковый внешний эффект может давать разный lifecycle.',
      },
      {
        path: 'src/pages/TreeMovePage.tsx',
        note: 'Страница связывает remount, layout и управление поведением интерфейса.',
      },
    ],
    snippets: [
      {
        label: 'Layout-only move',
        note: 'Поддерево не покидает свой slot, если меняется только CSS order.',
        code: [
          "<div className={dock === 'left' ? 'lg:order-1' : 'lg:order-2'}>",
          '  <DockedInspector onLog={appendLog} />',
          '</div>',
        ].join('\n'),
      },
      {
        label: 'Slot move',
        note: 'Здесь JSX реально появляется в разных ветках дерева, поэтому state сбрасывается.',
        code: [
          "{dock === 'left' ? <DockedInspector onLog={appendLog} /> : null}",
          "{dock === 'right' ? <DockedInspector onLog={appendLog} /> : null}",
        ].join('\n'),
      },
    ],
  },
  strategy: {
    files: [
      {
        path: 'src/components/state-identity/StateStrategyPlaybookLab.tsx',
        note: 'Интерактивный playbook позволяет выбрать цель и ситуацию и сразу увидеть архитектурное решение.',
      },
      {
        path: 'src/lib/strategy-playbook-model.ts',
        note: 'Чистая модель связывает цели preserve/reset с подходящими паттернами управления identity.',
      },
      {
        path: 'src/pages/StateStrategyPage.tsx',
        note: 'Страница собирает playbook в итоговую архитектурную сводку урока.',
      },
    ],
    snippets: [
      {
        label: 'Lift by entity id',
        note: 'Если state должен жить у сущности, его лучше хранить в map по id.',
        code: [
          'const [drafts, setDrafts] = useState<Record<string, string>>({});',
          'const draft = drafts[activeId] ?? "";',
        ].join('\n'),
      },
      {
        label: 'Intentional reset',
        note: 'Когда нужен новый lifecycle, boundary задаётся явно через key или новый type.',
        code: ['<Editor key={activeId} profile={activeProfile} />'].join('\n'),
      },
    ],
  },
};

export function getProjectStudy(id: LessonLabId) {
  return studyMap[id];
}
