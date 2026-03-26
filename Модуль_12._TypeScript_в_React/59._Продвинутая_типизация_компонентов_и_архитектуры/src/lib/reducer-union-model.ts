export type ComposerKind = 'announcement' | 'checklist' | 'approval';

type EditorBase = {
  title: string;
};

export type AnnouncementEditor = EditorBase & {
  kind: 'announcement';
  message: string;
  highlight: boolean;
};

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type ChecklistEditor = EditorBase & {
  kind: 'checklist';
  items: readonly ChecklistItem[];
};

export type ApprovalEditor = EditorBase & {
  kind: 'approval';
  approvers: readonly string[];
  requiredCount: number;
};

export type EditorState = AnnouncementEditor | ChecklistEditor | ApprovalEditor;

export type ComposerState = {
  editor: EditorState;
  actionLog: readonly string[];
};

export type ComposerAction =
  | { type: 'select-kind'; kind: ComposerKind }
  | { type: 'update-title'; value: string }
  | { type: 'update-message'; value: string }
  | { type: 'toggle-highlight' }
  | { type: 'add-checklist-item'; label: string }
  | { type: 'toggle-checklist-item'; id: string }
  | { type: 'add-approver'; name: string }
  | { type: 'set-required-count'; value: number }
  | { type: 'reset-editor' };

function assertNever(value: never): never {
  throw new Error(`Unhandled branch: ${JSON.stringify(value)}`);
}

function pushLog(
  state: ComposerState,
  label: string,
  editor: EditorState,
): ComposerState {
  return {
    editor,
    actionLog: [label, ...state.actionLog].slice(0, 6),
  };
}

function createEditor(kind: ComposerKind): EditorState {
  switch (kind) {
    case 'announcement':
      return {
        kind,
        title: 'Weekly status update',
        message: 'Стабилизировать typed contracts перед релизом design-system слоя.',
        highlight: true,
      };
    case 'checklist':
      return {
        kind,
        title: 'Migration checklist',
        items: [
          { id: 'contract', label: 'Вынести shared contract types', done: true },
          { id: 'tests', label: 'Обновить component tests', done: false },
        ],
      };
    case 'approval':
      return {
        kind,
        title: 'API review request',
        approvers: ['Design system', 'Platform'],
        requiredCount: 1,
      };
    default:
      return assertNever(kind);
  }
}

export function createInitialComposerState(
  kind: ComposerKind = 'announcement',
): ComposerState {
  return {
    editor: createEditor(kind),
    actionLog: [`ready:${kind}`],
  };
}

export function workflowReducer(
  state: ComposerState,
  action: ComposerAction,
): ComposerState {
  switch (action.type) {
    case 'select-kind':
      return pushLog(state, `select-kind:${action.kind}`, createEditor(action.kind));
    case 'update-title':
      return pushLog(state, 'update-title', {
        ...state.editor,
        title: action.value,
      });
    case 'update-message':
      if (state.editor.kind !== 'announcement') {
        return state;
      }

      return pushLog(state, 'update-message', {
        ...state.editor,
        message: action.value,
      });
    case 'toggle-highlight':
      if (state.editor.kind !== 'announcement') {
        return state;
      }

      return pushLog(state, 'toggle-highlight', {
        ...state.editor,
        highlight: !state.editor.highlight,
      });
    case 'add-checklist-item':
      if (state.editor.kind !== 'checklist') {
        return state;
      }

      if (!action.label.trim()) {
        return state;
      }

      return pushLog(state, 'add-checklist-item', {
        ...state.editor,
        items: [
          ...state.editor.items,
          {
            id: `item-${state.editor.items.length + 1}`,
            label: action.label.trim(),
            done: false,
          },
        ],
      });
    case 'toggle-checklist-item':
      if (state.editor.kind !== 'checklist') {
        return state;
      }

      return pushLog(state, 'toggle-checklist-item', {
        ...state.editor,
        items: state.editor.items.map((item) =>
          item.id === action.id ? { ...item, done: !item.done } : item,
        ),
      });
    case 'add-approver':
      if (state.editor.kind !== 'approval') {
        return state;
      }

      if (!action.name.trim()) {
        return state;
      }

      if (
        state.editor.approvers.some(
          (approver) => approver.toLowerCase() === action.name.trim().toLowerCase(),
        )
      ) {
        return state;
      }

      return pushLog(state, 'add-approver', {
        ...state.editor,
        approvers: [...state.editor.approvers, action.name.trim()],
      });
    case 'set-required-count':
      if (state.editor.kind !== 'approval') {
        return state;
      }

      return pushLog(state, 'set-required-count', {
        ...state.editor,
        requiredCount: Math.max(
          1,
          Math.min(action.value, Math.max(1, state.editor.approvers.length)),
        ),
      });
    case 'reset-editor':
      return pushLog(state, 'reset-editor', createEditor(state.editor.kind));
    default:
      return assertNever(action);
  }
}

export function summarizeEditor(editor: EditorState): string {
  switch (editor.kind) {
    case 'announcement':
      return editor.highlight
        ? `Announcement: ${editor.title}, highlight on`
        : `Announcement: ${editor.title}, highlight off`;
    case 'checklist': {
      const completed = editor.items.filter((item) => item.done).length;

      return `Checklist: ${completed}/${editor.items.length} items done`;
    }
    case 'approval':
      return `Approval: ${editor.requiredCount} of ${editor.approvers.length} approvers required`;
    default:
      return assertNever(editor);
  }
}

export function describeCurrentBranch(editor: EditorState): string {
  switch (editor.kind) {
    case 'announcement':
      return 'message + highlight';
    case 'checklist':
      return 'items[] + toggle';
    case 'approval':
      return 'approvers[] + requiredCount';
    default:
      return assertNever(editor);
  }
}

export const typedReducerSnippet = `type ComposerAction =
  | { type: 'select-kind'; kind: ComposerKind }
  | { type: 'update-title'; value: string }
  | { type: 'update-message'; value: string }
  | { type: 'add-checklist-item'; label: string }
  | { type: 'add-approver'; name: string };

function workflowReducer(state: ComposerState, action: ComposerAction) {
  switch (action.type) {
    case 'update-message':
      if (state.editor.kind !== 'announcement') {
        return state;
      }
      return {
        ...state,
        editor: { ...state.editor, message: action.value },
      };
  }
}`;

export const looseReducerSnippet = `function reducer(state, action) {
  if (action.type === 'update') {
    return {
      ...state,
      [action.field]: action.value,
    };
  }

  return state;
}`;
