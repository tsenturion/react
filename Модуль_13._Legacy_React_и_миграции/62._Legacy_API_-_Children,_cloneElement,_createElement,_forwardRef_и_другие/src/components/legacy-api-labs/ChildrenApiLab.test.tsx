import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ChildrenApiLab } from './ChildrenApiLab';

describe('ChildrenApiLab', () => {
  it('shows Children.only failure for two sibling elements', async () => {
    const user = userEvent.setup();

    render(<ChildrenApiLab />);

    await user.click(screen.getByRole('button', { name: 'Два элемента' }));

    expect(
      screen.getByText(/React.Children.only expected to receive/i),
    ).toBeInTheDocument();
  });
});
