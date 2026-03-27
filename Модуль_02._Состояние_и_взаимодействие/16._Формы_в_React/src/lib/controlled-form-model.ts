import type { ControlledLessonForm } from './form-domain';
import type { StatusTone } from './learning-model';

export type ControlledFormReport = {
  tone: StatusTone;
  completion: number;
  summary: string;
  previewLabel: string;
  snippet: string;
};

export function buildControlledFormReport(
  form: ControlledLessonForm,
): ControlledFormReport {
  const completedFields = [
    form.fullName.trim().length > 0,
    form.bio.trim().length > 0,
    form.track.length > 0,
    form.contactPreference.length > 0,
  ].filter(Boolean).length;
  const completion = Math.round((completedFields / 4) * 100);

  return {
    tone: form.newsletter ? 'success' : 'warn',
    completion,
    summary:
      'Controlled form связывает каждый input со state: ввод меняет state, а UI читается из state на каждом рендере. Это даёт полный контроль над preview, валидацией и reset.',
    previewLabel: `${form.fullName || 'Без имени'} • ${form.track} • ${
      form.contactPreference
    }`,
    snippet: [
      'function handleChange(event) {',
      '  const target = event.target;',
      '  const { name } = target;',
      '  const value = target.type === "checkbox" ? target.checked : target.value;',
      '  setForm((current) => ({ ...current, [name]: value }));',
      '}',
    ].join('\n'),
  };
}
