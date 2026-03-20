import type { FocusFieldId, FocusFormValues } from './ref-domain';
import type { StatusTone } from './learning-model';

export type FocusCase = 'manual-focus' | 'validation-focus' | 'restore-last';

type FocusReport = {
  title: string;
  tone: StatusTone;
  summary: string;
  snippet: string;
};

const reports: Record<FocusCase, FocusReport> = {
  'manual-focus': {
    title: 'Focus via DOM ref',
    tone: 'success',
    summary:
      'Ref даёт доступ к конкретному input, и focus() можно вызывать ровно в момент пользовательского действия.',
    snippet: [
      'const emailRef = useRef<HTMLInputElement | null>(null);',
      '',
      'function focusEmail() {',
      '  emailRef.current?.focus();',
      '}',
    ].join('\n'),
  },
  'validation-focus': {
    title: 'Jump to first invalid field',
    tone: 'success',
    summary:
      'После submit можно найти первый невалидный field и направить фокус туда, где нужен следующий шаг.',
    snippet: [
      'const firstInvalid = getFirstInvalidField(values);',
      'fieldRefs[firstInvalid]?.current?.focus();',
    ].join('\n'),
  },
  'restore-last': {
    title: 'Remember last focused element',
    tone: 'warn',
    summary:
      'Ref удобно хранит последний DOM-узел, но этот узел нужно проверять: он мог уже размонтироваться или стать disabled.',
    snippet: [
      'const lastFocusedRef = useRef<HTMLElement | null>(null);',
      'lastFocusedRef.current?.focus();',
    ].join('\n'),
  },
};

export function buildFocusReport(id: FocusCase) {
  return reports[id];
}

export function getFirstInvalidField(values: FocusFormValues): FocusFieldId | null {
  if (values.name.trim().length < 2) {
    return 'name';
  }

  if (!values.email.includes('@')) {
    return 'email';
  }

  if (!values.track.trim()) {
    return 'track';
  }

  return null;
}
