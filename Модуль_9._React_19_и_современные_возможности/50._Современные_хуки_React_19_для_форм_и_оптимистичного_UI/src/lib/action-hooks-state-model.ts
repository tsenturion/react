import {
  buildReceipt,
  type AnnouncementPayload,
  type DispatchReceipt,
} from './modern-form-hooks-domain';

export type HookActionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  issues: string[];
  attempts: number;
  receipt: DispatchReceipt | null;
  lastSubmittedTitle: string;
};

export const initialHookActionState: HookActionState = {
  status: 'idle',
  message:
    'Submit ещё не запускался. Как только форма вернёт state из action, результат появится здесь без внешнего effect-синхронизатора.',
  issues: [],
  attempts: 0,
  receipt: null,
  lastSubmittedTitle: 'none',
};

export function buildValidationState(
  previousState: HookActionState,
  payload: AnnouncementPayload,
  issues: string[],
): HookActionState {
  return {
    status: 'error',
    message:
      'Action вернул validation issues, поэтому optimistic и confirmed result не запускаются.',
    issues,
    attempts: previousState.attempts + 1,
    receipt: null,
    lastSubmittedTitle: payload.title || 'empty title',
  };
}

export function buildFailureState(
  previousState: HookActionState,
  payload: AnnouncementPayload,
): HookActionState {
  return {
    status: 'error',
    message: `Сервер отклонил "${payload.title}". Pending закончился, а итог формы вернулся как error-state.`,
    issues: [
      'Базовое состояние не изменилось, поэтому optimistic overlay должен откатиться.',
    ],
    attempts: previousState.attempts + 1,
    receipt: null,
    lastSubmittedTitle: payload.title,
  };
}

export function buildSuccessState(
  previousState: HookActionState,
  payload: AnnouncementPayload,
): HookActionState {
  return {
    status: 'success',
    message:
      'Action вернул успешный результат. Форма получила итоговый state прямо из async submit.',
    issues: [],
    attempts: previousState.attempts + 1,
    receipt: buildReceipt(payload),
    lastSubmittedTitle: payload.title,
  };
}
