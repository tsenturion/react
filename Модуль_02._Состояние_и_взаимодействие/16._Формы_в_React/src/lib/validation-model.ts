import type { SignupForm } from './form-domain';
import type { StatusTone } from './learning-model';

export type ValidationErrors = Partial<Record<keyof SignupForm, string>>;

export type ValidationReport = {
  tone: StatusTone;
  errorCount: number;
  summary: string;
  snippet: string;
};

export function validateSignupForm(form: SignupForm): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!form.email.includes('@')) {
    errors.email = 'Укажите корректный email.';
  }

  if (form.password.length < 6) {
    errors.password = 'Пароль должен быть не короче 6 символов.';
  }

  if (form.repeatPassword !== form.password) {
    errors.repeatPassword = 'Повтор пароля не совпадает.';
  }

  if (!form.agreeToTerms) {
    errors.agreeToTerms = 'Нужно принять правила.';
  }

  return errors;
}

export function buildValidationReport(errors: ValidationErrors): ValidationReport {
  const errorCount = Object.keys(errors).length;

  return {
    tone: errorCount === 0 ? 'success' : 'error',
    errorCount,
    summary:
      errorCount === 0
        ? 'Форма валидна: submit flow может идти дальше без скрытых сюрпризов.'
        : 'Ошибки должны быть понятными, адресными и связанными с полями. Тогда ввод, ошибки и доступность submit остаются синхронными.',
    snippet: [
      'const errors = validateSignupForm(form);',
      'const hasErrors = Object.keys(errors).length > 0;',
      'if (hasErrors) return;',
    ].join('\n'),
  };
}
