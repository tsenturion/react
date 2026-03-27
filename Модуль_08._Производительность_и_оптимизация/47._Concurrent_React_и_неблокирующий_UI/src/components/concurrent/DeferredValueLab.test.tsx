import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { DeferredValueLab } from './DeferredValueLab';

describe('DeferredValueLab', () => {
  it('shows current input immediately when query changes', async () => {
    const user = userEvent.setup();

    render(<DeferredValueLab />);

    await user.type(screen.getByLabelText('Deferred search query'), 'draft');

    expect(screen.getByDisplayValue('draft')).toBeInTheDocument();
  });
});
