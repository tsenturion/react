import { describe, expect, it } from 'vitest';

import { createRosterMemberFromRegistration, assignSeat } from './arena-app-model';
import { rosterMembers } from './roster-data';

describe('arena app model', () => {
  it('creates a real roster member from registration payload', () => {
    const member = createRosterMemberFromRegistration(
      {
        fullName: 'Ирина Петрова',
        city: 'Екатеринбург',
        email: 'irina@example.com',
        focus: 'forms',
        experience: 'switcher',
        plan: 'team',
        teamName: 'State Mechanics',
        bio: 'Хочу проверить форму регистрации в реальном продукте.',
        wantsDigest: true,
      },
      rosterMembers,
    );

    expect(member).toMatchObject({
      name: 'Ирина Петрова',
      city: 'Екатеринбург',
      track: 'forms',
      status: 'review',
      mentor: 'Мария Тихонова',
      teamName: 'State Mechanics',
    });
  });

  it('keeps one participant in only one match seat', () => {
    const seats = assignSeat(
      { X: 'nina-litvinova', O: 'sofia-ermakova' },
      'O',
      'nina-litvinova',
    );

    expect(seats).toEqual({
      X: null,
      O: 'nina-litvinova',
    });
  });
});
