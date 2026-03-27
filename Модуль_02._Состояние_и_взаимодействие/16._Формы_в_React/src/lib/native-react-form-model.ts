import type { NativeComparisonForm } from './form-domain';
import type { StatusTone } from './learning-model';

export type NativeVsReactReport = {
  tone: StatusTone;
  nativeLabel: string;
  reactLabel: string;
  summary: string;
  snippet: string;
};

export function buildNativeFormPayload(
  entries: Record<string, FormDataEntryValue | undefined>,
) {
  return {
    topic: String(entries.topic ?? ''),
    details: String(entries.details ?? ''),
    format: String(entries.format ?? ''),
  };
}

export function buildReactFormPayload(form: NativeComparisonForm) {
  return {
    ...form,
  };
}

export function buildNativeVsReactReport(
  nativePayload: ReturnType<typeof buildNativeFormPayload>,
  reactPayload: NativeComparisonForm,
): NativeVsReactReport {
  const nativeLabel = `${nativePayload.topic || 'Пусто'} / ${nativePayload.format || '—'}`;
  const reactLabel = `${reactPayload.topic || 'Пусто'} / ${reactPayload.format}`;

  return {
    tone: nativePayload.topic === reactPayload.topic ? 'success' : 'warn',
    nativeLabel,
    reactLabel,
    summary:
      'Нативная форма уже умеет `required`, `FormData`, `reset` и browser validation. React-управление добавляет live sync, custom errors и предсказуемый state-driven UI.',
    snippet: [
      'const formData = new FormData(formElement);',
      'formElement.reportValidity();',
      '',
      'setForm((current) => ({ ...current, topic: event.target.value }));',
    ].join('\n'),
  };
}
