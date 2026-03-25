import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { UnifiedFeedbackFlowLab } from './UnifiedFeedbackFlowLab';

describe('UnifiedFeedbackFlowLab', () => {
  it('shows optimistic + returned success flow', async () => {
    const user = userEvent.setup();

    render(<UnifiedFeedbackFlowLab />);

    await user.click(screen.getByRole('button', { name: 'Run full workflow' }));

    expect(
      screen.getByRole('button', { name: 'Submitting full workflow…' }),
    ).toBeDisabled();
    expect(await screen.findByText('optimistic')).toBeInTheDocument();
    expect(
      await screen.findByText('Unified async flow подтверждено'),
    ).toBeInTheDocument();
  });
});
