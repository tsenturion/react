import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { InteractionSequenceLab } from './InteractionSequenceLab';

describe('InteractionSequenceLab', () => {
  it('drives the flow through user actions and waits for the visible async result', async () => {
    const user = userEvent.setup();

    render(<InteractionSequenceLab />);

    await user.click(screen.getByRole('button', { name: 'Открыть фильтры' }));
    await user.type(screen.getByLabelText('Поисковая строка'), 'rtl');

    const submitButton = screen.getByRole('button', { name: 'Применить фильтр' });

    expect(submitButton).toBeEnabled();

    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(await screen.findByRole('status')).toHaveTextContent(/rtl/i);
  });
});
