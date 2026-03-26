import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { HydrationMismatchLab } from './HydrationMismatchLab';

describe('HydrationMismatchLab', () => {
  it('can move from mismatch to stable initial render', async () => {
    const user = userEvent.setup();

    render(<HydrationMismatchLab />);

    expect(screen.getByText('Разметка сервера и клиента расходится')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Client locale'), 'ru-RU');
    await user.click(screen.getByLabelText('Зависимость от времени'));
    await user.click(screen.getByLabelText('Locale formatting'));

    expect(screen.getByText('Initial render стабилен')).toBeInTheDocument();
  });
});
