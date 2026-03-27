import { describe, expect, it } from 'vitest';

import {
  buildPasswordChecklist,
  buildRegistrationPayload,
  canSubmitRegistration,
  createRegistrationForm,
  validateRegistrationForm,
} from './registration-model';

describe('registration model', () => {
  it('requires a team name for team registrations', () => {
    const form = {
      ...createRegistrationForm(),
      fullName: 'Ирина Петрова',
      city: 'Екатеринбург',
      email: 'irina@example.com',
      password: 'React2026',
      confirmPassword: 'React2026',
      plan: 'team' as const,
      bio: 'Хочу проверить conditional validation и submit flow.',
      acceptPolicy: true,
    };

    expect(validateRegistrationForm(form).teamName).toBeTruthy();
  });

  it('allows a valid solo registration and trims payload values', () => {
    const form = {
      ...createRegistrationForm(),
      fullName: '  Ирина Петрова ',
      city: ' Екатеринбург ',
      email: 'IRINA@Example.com ',
      password: 'React2026',
      confirmPassword: 'React2026',
      bio: 'Хочу собрать форму без duplicated state и рассыпающихся ошибок.',
      acceptPolicy: true,
    };

    expect(canSubmitRegistration(form)).toBe(true);
    expect(buildRegistrationPayload(form)).toEqual({
      fullName: 'Ирина Петрова',
      city: 'Екатеринбург',
      email: 'irina@example.com',
      focus: 'data',
      experience: 'student',
      plan: 'solo',
      teamName: undefined,
      bio: 'Хочу собрать форму без duplicated state и рассыпающихся ошибок.',
      wantsDigest: true,
    });
  });

  it('marks spaces in password checklist as a failing rule', () => {
    const checklist = buildPasswordChecklist('abc 123');

    expect(checklist.find((rule) => rule.id === 'spaces')?.passed).toBe(false);
  });

  it('rejects duplicate e-mails from the current roster', () => {
    const form = {
      ...createRegistrationForm(),
      fullName: 'Ирина Петрова',
      city: 'Екатеринбург',
      email: 'irina@example.com',
      password: 'React2026',
      confirmPassword: 'React2026',
      bio: 'Хочу собрать форму без duplicated state и рассыпающихся ошибок.',
      acceptPolicy: true,
    };

    expect(
      validateRegistrationForm(form, { existingEmails: ['irina@example.com'] }).email,
    ).toBe('Участник с таким e-mail уже есть в реестре.');
  });
});
