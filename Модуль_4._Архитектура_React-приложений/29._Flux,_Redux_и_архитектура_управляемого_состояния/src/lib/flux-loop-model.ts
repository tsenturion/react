import { actionPresets } from './redux-domain';
import type { StatusTone } from './learning-model';

export function buildFluxReport(actionId: string): {
  tone: StatusTone;
  title: string;
  actionType: string;
  steps: readonly {
    phase: 'view' | 'action' | 'store' | 'reducer' | 'selector' | 'view-update';
    title: string;
    detail: string;
  }[];
} {
  const preset = actionPresets.find((item) => item.id === actionId) ?? actionPresets[0]!;

  return {
    tone: 'success',
    title: preset.label,
    actionType: preset.actionType,
    steps: [
      {
        phase: 'view',
        title: 'UI event',
        detail: preset.uiEvent,
      },
      {
        phase: 'action',
        title: 'Action dispatch',
        detail: `View dispatch-ит action type "${preset.actionType}" в store.`,
      },
      {
        phase: 'store',
        title: 'Central store',
        detail:
          'Store принимает action и передаёт его в reducer tree по однонаправленному потоку.',
      },
      {
        phase: 'reducer',
        title: 'Reducer transition',
        detail: preset.reducerEffect,
      },
      {
        phase: 'selector',
        title: 'Derived state',
        detail: preset.selectorEffect,
      },
      {
        phase: 'view-update',
        title: 'View render',
        detail: preset.result,
      },
    ],
  };
}
