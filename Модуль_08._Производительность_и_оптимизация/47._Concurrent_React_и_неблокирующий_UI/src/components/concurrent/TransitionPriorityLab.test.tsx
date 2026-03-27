import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { TransitionPriorityLab } from './TransitionPriorityLab';

describe('TransitionPriorityLab', () => {
  it('keeps urgent input value visible while transition mode is active', async () => {
    const user = userEvent.setup();

    render(<TransitionPriorityLab />);

    await user.type(screen.getByLabelText('Search query'), 'router');

    expect(screen.getByDisplayValue('router')).toBeInTheDocument();
    expect(
      screen.getAllByText(
        /Срочный feedback отделён от фоновой перерисовки|Тяжёлое обновление уже ушло в transition/,
      ).length,
    ).toBeGreaterThan(0);
  });
});
