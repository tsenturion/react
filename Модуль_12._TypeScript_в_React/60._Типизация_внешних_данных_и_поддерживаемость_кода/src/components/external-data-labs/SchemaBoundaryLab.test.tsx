import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { SchemaBoundaryLab } from './SchemaBoundaryLab';

describe('SchemaBoundaryLab', () => {
  it('shows schema issues for broken payload', async () => {
    const user = userEvent.setup();

    render(<SchemaBoundaryLab />);

    await user.click(screen.getByRole('button', { name: 'Bad enum' }));

    expect(screen.getByText(/schema error/i)).toBeInTheDocument();
    expect(screen.getAllByText(/stage:/i).length).toBeGreaterThan(0);
  });
});
