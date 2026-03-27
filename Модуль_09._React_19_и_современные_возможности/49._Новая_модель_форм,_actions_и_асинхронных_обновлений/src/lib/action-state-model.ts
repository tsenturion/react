import {
  buildSubmissionRecord,
  type LessonPayload,
  type SubmissionRecord,
} from './forms-actions-domain';

export type FormActionState = {
  status: 'idle' | 'error' | 'success';
  message: string;
  issues: string[];
  attempts: number;
  receipt: SubmissionRecord | null;
};

export const initialFormActionState: FormActionState = {
  status: 'idle',
  message: 'Здесь появится результат асинхронного action.',
  issues: [],
  attempts: 0,
  receipt: null,
};

export function validateLessonPayload(payload: LessonPayload) {
  const issues: string[] = [];

  if (payload.title.length < 4) {
    issues.push('Название должно содержать минимум 4 символа.');
  }

  if (payload.owner.length < 2) {
    issues.push('Поле owner должно явно указывать ответственного.');
  }

  if (payload.cohort.length < 2) {
    issues.push(
      'Поле cohort нужно, чтобы асинхронный action отражал реальный маршрут материала.',
    );
  }

  if (payload.notes.length < 12) {
    issues.push(
      'Короткое notes-поле скрывает смысл submit и плохо показывает payload формы.',
    );
  }

  return issues;
}

export function buildErrorActionState(
  previousState: FormActionState,
  issues: string[],
): FormActionState {
  return {
    status: 'error',
    message:
      'Action вернул validation errors. Форма остаётся в текущем состоянии без ручного useEffect.',
    issues,
    attempts: previousState.attempts + 1,
    receipt: previousState.receipt,
  };
}

export function buildSuccessActionState(
  previousState: FormActionState,
  payload: LessonPayload,
): FormActionState {
  return {
    status: 'success',
    message: 'Action завершился успешно и сразу вернул новый state формы.',
    issues: [],
    attempts: previousState.attempts + 1,
    receipt: buildSubmissionRecord('review', payload),
  };
}
