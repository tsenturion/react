import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { TestGuardrailLab } from './TestGuardrailLab';

describe('TestGuardrailLab', () => {
  it('shows missing coverage when only unit layer stays selected', async () => {
    const user = userEvent.setup();

    render(<TestGuardrailLab />);

    await user.click(screen.getByRole('button', { name: 'component' }));
    await user.click(screen.getByRole('button', { name: 'integration' }));
    await user.click(screen.getByRole('button', { name: 'unit' }));

    expect(
      screen.getByText(/Test suite пока не держит миграцию как guardrail/i),
    ).toBeInTheDocument();
  });
});
