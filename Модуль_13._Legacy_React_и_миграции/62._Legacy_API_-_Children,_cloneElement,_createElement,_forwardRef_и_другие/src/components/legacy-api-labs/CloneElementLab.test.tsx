import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { CloneElementLab } from './CloneElementLab';

describe('CloneElementLab', () => {
  it('can override original child handlers when compose mode is disabled', async () => {
    const user = userEvent.setup();

    render(<CloneElementLab />);

    await user.click(screen.getByRole('button', { name: 'Compose child handler' }));
    await user.click(screen.getByRole('button', { name: 'Очистить лог' }));
    await user.click(screen.getByRole('button', { name: 'Share snapshot' }));

    expect(screen.getByText('Injected handler: share')).toBeInTheDocument();
    expect(screen.queryByText('Child handler: share')).not.toBeInTheDocument();
  });
});
