import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { CompositionBoundaryLab } from './CompositionBoundaryLab';

describe('CompositionBoundaryLab', () => {
  it('shows invalid client-to-server import and then valid slot composition', async () => {
    const user = userEvent.setup();

    render(<CompositionBoundaryLab />);

    const clientButtons = screen.getAllByRole('button', { name: 'client' });
    const serverButtons = screen.getAllByRole('button', { name: 'server' });

    await user.click(clientButtons[0]);
    await user.click(serverButtons[1]);

    expect(
      screen.getByText(/Client component не может импортировать server component/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Slot / children' }));

    expect(screen.getByText(/Это допустимая mixed composition/i)).toBeInTheDocument();
  });
});
