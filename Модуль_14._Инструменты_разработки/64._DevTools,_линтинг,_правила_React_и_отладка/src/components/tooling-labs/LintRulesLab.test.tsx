import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { LintRulesLab } from './LintRulesLab';

describe('LintRulesLab', () => {
  it('reveals strict-only findings when switching lint mode', async () => {
    const user = userEvent.setup();

    render(<LintRulesLab />);

    await user.click(screen.getByRole('button', { name: /Strict architecture lint/i }));

    expect(
      screen.getByText(/Strict linting находит дополнительные architectural issues/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Impure render logic/i)).toHaveLength(2);
  });
});
