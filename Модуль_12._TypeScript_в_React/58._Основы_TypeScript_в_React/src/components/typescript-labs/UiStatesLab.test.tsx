import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { UiStatesLab } from './UiStatesLab';

describe('UiStatesLab', () => {
  it('switches to empty and error branches', async () => {
    const user = userEvent.setup();

    render(<UiStatesLab />);

    await user.click(screen.getByRole('button', { name: 'Empty' }));
    expect(screen.getAllByText(/не нашлось ни одной записи/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: 'Error' }));
    expect(screen.getAllByText(/сетевой ошибки/i).length).toBeGreaterThan(0);
  });
});
