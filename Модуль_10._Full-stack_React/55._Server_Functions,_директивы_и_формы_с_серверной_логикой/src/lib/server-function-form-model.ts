import {
  invokeServerAction,
  type FieldErrors,
  type LessonMutationInput,
  type SubmitIntent,
} from '../server/server-functions-runtime';

export type FormUiState = {
  status: 'idle' | 'success' | 'error';
  lastIntent: SubmitIntent;
  headline: string;
  message: string;
  fieldErrors: FieldErrors;
  auditTrail: string[];
  persistedStatus: string;
};

export const initialFormState: FormUiState = {
  status: 'idle',
  lastIntent: 'saveDraft',
  headline: 'Ожидание отправки',
  message:
    'Форма пока ничего не отправляла. После submit здесь появится результат server function.',
  fieldErrors: {},
  auditTrail: [],
  persistedStatus: 'none',
};

export function parseLessonMutationFormData(formData: FormData): LessonMutationInput {
  const intent = (formData.get('intent')?.toString() ?? 'saveDraft') as SubmitIntent;

  return {
    title: formData.get('title')?.toString() ?? '',
    slug: formData.get('slug')?.toString() ?? '',
    summary: formData.get('summary')?.toString() ?? '',
    reviewer: formData.get('reviewer')?.toString() ?? '',
    intent: intent === 'publish' ? 'publish' : 'saveDraft',
  };
}

export async function submitLessonMutation(
  previousState: FormUiState,
  formData: FormData,
): Promise<FormUiState> {
  const input = parseLessonMutationFormData(formData);
  const actionId = input.intent === 'publish' ? 'publish-lesson' : 'save-draft';
  const result = await invokeServerAction(actionId, input);

  return {
    status: result.ok ? 'success' : 'error',
    lastIntent: input.intent,
    headline: result.headline,
    message: result.message,
    fieldErrors: result.fieldErrors,
    auditTrail: result.auditTrail,
    persistedStatus: result.persisted?.status ?? previousState.persistedStatus,
  };
}
