import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { FormStatusWorkflowLab } from './FormStatusWorkflowLab';

describe('FormStatusWorkflowLab', () => {
  it('shows pending status and final activity result', async () => {
    const user = userEvent.setup();

    render(<FormStatusWorkflowLab />);

    await user.click(screen.getByRole('button', { name: 'Send lesson to review' }));

    expect(screen.getByText('Submitting lesson…')).toBeInTheDocument();
    expect(await screen.findByText(/отправлен на ревью для потока/)).toBeInTheDocument();
  });
});
