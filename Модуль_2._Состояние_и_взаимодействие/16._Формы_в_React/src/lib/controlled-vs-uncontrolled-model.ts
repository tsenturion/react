import type { ControlledLessonForm } from './form-domain';
import type { StatusTone } from './learning-model';

export type FormSnapshot = {
  fullName: string;
  track: string;
  newsletter: string;
};

export type FormModeComparison = {
  tone: StatusTone;
  controlledSummary: string;
  uncontrolledSummary: string;
  summary: string;
  snippet: string;
};

export function serializeControlledForm(form: ControlledLessonForm): FormSnapshot {
  return {
    fullName: form.fullName,
    track: form.track,
    newsletter: form.newsletter ? 'yes' : 'no',
  };
}

export function serializeUncontrolledForm(
  entries: Record<string, FormDataEntryValue | undefined>,
): FormSnapshot {
  return {
    fullName: String(entries.fullName ?? ''),
    track: String(entries.track ?? ''),
    newsletter: entries.newsletter ? 'yes' : 'no',
  };
}

export function buildFormModeComparison(
  controlled: FormSnapshot,
  uncontrolled: FormSnapshot,
): FormModeComparison {
  const matches =
    controlled.fullName === uncontrolled.fullName &&
    controlled.track === uncontrolled.track &&
    controlled.newsletter === uncontrolled.newsletter;

  return {
    tone: matches ? 'success' : 'warn',
    controlledSummary: `${controlled.fullName || 'Без имени'} / ${controlled.track}`,
    uncontrolledSummary: `${uncontrolled.fullName || 'Без имени'} / ${uncontrolled.track}`,
    summary:
      'Controlled form знает каждое изменение сразу. Uncontrolled форма отдаёт итог только в момент чтения из DOM через FormData или ref.',
    snippet: [
      'function handleSubmit(event) {',
      '  event.preventDefault();',
      '  const data = new FormData(event.currentTarget);',
      '  console.log(data.get("fullName"));',
      '}',
    ].join('\n'),
  };
}
