import type { PitfallMode } from './form-domain';
import type { StatusTone } from './learning-model';

export type PitfallReport = {
  tone: StatusTone;
  label: string;
  summary: string;
  badSnippet: string;
  goodSnippet: string;
};

export function buildPitfallReport(mode: PitfallMode): PitfallReport {
  if (mode === 'checkbox-value') {
    return {
      tone: 'error',
      label: 'checkbox uses value',
      summary:
        'Для checkbox источник истины — `checked`, а не `value`. Иначе вместо boolean в state попадает строка вроде `"on"` и UI начинает врать о реальном флаге.',
      badSnippet: 'setForm({ ...form, newsletter: event.target.value });',
      goodSnippet: 'setForm({ ...form, newsletter: event.target.checked });',
    };
  }

  if (mode === 'missing-prevent-default') {
    return {
      tone: 'warn',
      label: 'submit without preventDefault',
      summary:
        'Если в SPA-зоне не вызвать `preventDefault`, браузер пойдёт по нативному submit flow. Это легко ломает локальное состояние, журналы и кастомную обработку ошибок.',
      badSnippet: 'function handleSubmit(event) { sendPayload(); }',
      goodSnippet:
        'function handleSubmit(event) { event.preventDefault(); sendPayload(); }',
    };
  }

  return {
    tone: 'warn',
    label: 'dom reset vs state',
    summary:
      'В controlled форме `form.reset()` сбрасывает DOM, но UI всё равно читается из state. Если state не вернуть к исходным значениям, поле визуально останется прежним.',
    badSnippet: 'formRef.current?.reset();',
    goodSnippet: 'formRef.current?.reset(); setForm(createControlledLessonForm());',
  };
}
