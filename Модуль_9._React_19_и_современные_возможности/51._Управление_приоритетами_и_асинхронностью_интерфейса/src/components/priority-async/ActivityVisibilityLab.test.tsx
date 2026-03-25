import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ActivityVisibilityLab } from './ActivityVisibilityLab';

describe('ActivityVisibilityLab', () => {
  it('preserves Activity draft after hide and show', async () => {
    const user = userEvent.setup();

    render(<ActivityVisibilityLab />);

    const activityDraft = screen.getByLabelText('Activity draft');
    await user.clear(activityDraft);
    await user.type(activityDraft, 'Preserved through Activity');

    await user.click(screen.getByRole('button', { name: 'Hide subtree' }));
    await user.click(screen.getByRole('button', { name: 'Show subtree' }));

    expect(screen.getByLabelText('Activity draft')).toHaveValue(
      'Preserved through Activity',
    );
    expect(screen.getByLabelText('Conditional draft')).not.toHaveValue(
      'Preserved through Activity',
    );
  });
});
