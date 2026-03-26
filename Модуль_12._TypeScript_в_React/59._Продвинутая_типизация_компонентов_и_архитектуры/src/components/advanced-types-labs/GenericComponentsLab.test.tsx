import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { GenericComponentsLab } from './GenericComponentsLab';

describe('GenericComponentsLab', () => {
  it('switches scenario and filters token entities', async () => {
    const user = userEvent.setup();

    render(<GenericComponentsLab />);

    await user.click(screen.getByRole('button', { name: 'Tokens' }));
    await user.type(screen.getByLabelText('Filter query'), 'radius');

    expect(screen.getAllByText(/radius\.card/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/surface\.brand/i)).not.toBeInTheDocument();
  });
});
