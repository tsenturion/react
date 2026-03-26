import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ExecutionBoundaryLab } from './ExecutionBoundaryLab';

describe('ExecutionBoundaryLab', () => {
  it('switches to client-heavy preset and updates bundle summary', async () => {
    const user = userEvent.setup();

    render(<ExecutionBoundaryLab />);

    await user.click(screen.getByRole('button', { name: 'Client-heavy' }));

    expect(screen.getByText('110')).toBeInTheDocument();
    expect(screen.getByText(/Клиентская часть стала тяжёлой/i)).toBeInTheDocument();
  });
});
