import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ConstraintsLab } from './ConstraintsLab';

describe('ConstraintsLab', () => {
  it('marks window API scenario as invalid for server function', async () => {
    const user = userEvent.setup();

    render(<ConstraintsLab />);

    await user.click(screen.getByRole('button', { name: /Нужен window \/ DOM API/i }));

    expect(screen.getByText(/Browser API ломает server boundary/i)).toBeInTheDocument();
  });
});
