import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { FrameworkComparisonLab } from './FrameworkComparisonLab';

describe('FrameworkComparisonLab', () => {
  it('promotes React Router when incremental adoption becomes important', async () => {
    const user = userEvent.setup();

    render(<FrameworkComparisonLab />);

    await user.click(
      screen.getByRole('button', { name: /Важно внедрять framework постепенно/i }),
    );

    expect(screen.getByText(/React Router framework mode/i)).toBeInTheDocument();
  });
});
