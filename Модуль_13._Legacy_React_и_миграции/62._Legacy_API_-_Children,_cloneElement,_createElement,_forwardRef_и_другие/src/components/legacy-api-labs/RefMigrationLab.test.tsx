import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { RefMigrationLab } from './RefMigrationLab';

describe('RefMigrationLab', () => {
  it('focuses the React 19 ref-as-prop field imperatively', async () => {
    const user = userEvent.setup();

    render(<RefMigrationLab />);

    const input = screen.getByLabelText('React 19 ref-as-prop');
    await user.click(screen.getByRole('button', { name: 'Фокус через ref-as-prop' }));

    expect(input).toHaveFocus();
  });
});
