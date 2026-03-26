import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { PropsContractsLab } from './PropsContractsLab';

describe('PropsContractsLab', () => {
  it('switches scenario and updates typed contract view', async () => {
    const user = userEvent.setup();

    render(<PropsContractsLab />);

    await user.click(screen.getByRole('button', { name: 'Toolbar action' }));

    expect(screen.getByText(/destructive и neutral/i)).toBeInTheDocument();
    expect(screen.getAllByText(/confirmText/i).length).toBeGreaterThan(0);
  });
});
