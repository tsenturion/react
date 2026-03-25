import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { StartTransitionLab } from './StartTransitionLab';

describe('StartTransitionLab', () => {
  it('switches heavy workspace when startTransition mode is selected', async () => {
    const user = userEvent.setup();

    render(<StartTransitionLab />);

    await user.click(screen.getByRole('button', { name: 'Insights' }));

    expect(screen.getByText(/Workspace: insights workspace/i)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(/Переход к Insights зафиксирован/i),
    ).toBeInTheDocument();
  });
});
