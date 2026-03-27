import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { App } from './App';

describe('App integration', () => {
  it('adds a registered participant into the live roster', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText('Имя и фамилия'), 'Вера Соколова');
    await user.type(screen.getByLabelText('Город'), 'Челябинск');
    await user.type(screen.getByLabelText('E-mail'), 'vera@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'React2026');
    await user.type(screen.getByLabelText('Повторите пароль'), 'React2026');
    await user.type(
      screen.getByLabelText('О себе'),
      'Хочу участвовать в турнире и проверять, как работает реестр игроков.',
    );
    await user.click(
      screen.getByRole('checkbox', {
        name: /согласен с правилами участия/i,
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Добавить участника' }));

    expect(screen.getAllByText('Вера Соколова').length).toBeGreaterThan(0);
    expect(screen.getAllByText('vera@example.com').length).toBeGreaterThan(0);
  });
});
