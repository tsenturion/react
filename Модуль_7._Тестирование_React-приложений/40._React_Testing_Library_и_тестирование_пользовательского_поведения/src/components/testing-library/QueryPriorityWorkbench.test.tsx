import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { QueryPriorityWorkbench } from './QueryPriorityWorkbench';

describe('QueryPriorityWorkbench', () => {
  it('reveals semantic surfaces that can be queried by role, label, alert, and status', async () => {
    const user = userEvent.setup();

    render(<QueryPriorityWorkbench />);

    expect(screen.getByRole('button', { name: 'Сохранить фильтр' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email для отчёта')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Показать ошибку' }));

    expect(screen.getByRole('alert')).toHaveTextContent(/сначала заполните email/i);

    await user.click(screen.getByRole('button', { name: 'Сохранить фильтр' }));

    expect(screen.getByRole('status')).toHaveTextContent(/фильтр сохранён/i);
  });
});
