import type { ControlledLessonForm } from './form-domain';
import type { StatusTone } from './learning-model';

export type SubmitStage = 'idle' | 'submitting' | 'success' | 'error';

export type SubmitFlowReport = {
  tone: StatusTone;
  actionLabel: string;
  summary: string;
  snippet: string;
};

export function canSubmitControlledForm(form: ControlledLessonForm) {
  return form.fullName.trim().length >= 2 && form.bio.trim().length >= 10;
}

export function buildSubmitPayload(form: ControlledLessonForm) {
  return {
    ...form,
    submittedAt: 'runtime',
  };
}

export function buildSubmitFlowReport(
  stage: SubmitStage,
  canSubmit: boolean,
): SubmitFlowReport {
  const actionLabel =
    stage === 'submitting'
      ? 'Отправка...'
      : stage === 'success'
        ? 'Отправлено'
        : stage === 'error'
          ? 'Ошибка'
          : canSubmit
            ? 'Можно отправлять'
            : 'Форма не готова';

  return {
    tone:
      stage === 'success'
        ? 'success'
        : stage === 'error'
          ? 'error'
          : canSubmit
            ? 'warn'
            : 'error',
    actionLabel,
    summary:
      'У submit flow есть явные этапы: чтение актуального state, preventDefault, валидация, отправка, успех или ошибка, и затем понятный reset.',
    snippet: [
      'async function handleSubmit(event) {',
      '  event.preventDefault();',
      '  if (!canSubmit) return;',
      "  setStage('submitting');",
      '  await fakeRequest();',
      "  setStage('success');",
      '}',
    ].join('\n'),
  };
}
