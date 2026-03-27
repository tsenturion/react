import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { RegistrationLab } from './RegistrationLab';

describe('RegistrationLab', () => {
  it('shows errors on invalid submit and saves payload on valid submit', async () => {
    const user = userEvent.setup();

    render(<RegistrationLab />);

    await user.click(screen.getByRole('button', { name: 'Добавить участника' }));

    expect(screen.getByText('Форма ещё не готова к отправке')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Имя и фамилия'), 'Ирина Петрова');
    await user.type(screen.getByLabelText('Город'), 'Екатеринбург');
    await user.type(screen.getByLabelText('E-mail'), 'irina@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'React2026');
    await user.type(screen.getByLabelText('Повторите пароль'), 'React2026');
    await user.type(
      screen.getByLabelText('О себе'),
      'Хочу проверить controlled form, conditional validation и a11y-атрибуты.',
    );
    await user.click(
      screen.getByRole('checkbox', {
        name: /согласен с правилами/i,
      }),
    );

    await user.click(screen.getByRole('button', { name: 'Добавить участника' }));

    expect(screen.getByRole('status')).toHaveTextContent(
      'Участник добавлен в реестр. Теперь его можно найти в таблице и поставить в матч.',
    );
    expect(screen.getByText(/"email": "irina@example.com"/)).toBeInTheDocument();
  });
});
