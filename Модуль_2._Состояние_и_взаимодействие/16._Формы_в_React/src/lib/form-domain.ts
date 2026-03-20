export type ControlledLessonForm = {
  fullName: string;
  bio: string;
  track: 'basics' | 'state' | 'forms';
  newsletter: boolean;
  contactPreference: 'email' | 'telegram' | 'phone';
};

export function createControlledLessonForm(): ControlledLessonForm {
  return {
    fullName: 'Ирина',
    bio: 'Нужен акцент на submit flow и validation.',
    track: 'forms',
    newsletter: true,
    contactPreference: 'email',
  };
}

export type SignupForm = {
  email: string;
  password: string;
  repeatPassword: string;
  agreeToTerms: boolean;
  plan: 'starter' | 'team';
};

export function createSignupForm(): SignupForm {
  return {
    email: '',
    password: '',
    repeatPassword: '',
    agreeToTerms: false,
    plan: 'starter',
  };
}

export type NativeComparisonForm = {
  topic: string;
  details: string;
  format: 'workshop' | 'review';
};

export function createNativeComparisonForm(): NativeComparisonForm {
  return {
    topic: 'Управление submit flow',
    details: 'Нужен живой пример с reportValidity и ручной валидацией.',
    format: 'review',
  };
}

export type PitfallMode =
  | 'checkbox-value'
  | 'missing-prevent-default'
  | 'dom-reset-vs-state';
