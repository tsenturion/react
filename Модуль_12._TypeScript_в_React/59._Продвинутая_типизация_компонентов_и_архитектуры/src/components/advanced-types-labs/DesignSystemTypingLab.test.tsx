import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { DesignSystemTypingLab } from './DesignSystemTypingLab';

describe('DesignSystemTypingLab', () => {
  it('switches to link recipe and shows loading label', async () => {
    const user = userEvent.setup();

    render(<DesignSystemTypingLab />);

    await user.click(screen.getByRole('button', { name: 'Open migration guide' }));
    await user.click(screen.getByRole('checkbox', { name: /simulate loading/i }));

    expect(screen.getByText(/loading recipe/i)).toBeInTheDocument();
    expect(screen.getAllByText(/link/i).length).toBeGreaterThan(0);
  });
});
