import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { AsyncServerComponentsLab } from './AsyncServerComponentsLab';

describe('AsyncServerComponentsLab', () => {
  it('switches scenario and shows the corresponding data note', async () => {
    const user = userEvent.setup();

    render(<AsyncServerComponentsLab />);

    await user.click(screen.getByRole('button', { name: 'Account overview' }));

    expect(screen.getByText(/Профиль, квоты и billing summary/i)).toBeInTheDocument();
  });
});
