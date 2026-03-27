import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { LegacyRefsLab } from './LegacyRefsLab';

describe('LegacyRefsLab', () => {
  it('moves focus to input through createRef', async () => {
    const user = userEvent.setup();

    render(<LegacyRefsLab />);

    const input = screen.getByLabelText('Uncontrolled input');
    await user.click(screen.getByRole('button', { name: 'Фокус в input' }));

    expect(input).toHaveFocus();
  });
});
