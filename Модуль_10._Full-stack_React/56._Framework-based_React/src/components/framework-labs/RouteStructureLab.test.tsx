import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { RouteStructureLab } from './RouteStructureLab';

describe('RouteStructureLab', () => {
  it('switches to React Router tree', async () => {
    const user = userEvent.setup();

    render(<RouteStructureLab />);

    await user.click(screen.getByRole('button', { name: 'React Router framework' }));

    expect(
      screen.getByText((content) => content.includes('routes/dashboard.tsx')),
    ).toBeInTheDocument();
  });
});
