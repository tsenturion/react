import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { FeedbackFormLab } from './FeedbackFormLab';

describe('FeedbackFormLab', () => {
  it('shows accessible alerts for invalid submit and a status banner after a valid flow', async () => {
    const user = userEvent.setup();

    render(<FeedbackFormLab />);

    await user.click(screen.getByRole('button', { name: 'Отправить сценарий' }));

    expect(screen.getAllByRole('alert').length).toBeGreaterThan(1);

    await user.type(screen.getByLabelText('Имя'), 'Анна');
    await user.type(screen.getByLabelText('Email'), 'anna@example.com');
    await user.type(
      screen.getByLabelText('Описание сценария'),
      'Проверка ошибки и успеха через пользовательский поток.',
    );
    await user.click(
      screen.getByRole('checkbox', {
        name: 'Разрешить включение сценария в regression review',
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Отправить сценарий' }));

    expect(screen.getByRole('status')).toHaveTextContent(/отправлен на review/i);
  });
});
