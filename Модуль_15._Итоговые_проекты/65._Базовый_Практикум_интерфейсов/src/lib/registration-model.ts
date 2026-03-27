export type LearningFocus = 'game' | 'data' | 'forms';
export type ExperienceLevel = 'student' | 'switcher' | 'junior';
export type RegistrationPlan = 'solo' | 'team';

export type RegistrationForm = {
  fullName: string;
  city: string;
  email: string;
  password: string;
  confirmPassword: string;
  focus: LearningFocus;
  experience: ExperienceLevel;
  plan: RegistrationPlan;
  teamName: string;
  bio: string;
  acceptPolicy: boolean;
  wantsDigest: boolean;
};

export type RegistrationErrors = Partial<Record<keyof RegistrationForm, string>>;

export type PasswordRule = {
  id: string;
  label: string;
  passed: boolean;
};

export type SubmittedRegistration = {
  fullName: string;
  city: string;
  email: string;
  focus: LearningFocus;
  experience: ExperienceLevel;
  plan: RegistrationPlan;
  teamName?: string;
  bio: string;
  wantsDigest: boolean;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const focusOptions = [
  {
    value: 'game',
    label: 'Игровая логика',
    description: 'Состояние доски, ход игрока и derived winner.',
  },
  {
    value: 'data',
    label: 'Данные и фильтры',
    description: 'Таблица, selection и вычисляемые summary.',
  },
  {
    value: 'forms',
    label: 'Формы',
    description: 'Controlled inputs, validation и submit flow.',
  },
] as const;

export const experienceOptions = [
  {
    value: 'student',
    label: 'Учусь с нуля',
  },
  {
    value: 'switcher',
    label: 'Переход из другой сферы',
  },
  {
    value: 'junior',
    label: 'Уже пишу pet-projects',
  },
] as const;

export const planOptions = [
  {
    value: 'solo',
    label: 'Индивидуально',
    description: 'Командное имя не требуется.',
  },
  {
    value: 'team',
    label: 'Командой',
    description: 'Нужно указать название команды.',
  },
] as const;

export function createRegistrationForm(): RegistrationForm {
  return {
    fullName: '',
    city: '',
    email: '',
    password: '',
    confirmPassword: '',
    focus: 'data',
    experience: 'student',
    plan: 'solo',
    teamName: '',
    bio: '',
    acceptPolicy: false,
    wantsDigest: true,
  };
}

export function buildPasswordChecklist(password: string): PasswordRule[] {
  return [
    {
      id: 'length',
      label: 'Минимум 8 символов',
      passed: password.trim().length >= 8,
    },
    {
      id: 'letter',
      label: 'Есть хотя бы одна буква',
      passed: /[a-zа-я]/i.test(password),
    },
    {
      id: 'digit',
      label: 'Есть хотя бы одна цифра',
      passed: /\d/.test(password),
    },
    {
      id: 'spaces',
      label: 'Нет пробелов',
      passed: !/\s/.test(password),
    },
  ];
}

export function getPasswordStrengthLabel(password: string) {
  const passedRules = buildPasswordChecklist(password).filter(
    (rule) => rule.passed,
  ).length;

  if (password.length === 0) {
    return 'Пусто';
  }

  if (passedRules <= 2) {
    return 'Слабый';
  }

  if (passedRules === 3) {
    return 'Нормальный';
  }

  return 'Надёжный';
}

type ValidationOptions = {
  existingEmails?: string[];
};

export function validateRegistrationForm(
  form: RegistrationForm,
  options: ValidationOptions = {},
): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const trimmedName = form.fullName.trim();
  const nameParts = trimmedName.split(/\s+/).filter(Boolean);

  if (nameParts.length < 2) {
    errors.fullName = 'Введите имя и фамилию, чтобы не терять контекст пользователя.';
  }

  if (form.city.trim().length < 2) {
    errors.city = 'Укажите город, чтобы карточка участника была полной.';
  }

  if (!emailPattern.test(form.email.trim())) {
    errors.email = 'Нужен корректный e-mail для подтверждения регистрации.';
  }

  if (
    options.existingEmails?.some(
      (email) => email.trim().toLowerCase() === form.email.trim().toLowerCase(),
    )
  ) {
    errors.email = 'Участник с таким e-mail уже есть в реестре.';
  }

  const passwordChecklist = buildPasswordChecklist(form.password);
  if (passwordChecklist.some((rule) => !rule.passed)) {
    errors.password = 'Пароль не прошёл все базовые правила.';
  }

  if (form.confirmPassword !== form.password || form.confirmPassword.length === 0) {
    errors.confirmPassword = 'Пароли должны совпадать.';
  }

  if (form.plan === 'team' && form.teamName.trim().length < 2) {
    errors.teamName = 'Для командной заявки нужно указать название команды.';
  }

  if (form.bio.trim().length < 20) {
    errors.bio = 'Коротко опишите цель обучения: минимум 20 символов.';
  }

  if (!form.acceptPolicy) {
    errors.acceptPolicy = 'Нужно согласиться с правилами и обработкой данных.';
  }

  return errors;
}

export function canSubmitRegistration(form: RegistrationForm) {
  return Object.keys(validateRegistrationForm(form)).length === 0;
}

export function buildRegistrationPayload(form: RegistrationForm): SubmittedRegistration {
  return {
    fullName: form.fullName.trim(),
    city: form.city.trim(),
    email: form.email.trim().toLowerCase(),
    focus: form.focus,
    experience: form.experience,
    plan: form.plan,
    teamName: form.plan === 'team' ? form.teamName.trim() : undefined,
    bio: form.bio.trim(),
    wantsDigest: form.wantsDigest,
  };
}

export function collectErrorMessages(errors: RegistrationErrors) {
  return Object.values(errors);
}
