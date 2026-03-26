import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ReducerUnionLab } from './ReducerUnionLab';

describe('ReducerUnionLab', () => {
  it('switches to checklist branch and adds a new item', async () => {
    const user = userEvent.setup();

    render(<ReducerUnionLab />);

    await user.click(screen.getByRole('button', { name: 'Checklist' }));
    await user.type(
      screen.getByLabelText('Checklist item'),
      'Проверить generic contracts',
    );
    await user.click(screen.getByRole('button', { name: 'Add item' }));

    expect(screen.getByText(/проверить generic contracts/i)).toBeInTheDocument();
    expect(screen.getAllByText(/checklist/i).length).toBeGreaterThan(0);
  });
});
