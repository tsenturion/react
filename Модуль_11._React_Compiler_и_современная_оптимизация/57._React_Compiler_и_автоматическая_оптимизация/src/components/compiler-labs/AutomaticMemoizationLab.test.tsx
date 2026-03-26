import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { AutomaticMemoizationLab } from './AutomaticMemoizationLab';

describe('AutomaticMemoizationLab', () => {
  it('switches scenario details and keeps compiler-friendly strategy visible', async () => {
    const user = userEvent.setup();

    render(<AutomaticMemoizationLab />);

    expect(screen.getByText('Compiler-friendly code')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Inspector table' }));

    expect(screen.getByText(/плотном списке строк/i)).toBeInTheDocument();
    expect(screen.getByText(/windowing\/virtualization/i)).toBeInTheDocument();
  });
});
