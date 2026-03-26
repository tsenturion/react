import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { DirectiveBoundaryLab } from './DirectiveBoundaryLab';

describe('DirectiveBoundaryLab', () => {
  it('switches to client-heavy preset and updates bundle summary', async () => {
    const user = userEvent.setup();

    render(<DirectiveBoundaryLab />);

    await user.click(screen.getByRole('button', { name: 'Client-heavy' }));

    expect(screen.getByText('98')).toBeInTheDocument();
    expect(screen.getByText(/Граница стала слишком клиентской/i)).toBeInTheDocument();
  });
});
